import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { jobPostsService } from '@/services/jobPostsService';
import type { CreateJobPostData } from '@/types/jobPost';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Save, 
  X,
  Plus,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AutocompleteInput } from '@/components/pro/AutocompleteInput';
import { searchJobTitles, skills } from '@/data/jobSuggestions';
import { getSuggestedSkills } from '@/data/skillsByCategory';
import { getAllCountryNames, searchCities } from '@/data/countriesAndCities';
import type { 
  ExperienceLevel, 
  EducationLevel, 
  ContractType,
  LanguageRequirement,
  Gender,
  MaritalStatus,
  DrivingLicense
} from '@/types/jobPost';

const EditJobPostPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentSkill, setCurrentSkill] = useState('');
  const [currentOptionalSkill, setCurrentOptionalSkill] = useState('');
  
  const [formData, setFormData] = useState<Partial<CreateJobPostData & {
    languageRequirement: LanguageRequirement;
    gender: Gender;
    maritalStatus: MaritalStatus;
    minAge?: number;
    maxAge?: number;
    childrenAccepted: boolean;
    drivingLicense: DrivingLicense;
  }>>({
    title: '',
    company: '',
    description: '',
    city: '',
    country: '',
    remote: false,
    requiredSkills: [],
    optionalSkills: [],
    education: [],
    experience: 'mid' as ExperienceLevel,
    minYearsExperience: 0,
    contractType: 'full_time' as ContractType,
    salaryMin: undefined,
    salaryMax: undefined,
    currency: 'XOF',
    deadline: '',
    startDate: '',
    status: 'active',
    isUrgent: false,
    languageRequirement: 'none',
    gender: 'any',
    maritalStatus: 'any',
    childrenAccepted: true,
    drivingLicense: 'not_required',
    contactEmail: '',
    contactPhone: '',
    contactWhatsApp: '',
    contactAddress: '',
    contactWebsite: '',
  });

  // Charger les données de l'offre
  useEffect(() => {
    const fetchJobPost = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await jobPostsService.getJobPost(id);
        
        // Pré-remplir le formulaire avec les données existantes
        setFormData({
          title: data.title,
          company: data.company,
          description: data.description,
          city: data.city,
          country: data.country,
          remote: data.remote,
          requiredSkills: data.requiredSkills,
          optionalSkills: data.optionalSkills || [],
          education: data.education,
          experience: data.experience,
          minYearsExperience: data.minYearsExperience,
          contractType: data.contractType,
          salaryMin: data.salaryMin,
          salaryMax: data.salaryMax,
          currency: data.currency || 'XOF',
          deadline: data.deadline,
          startDate: data.startDate,
          status: data.status,
          isUrgent: data.isUrgent,
          languageRequirement: data.languageRequirement || 'none',
          gender: data.gender || 'any',
          maritalStatus: data.maritalStatus || 'any',
          minAge: data.minAge,
          maxAge: data.maxAge,
          childrenAccepted: data.childrenAccepted !== false,
          drivingLicense: data.drivingLicense || 'not_required',
          contactEmail: data.contactEmail,
          contactPhone: data.contactPhone,
          contactWhatsApp: data.contactWhatsApp,
          contactAddress: data.contactAddress,
          contactWebsite: data.contactWebsite,
        });
      } catch (error) {
        console.error('Erreur lors du chargement de l\'offre:', error);
        toast({
          title: '❌ Erreur',
          description: 'Impossible de charger l\'offre',
          variant: 'destructive',
        });
        navigate('/pro/jobs');
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobPost();
  }, [id]);

  const handleSubmit = async () => {
    if (!id) return;
    
    try {
      console.log('💾 Mise à jour de l\'offre d\'emploi...', formData);
      
      if (!formData.title || !formData.company || !formData.description) {
        toast({
          title: '❌ Erreur',
          description: 'Veuillez remplir tous les champs obligatoires',
          variant: 'destructive',
        });
        return;
      }

      setIsSubmitting(true);

      const jobPostData: Partial<CreateJobPostData> = {
        title: formData.title,
        description: formData.description,
        company: formData.company,
        city: formData.city,
        country: formData.country,
        remote: formData.remote,
        requiredSkills: formData.requiredSkills || [],
        optionalSkills: formData.optionalSkills || [],
        education: formData.education || [],
        experience: formData.experience,
        minYearsExperience: formData.minYearsExperience || 0,
        contractType: formData.contractType,
        salaryMin: formData.salaryMin,
        salaryMax: formData.salaryMax,
        currency: formData.currency || 'XOF',
        deadline: formData.deadline,
        startDate: formData.startDate,
        status: formData.status,
        isUrgent: formData.isUrgent || false,
        languageRequirement: formData.languageRequirement || 'none',
        gender: formData.gender || 'any',
        maritalStatus: formData.maritalStatus || 'any',
        minAge: formData.minAge,
        maxAge: formData.maxAge,
        childrenAccepted: formData.childrenAccepted !== false,
        drivingLicense: formData.drivingLicense || 'not_required',
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        contactWhatsApp: formData.contactWhatsApp,
        contactAddress: formData.contactAddress,
        contactWebsite: formData.contactWebsite,
      };

      console.log('📤 Envoi des données à l\'API:', jobPostData);

      const updatedJobPost = await jobPostsService.updateJobPost(id, jobPostData);
      
      console.log('✅ Offre mise à jour avec succès:', updatedJobPost);

      toast({
        title: '✨ Offre mise à jour !',
        description: 'Les modifications ont été enregistrées',
      });

      navigate(`/pro/jobs/${id}`);

    } catch (error: any) {
      console.error('❌ Erreur lors de la mise à jour:', error);
      toast({
        title: '❌ Erreur',
        description: error.message || 'Impossible de mettre à jour l\'offre',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addSkill = (skill: string) => {
    if (!skill.trim()) return;
    const skills = formData.requiredSkills || [];
    if (!skills.includes(skill.trim())) {
      setFormData({ ...formData, requiredSkills: [...skills, skill.trim()] });
    }
    setCurrentSkill('');
  };

  const removeSkill = (skill: string) => {
    const skills = formData.requiredSkills || [];
    setFormData({ ...formData, requiredSkills: skills.filter(s => s !== skill) });
  };

  const addOptionalSkill = (skill: string) => {
    if (!skill.trim()) return;
    const skills = formData.optionalSkills || [];
    if (!skills.includes(skill.trim())) {
      setFormData({ ...formData, optionalSkills: [...skills, skill.trim()] });
    }
    setCurrentOptionalSkill('');
  };

  const removeOptionalSkill = (skill: string) => {
    const skills = formData.optionalSkills || [];
    setFormData({ ...formData, optionalSkills: skills.filter(s => s !== skill) });
  };

  const toggleEducation = (level: EducationLevel) => {
    const education = formData.education || [];
    if (education.includes(level)) {
      setFormData({ ...formData, education: education.filter(e => e !== level) });
    } else {
      setFormData({ ...formData, education: [...education, level] });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate(`/pro/jobs/${id}`)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Modifier l'offre</h1>
            <p className="text-gray-600 mt-1">Mettez à jour les informations de votre offre d'emploi</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/pro/jobs/${id}`)}>
            Annuler
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="gap-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>
      </div>

      {/* Formulaire */}
      <div className="space-y-8">
        {/* Informations de base */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 border border-gray-200"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Informations de base</h2>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Titre du poste *</Label>
              <Input
                id="title"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Développeur Full Stack Senior"
              />
            </div>

            <div>
              <Label htmlFor="company">Entreprise *</Label>
              <Input
                id="company"
                value={formData.company || ''}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Nom de votre entreprise"
              />
            </div>

            <div>
              <Label htmlFor="description">Description du poste *</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Décrivez le poste, les missions, l'environnement de travail..."
                rows={8}
              />
            </div>
          </div>
        </motion.div>

        {/* Compétences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 border border-gray-200"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Compétences requises</h2>
          
          <div className="space-y-4">
            <div>
              <Label>Compétences requises *</Label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    value={currentSkill}
                    onChange={(e) => setCurrentSkill(e.target.value)}
                    placeholder="Tapez une compétence..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSkill(currentSkill);
                      }
                    }}
                  />
                </div>
                <Button onClick={() => addSkill(currentSkill)} type="button">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              {(formData.requiredSkills?.length || 0) > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {formData.requiredSkills?.map((skill) => (
                    <Badge key={skill} className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600">
                      {skill}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => removeSkill(skill)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label>Compétences optionnelles</Label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    value={currentOptionalSkill}
                    onChange={(e) => setCurrentOptionalSkill(e.target.value)}
                    placeholder="Compétences souhaitées mais non obligatoires..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addOptionalSkill(currentOptionalSkill);
                      }
                    }}
                  />
                </div>
                <Button onClick={() => addOptionalSkill(currentOptionalSkill)} type="button">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              {(formData.optionalSkills?.length || 0) > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {formData.optionalSkills?.map((skill) => (
                    <Badge key={skill} variant="outline" className="gap-2">
                      {skill}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => removeOptionalSkill(skill)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Expérience et Éducation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 border border-gray-200"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Expérience et Formation</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Niveau d'expérience *</Label>
              <Select value={formData.experience} onValueChange={(value: any) => setFormData({ ...formData, experience: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entry">Débutant (0-1 an)</SelectItem>
                  <SelectItem value="junior">Junior (1-3 ans)</SelectItem>
                  <SelectItem value="mid">Confirmé (3-5 ans)</SelectItem>
                  <SelectItem value="senior">Senior (5-10 ans)</SelectItem>
                  <SelectItem value="expert">Expert (10+ ans)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Années d'expérience minimum</Label>
              <Input
                type="number"
                value={formData.minYearsExperience || 0}
                onChange={(e) => setFormData({ ...formData, minYearsExperience: parseInt(e.target.value) || 0 })}
                min="0"
              />
            </div>

            <div className="md:col-span-2">
              <Label>Niveau d'éducation requis *</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                {[
                  { value: 'high_school' as EducationLevel, label: 'Baccalauréat' },
                  { value: 'bachelor' as EducationLevel, label: 'Licence' },
                  { value: 'master' as EducationLevel, label: 'Master' },
                  { value: 'phd' as EducationLevel, label: 'Doctorat' },
                ].map((edu) => (
                  <Button
                    key={edu.value}
                    type="button"
                    variant={formData.education?.includes(edu.value) ? 'default' : 'outline'}
                    onClick={() => toggleEducation(edu.value)}
                    className="w-full"
                  >
                    {edu.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Localisation et Contrat */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 border border-gray-200"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Localisation et Type de contrat</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="country">Pays *</Label>
              <Input
                id="country"
                value={formData.country || ''}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                placeholder="Sélectionnez un pays"
              />
            </div>

            <div>
              <Label htmlFor="city">Ville *</Label>
              <Input
                id="city"
                value={formData.city || ''}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Sélectionnez une ville"
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={formData.remote || false}
                onCheckedChange={(checked) => setFormData({ ...formData, remote: checked })}
              />
              <Label>Télétravail possible</Label>
            </div>

            <div>
              <Label>Type de contrat *</Label>
              <Select value={formData.contractType} onValueChange={(value: any) => setFormData({ ...formData, contractType: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full_time">Temps plein (CDI)</SelectItem>
                  <SelectItem value="part_time">Temps partiel</SelectItem>
                  <SelectItem value="contract">CDD</SelectItem>
                  <SelectItem value="internship">Stage</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Salaire minimum ({formData.currency})</Label>
              <Input
                type="number"
                value={formData.salaryMin || ''}
                onChange={(e) => setFormData({ ...formData, salaryMin: parseInt(e.target.value) || undefined })}
                placeholder="Ex: 500000"
              />
            </div>

            <div>
              <Label>Salaire maximum ({formData.currency})</Label>
              <Input
                type="number"
                value={formData.salaryMax || ''}
                onChange={(e) => setFormData({ ...formData, salaryMax: parseInt(e.target.value) || undefined })}
                placeholder="Ex: 800000"
              />
            </div>

            <div>
              <Label>Date limite de candidature *</Label>
              <Input
                type="date"
                value={formData.deadline || ''}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
            </div>

            <div>
              <Label>Date de début souhaitée</Label>
              <Input
                type="date"
                value={formData.startDate || ''}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={formData.isUrgent || false}
                onCheckedChange={(checked) => setFormData({ ...formData, isUrgent: checked })}
              />
              <Label>Recrutement urgent</Label>
            </div>
          </div>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 border border-gray-200"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Informations de contact</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Email de contact</Label>
              <Input
                type="email"
                value={formData.contactEmail || ''}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                placeholder="recrutement@entreprise.com"
              />
            </div>

            <div>
              <Label>Téléphone</Label>
              <Input
                type="tel"
                value={formData.contactPhone || ''}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                placeholder="+221 77 123 45 67"
              />
            </div>

            <div>
              <Label>WhatsApp</Label>
              <Input
                type="tel"
                value={formData.contactWhatsApp || ''}
                onChange={(e) => setFormData({ ...formData, contactWhatsApp: e.target.value })}
                placeholder="+221 77 123 45 67"
              />
            </div>

            <div>
              <Label>Site web</Label>
              <Input
                type="url"
                value={formData.contactWebsite || ''}
                onChange={(e) => setFormData({ ...formData, contactWebsite: e.target.value })}
                placeholder="https://www.entreprise.com"
              />
            </div>

            <div className="md:col-span-2">
              <Label>Adresse</Label>
              <Input
                value={formData.contactAddress || ''}
                onChange={(e) => setFormData({ ...formData, contactAddress: e.target.value })}
                placeholder="Adresse complète de l'entreprise"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Actions finales */}
      <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
        <Button variant="outline" onClick={() => navigate(`/pro/jobs/${id}`)}>
          Annuler
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="gap-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700"
        >
          <Save className="w-4 h-4" />
          {isSubmitting ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </Button>
      </div>
    </div>
  );
};

export default EditJobPostPage;
