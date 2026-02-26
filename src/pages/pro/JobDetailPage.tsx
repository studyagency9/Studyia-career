import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { CVUploadZone } from '@/components/pro/CVUploadZone';
import { CVAnalysisProgress } from '@/components/pro/CVAnalysisProgress';
import { ScoreBadge } from '@/components/pro/ScoreBadge';
import { useToast } from '@/hooks/use-toast';
import { jobPostsService } from '@/services/jobPostsService';
import { candidatesService } from '@/services/candidatesService';
import { useCandidates } from '@/hooks/useCandidates';
import {
  ArrowLeft,
  Users,
  Calendar,
  MapPin,
  Briefcase,
  DollarSign,
  MoreVertical,
  Sparkles,
  Filter,
  UserCheck,
  UserX,
  Clock,
  Upload,
  Play,
  Pause,
  Archive,
  ChevronDown,
  ChevronUp,
  FileText,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { JobPost } from '@/types/jobPost';

const JobDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // TOUS LES HOOKS DOIVENT ÊTRE APPELÉS AVANT TOUT RETURN CONDITIONNEL
  const [jobPost, setJobPost] = useState<JobPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStage, setAnalysisStage] = useState<'uploading' | 'extracting' | 'matching' | 'completed'>('uploading');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [filters, setFilters] = useState({
    gender: 'all',
    city: 'all',
    minExperience: 'all',
    maxAge: 'all',
  });
  
  const { candidates: apiCandidates, loading: candidatesLoading, fetchCandidates } = useCandidates(id || '');
  
  // Charger les données du job
  useEffect(() => {
    const fetchJobPost = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await jobPostsService.getJobPost(id);
        setJobPost(data);
      } catch (error) {
        console.error('Erreur lors du chargement du job:', error);
        toast({
          title: '❌ Erreur',
          description: 'Impossible de charger l\'offre d\'emploi',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobPost();
  }, [id]);
  
  // Gérer le changement de statut
  const handleStatusChange = async (newStatus: 'active' | 'closed' | 'archived') => {
    if (!id || !jobPost) return;
    
    try {
      setIsUpdatingStatus(true);
      console.log('🔄 Changement de statut:', { from: jobPost.status, to: newStatus });
      
      let updatedJob: JobPost;
      if (newStatus === 'active') {
        updatedJob = await jobPostsService.publishJobPost(id);
        console.log('✅ Réponse publishJobPost:', updatedJob);
        toast({
          title: '✅ Offre activée',
          description: 'L\'offre est maintenant visible et accepte les candidatures',
        });
      } else if (newStatus === 'closed') {
        updatedJob = await jobPostsService.closeJobPost(id);
        console.log('✅ Réponse closeJobPost:', updatedJob);
        toast({
          title: '⏸️ Offre fermée',
          description: 'L\'offre n\'accepte plus de nouvelles candidatures',
        });
      } else {
        updatedJob = await jobPostsService.updateJobPost(id, { status: 'archived' });
        console.log('✅ Réponse updateJobPost (archived):', updatedJob);
        toast({
          title: '📦 Offre archivée',
          description: 'L\'offre a été archivée',
        });
      }
      
      console.log('📊 Statut après mise à jour:', updatedJob.status);
      setJobPost(updatedJob);
      
      // Recharger les données depuis le backend pour s'assurer de la persistance
      setTimeout(async () => {
        try {
          const freshData = await jobPostsService.getJobPost(id);
          console.log('🔄 Données rechargées depuis le backend:', freshData.status);
          setJobPost(freshData);
        } catch (error) {
          console.error('Erreur lors du rechargement:', error);
        }
      }, 500);
      
    } catch (error: any) {
      console.error('❌ Erreur lors du changement de statut:', error);
      console.error('❌ Détails:', error.response?.data || error.message);
      toast({
        title: '❌ Erreur',
        description: error.response?.data?.message || 'Impossible de modifier le statut',
        variant: 'destructive',
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };
  
  // MAINTENANT ON PEUT FAIRE LES RETURN CONDITIONNELS
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!jobPost) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Offre introuvable</h2>
        <Button onClick={() => navigate('/pro/jobs')}>Retour aux offres</Button>
      </div>
    );
  }

  const handleFilesSelected = (files: File[]) => {
    setUploadedFiles(files);
    toast({
      title: '📁 Fichiers sélectionnés',
      description: `${files.length} CV prêt${files.length > 1 ? 's' : ''} à être analysé${files.length > 1 ? 's' : ''}`,
    });
  };

  const handleAnalyzeCV = async () => {
    if (uploadedFiles.length === 0) {
      toast({
        title: '⚠️ Aucun fichier',
        description: 'Veuillez d\'abord sélectionner des CV à analyser',
        variant: 'destructive',
      });
      return;
    }

    if (!id) {
      toast({
        title: '❌ Erreur',
        description: 'ID de l\'offre manquant',
        variant: 'destructive',
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisStage('uploading');

    try {
      // 1. Upload des CV vers le backend
      const uploadResult = await candidatesService.uploadCVs(id, uploadedFiles);
      
      toast({
        title: '📤 Upload réussi',
        description: `${uploadResult.totalUploaded} CV uploadé${uploadResult.totalUploaded > 1 ? 's' : ''}`,
      });

      // 2. Extraction et analyse avec l'IA
      setAnalysisStage('extracting');
      
      const candidateIds = uploadResult.uploadedFiles.map(f => f.candidateId);
      
      // 3. Matching avec l'offre d'emploi
      setAnalysisStage('matching');
      const analysisResult = await candidatesService.analyzeCVs(id, candidateIds);

      // 4. Terminé
      setAnalysisStage('completed');
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setIsAnalyzing(false);
      setUploadedFiles([]);

      toast({
        title: '✨ Analyse terminée !',
        description: `${analysisResult.analyzed} CV analysé${analysisResult.analyzed > 1 ? 's' : ''} avec succès`,
      });

      // Recharger la liste des candidats pour afficher les nouveaux
      await fetchCandidates({ sortBy: 'matchingAnalysis.globalScore', sortOrder: 'desc' });
      
    } catch (error: any) {
      setIsAnalyzing(false);
      
      const errorMessage = error.response?.data?.message || error.message || 'Une erreur est survenue';
      
      toast({
        title: '❌ Erreur',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: { label: 'Actif', color: 'bg-green-100 text-green-700 border-green-200' },
      draft: { label: 'Brouillon', color: 'bg-gray-100 text-gray-700 border-gray-200' },
      closed: { label: 'Fermé', color: 'bg-red-100 text-red-700 border-red-200' },
    };
    const variant = variants[status as keyof typeof variants] || variants.draft;
    return (
      <Badge variant="outline" className={variant.color}>
        {variant.label}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/pro/jobs')}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour aux offres
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate(`/pro/jobs/edit/${id}`)}>
                  Modifier l'offre
                </DropdownMenuItem>
                <DropdownMenuItem onClick={async () => {
                  if (!id) return;
                  try {
                    await jobPostsService.duplicateJobPost(id);
                    toast({
                      title: '✅ Offre dupliquée',
                      description: 'L\'offre a été dupliquée avec succès',
                    });
                    navigate('/pro/jobs');
                  } catch (error) {
                    toast({
                      title: '❌ Erreur',
                      description: 'Impossible de dupliquer l\'offre',
                      variant: 'destructive',
                    });
                  }
                }}>
                  Dupliquer
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-red-600"
                  onClick={async () => {
                    if (!id || !confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) return;
                    try {
                      await jobPostsService.deleteJobPost(id);
                      toast({
                        title: '✅ Offre supprimée',
                        description: 'L\'offre a été supprimée avec succès',
                      });
                      navigate('/pro/jobs');
                    } catch (error) {
                      toast({
                        title: '❌ Erreur',
                        description: 'Impossible de supprimer l\'offre',
                        variant: 'destructive',
                      });
                    }
                  }}
                >
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Boutons de gestion de statut */}
            <div className="flex gap-2">
              {jobPost.status !== 'active' && (
                <Button
                  onClick={() => handleStatusChange('active')}
                  disabled={isUpdatingStatus}
                  className="gap-2 bg-green-600 hover:bg-green-700"
                >
                  <Play className="w-4 h-4" />
                  Activer
                </Button>
              )}
              {jobPost.status === 'active' && (
                <Button
                  onClick={() => handleStatusChange('closed')}
                  disabled={isUpdatingStatus}
                  variant="outline"
                  className="gap-2"
                >
                  <Pause className="w-4 h-4" />
                  Fermer
                </Button>
              )}
              {jobPost.status !== 'archived' && (
                <Button
                  onClick={() => handleStatusChange('archived')}
                  disabled={isUpdatingStatus}
                  variant="outline"
                  className="gap-2"
                >
                  <Archive className="w-4 h-4" />
                  Archiver
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {jobPost.title}
                </h1>
                {jobPost.isUrgent && (
                  <Badge className="bg-red-500">Urgent</Badge>
                )}
                {getStatusBadge(jobPost.status)}
              </div>
              <p className="text-lg text-gray-600 mb-4">{jobPost.company}</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {jobPost.city}, {jobPost.country}
                  {jobPost.remote && ' • Télétravail'}
                </div>
                <div className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4" />
                  {jobPost.experience}
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  {jobPost.salaryMin && jobPost.salaryMax 
                    ? `${jobPost.salaryMin.toLocaleString()} - ${jobPost.salaryMax.toLocaleString()} ${jobPost.currency}`
                    : 'Salaire non renseigné'
                  }
                </div>
                <div className={`flex items-center gap-1 ${new Date(jobPost.deadline) < new Date() ? 'text-red-600 font-semibold' : ''}`}>
                  <Calendar className="w-4 h-4" />
                  {new Date(jobPost.deadline) < new Date() 
                    ? `Expiré le ${new Date(jobPost.deadline).toLocaleDateString('fr-FR')}`
                    : `Expire le ${new Date(jobPost.deadline).toLocaleDateString('fr-FR')}`
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card className="p-6 bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total candidatures</p>
                <p className="text-3xl font-bold text-gray-900">{jobPost.stats?.totalCandidates || apiCandidates.length}</p>
              </div>
              <div className="w-14 h-14 rounded-full bg-violet-600 flex items-center justify-center">
                <Users className="w-7 h-7 text-white" />
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Nouvelles candidatures</p>
                <p className="text-3xl font-bold text-blue-600">{jobPost.stats?.newCandidates || 0}</p>
              </div>
              <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center">
                <UserCheck className="w-7 h-7 text-white" />
              </div>
            </div>
          </Card>
        </div>

        {/* Description du poste */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-violet-600" />
            Description du poste
          </h2>
          <div className="relative">
            <div 
              className={`prose max-w-none text-gray-700 whitespace-pre-wrap transition-all duration-300 overflow-hidden ${
                isDescriptionExpanded ? 'max-h-none' : 'max-h-48'
              }`}
            >
              {jobPost.description}
            </div>
            {jobPost.description && jobPost.description.length > 300 && (
              <div className={`${!isDescriptionExpanded ? 'absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent' : ''}`}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                  className="w-full mt-2 text-violet-600 hover:text-violet-700 hover:bg-violet-50"
                >
                  {isDescriptionExpanded ? (
                    <>
                      <ChevronUp className="w-4 h-4 mr-1" />
                      Voir moins
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4 mr-1" />
                      Voir plus
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
          
          {/* Compétences requises */}
          {jobPost.requiredSkills && jobPost.requiredSkills.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Compétences requises</h3>
              <div className="flex flex-wrap gap-2">
                {jobPost.requiredSkills.map((skill) => (
                  <Badge key={skill} className="bg-gradient-to-r from-blue-600 to-purple-600">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* Compétences optionnelles */}
          {jobPost.optionalSkills && jobPost.optionalSkills.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Compétences souhaitées</h3>
              <div className="flex flex-wrap gap-2">
                {jobPost.optionalSkills.map((skill) => (
                  <Badge key={skill} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne gauche - Upload CV */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
                  <Upload className="w-5 h-5 text-violet-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  Ajouter des candidatures
                </h2>
              </div>
              <CVUploadZone 
                onFilesSelected={handleFilesSelected}
                onAnalyzeAll={handleAnalyzeCV}
                isAnalyzing={isAnalyzing}
              />
            </Card>
          </div>

          {/* Colonne droite - Liste candidats */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Candidats ({apiCandidates.length})
                </h2>
              </div>

              {/* Filtres avancés */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6 p-4 bg-gray-50 rounded-lg">
                <Select value={filters.gender} onValueChange={(value) => setFilters({...filters, gender: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Genre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les genres</SelectItem>
                    <SelectItem value="male">Homme</SelectItem>
                    <SelectItem value="female">Femme</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filters.city} onValueChange={(value) => setFilters({...filters, city: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Ville" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les villes</SelectItem>
                    <SelectItem value="Dakar">Dakar</SelectItem>
                    <SelectItem value="Abidjan">Abidjan</SelectItem>
                    <SelectItem value="Bamako">Bamako</SelectItem>
                    <SelectItem value="Conakry">Conakry</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filters.minExperience} onValueChange={(value) => setFilters({...filters, minExperience: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Expérience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toute expérience</SelectItem>
                    <SelectItem value="0">0-1 an</SelectItem>
                    <SelectItem value="2">2-3 ans</SelectItem>
                    <SelectItem value="4">4-5 ans</SelectItem>
                    <SelectItem value="6">6+ ans</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filters.maxAge} onValueChange={(value) => setFilters({...filters, maxAge: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Âge" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les âges</SelectItem>
                    <SelectItem value="25">Moins de 25 ans</SelectItem>
                    <SelectItem value="30">Moins de 30 ans</SelectItem>
                    <SelectItem value="35">Moins de 35 ans</SelectItem>
                    <SelectItem value="40">Moins de 40 ans</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                {apiCandidates.map((candidate, index) => {
                  // Vérifications de sécurité pour éviter les erreurs
                  if (!candidate.cvData || !candidate.cvData.personalInfo) {
                    return null;
                  }
                  
                  const personalInfo = candidate.cvData.personalInfo;
                  const fullName = `${personalInfo.firstName || 'Prénom'} ${personalInfo.lastName || 'Nom'}`;
                  const score = candidate.matchingAnalysis?.globalScore || 0;
                  const yearsOfExperience = candidate.cvData.experiences?.length || 0;
                  const firstNameInitial = personalInfo.firstName?.charAt(0) || '?';
                  
                  return (
                    <motion.div
                      key={candidate._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => navigate(`/pro/candidates/${candidate._id}`)}
                      className="p-4 border border-gray-200 rounded-lg hover:border-violet-300 hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                            {firstNameInitial}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{fullName}</h3>
                            <p className="text-sm text-gray-600">{personalInfo.email || 'Email non renseigné'}</p>
                          </div>
                        </div>
                        <ScoreBadge score={score} />
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {personalInfo.city || 'Ville non renseignée'}
                        </div>
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-3.5 h-3.5" />
                          {yearsOfExperience} {yearsOfExperience > 1 ? 'expériences' : 'expérience'}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(candidate.createdAt).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {apiCandidates.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Aucun candidat pour le moment
                  </h3>
                  <p className="text-gray-600">
                    Uploadez des CV pour commencer à recevoir des candidatures
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Modal analyse en cours */}
      <AnimatePresence>
        {isAnalyzing && (
          <CVAnalysisProgress
            stage={analysisStage}
            totalFiles={uploadedFiles.length}
            processedFiles={analysisStage === 'completed' ? uploadedFiles.length : 0}
            currentFile={uploadedFiles[0]?.name}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default JobDetailPage;
