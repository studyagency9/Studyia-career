import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { candidatesService, type Candidate } from '@/services/candidatesService';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { MatchingAnalysis } from '@/components/pro/MatchingAnalysis';
import { ScoreBadge } from '@/components/pro/ScoreBadge';
import { TemplateSelectionModal } from '@/components/pro/TemplateSelectionModal';
import { convertCandidateToCVData } from '@/utils/candidateToCVData';
import { generatePDFBlob } from '@/utils/pdfGenerator';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Download,
  ExternalLink,
  Calendar,
  Briefcase,
  GraduationCap,
  Award,
  FileText,
} from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';


const CandidateDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('cv');
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    const fetchCandidate = async () => {
      if (!id) {
        console.error('❌ Aucun ID de candidat fourni');
        return;
      }
      
      console.log('🔍 Chargement du candidat avec ID:', id);
      
      try {
        setLoading(true);
        const data = await candidatesService.getCandidate(id);
        console.log('✅ Candidat chargé:', data);
        setCandidate(data);
      } catch (error: any) {
        console.error('❌ Erreur lors du chargement du candidat:', error);
        console.error('❌ Détails de l\'erreur:', error.response?.data || error.message);
        toast({
          title: '❌ Erreur',
          description: error.response?.data?.message || 'Impossible de charger les détails du candidat',
          variant: 'destructive',
        });
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidate();
  }, [id, navigate, toast]);

  const handleContact = () => {
    if (candidate?.cvData?.personalInfo?.email) {
      window.location.href = `mailto:${candidate.cvData.personalInfo.email}`;
    }
  };

  const handleDownloadCV = () => {
    if (candidate?.originalFileUrl) {
      window.open(candidate.originalFileUrl, '_blank');
    }
  };

  const handleDownloadWithTemplate = () => {
    setIsTemplateModalOpen(true);
  };

  const handleGeneratePDF = async (templateId: string) => {
    if (!candidate) return;

    try {
      setIsGeneratingPDF(true);
      
      toast({
        title: '📝 Génération du CV',
        description: 'Création du PDF avec le template sélectionné...',
      });

      // Convertir les données du candidat au format CVData
      const cvData = convertCandidateToCVData(candidate, templateId);
      
      // Générer le PDF
      const pdfBlob = await generatePDFBlob(cvData);
      
      // Télécharger le PDF
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `CV_${candidate.cvData.personalInfo.firstName}_${candidate.cvData.personalInfo.lastName}_${templateId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: '✅ CV téléchargé',
        description: 'Le CV a été généré avec succès',
      });

      setIsTemplateModalOpen(false);
    } catch (error: any) {
      console.error('❌ Erreur lors de la génération du PDF:', error);
      toast({
        title: '❌ Erreur',
        description: error.message || 'Impossible de générer le PDF',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      new: { label: 'Nouveau', color: 'bg-blue-100 text-blue-700 border-blue-200' },
      reviewed: { label: 'Examiné', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
      shortlisted: { label: 'Présélectionné', color: 'bg-green-100 text-green-700 border-green-200' },
      rejected: { label: 'Rejeté', color: 'bg-red-100 text-red-700 border-red-200' },
    };
    const variant = variants[status as keyof typeof variants] || variants.new;
    return (
      <Badge variant="outline" className={variant.color}>
        {variant.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des détails du candidat...</p>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Candidat introuvable</p>
          <Button onClick={() => navigate(-1)} className="mt-4">
            Retour
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="gap-2 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>

          <div className="flex items-start justify-between">
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {candidate.cvData.personalInfo.firstName.charAt(0)}
                {candidate.cvData.personalInfo.lastName.charAt(0)}
              </div>

              {/* Infos */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {candidate.cvData.personalInfo.firstName} {candidate.cvData.personalInfo.lastName}
                  </h1>
                  {getStatusBadge(candidate.status)}
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-4">
                  <div className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {candidate.cvData.personalInfo.email}
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {candidate.cvData.personalInfo.phone}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {candidate.cvData.personalInfo.city}, {candidate.cvData.personalInfo.country}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Postulé le {new Date(candidate.createdAt).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              </div>
            </div>

            {/* Score et actions */}
            <div className="flex flex-col items-end gap-3">
              <ScoreBadge score={candidate.matchingAnalysis?.globalScore || 0} size="large" />
              <div className="flex gap-2">
                <Button onClick={handleContact} className="gap-2">
                  <Mail className="w-4 h-4" />
                  Contacter
                </Button>
                <Button 
                  onClick={handleDownloadWithTemplate} 
                  className="gap-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700"
                >
                  <FileText className="w-4 h-4" />
                  Télécharger CV
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Résumé professionnel en haut - Toujours visible */}
        <Card className="p-6 mb-6 bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-violet-600 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-900 mb-2">
                Résumé professionnel
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {candidate.cvData?.professionalSummary || 'Aucun résumé professionnel disponible'}
              </p>
            </div>
          </div>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="cv">Parcours professionnel</TabsTrigger>
            <TabsTrigger value="matching">Analyse de compatibilité</TabsTrigger>
          </TabsList>

          {/* Tab CV */}
          <TabsContent value="cv" className="space-y-6">

            {/* Expériences */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-violet-600" />
                Expérience professionnelle
              </h2>
              <div className="space-y-6">
                {(candidate.cvData?.experiences || []).map((exp, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative pl-6 border-l-2 border-violet-200"
                  >
                    <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-violet-600" />
                    <div className="mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {exp.position}
                      </h3>
                      <p className="text-violet-600 font-medium">{exp.company}</p>
                      <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                        <span>{exp.location || 'Localisation non renseignée'}</span>
                        <span>•</span>
                        <span>
                          {exp.startDate ? new Date(exp.startDate).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short' }) : 'Date inconnue'}
                          {' - '}
                          {exp.current ? 'Présent' : (exp.endDate ? new Date(exp.endDate).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short' }) : 'Date inconnue')}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {exp.description || exp.responsibilities || 'Aucune description disponible'}
                    </p>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Formation */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-violet-600" />
                Formation
              </h2>
              <div className="space-y-6">
                {(candidate.cvData?.education || []).map((edu, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative pl-6 border-l-2 border-violet-200"
                  >
                    <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-violet-600" />
                    <div className="mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {edu.degree}
                      </h3>
                      <p className="text-violet-600 font-medium">{edu.institution}</p>
                      <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                        <span>
                          {edu.startDate ? new Date(edu.startDate).getFullYear() : 'Année inconnue'}
                          {' - '}
                          {edu.current ? 'En cours' : (edu.endDate ? new Date(edu.endDate).getFullYear() : 'Année inconnue')}
                        </span>
                        {edu.field && (
                          <>
                            <span>•</span>
                            <span>{edu.field}</span>
                          </>
                        )}
                      </div>
                    </div>
                    {edu.description && (
                      <p className="text-gray-700">
                        {edu.description}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Compétences */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Award className="w-5 h-5 text-violet-600" />
                Compétences
              </h2>
              <div className="flex flex-wrap gap-2">
                {(candidate.cvData?.skills || []).map((skill, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Badge
                      variant="outline"
                      className="bg-violet-50 text-violet-700 border-violet-200 px-3 py-1"
                    >
                      {typeof skill === 'string' ? skill : skill.name}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Tab Matching */}
          <TabsContent value="matching">
            {candidate.matchingAnalysis ? (
              <MatchingAnalysis analysis={candidate.matchingAnalysis} />
            ) : (
              <Card className="p-6">
                <p className="text-gray-600 text-center">Aucune analyse de compatibilité disponible</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal de sélection de template */}
      <TemplateSelectionModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelectTemplate={handleGeneratePDF}
        candidateName={`${candidate.cvData.personalInfo.firstName} ${candidate.cvData.personalInfo.lastName}`}
        isGenerating={isGeneratingPDF}
        cvData={candidate ? convertCandidateToCVData(candidate, 'professional') : undefined}
      />
    </div>
  );
};

export default CandidateDetailPage;
