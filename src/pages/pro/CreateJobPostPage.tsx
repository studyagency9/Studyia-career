import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  X, 
  Sparkles, 
  Copy, 
  FileText,
  Languages,
  User,
  Users,
  Calendar as CalendarIcon,
  Baby,
  Car,
  MapPin,
  Building2,
  Phone,
  Mail,
  MessageCircle,
  Globe
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FormStepper } from '@/components/pro/FormStepper';
import { AutocompleteInput } from '@/components/pro/AutocompleteInput';
import { AIAnalysisLoader } from '@/components/pro/AIAnalysisLoader';
import { searchJobTitles, fuzzySearch, skills } from '@/data/jobSuggestions';
import { getSuggestedSkills } from '@/data/skillsByCategory';
import { getAllCountryNames, searchCities } from '@/data/countriesAndCities';
import { jobDescriptionTemplates, generateJobDescription, completeManualDescription } from '@/data/jobTemplates';
import { jobOfferParsingService } from '@/services/jobOfferParsingService';
import type { 
  CreateJobPostData, 
  ExperienceLevel, 
  EducationLevel, 
  ContractType,
  LanguageRequirement,
  Gender,
  MaritalStatus,
  DrivingLicense
} from '@/types/jobPost';

const CreateJobPostPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [creationMode, setCreationMode] = useState<'template' | 'manual' | 'paste' | null>(null);
  const [useTemplate, setUseTemplate] = useState<boolean | null>(null);
  const [pastedJobOffer, setPastedJobOffer] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [analysisStage, setAnalysisStage] = useState<'analyzing' | 'extracting' | 'completing'>('analyzing');
  const [formData, setFormData] = useState<Partial<CreateJobPostData & {
    languageRequirement: LanguageRequirement;
    gender: Gender;
    maritalStatus: MaritalStatus;
    minAge?: number;
    maxAge?: number;
    childrenAccepted: boolean;
    drivingLicense: DrivingLicense;
    descriptionTemplateId?: number;
    contactEmail?: string;
    contactPhone?: string;
    contactWhatsApp?: string;
    contactAddress?: string;
    contactWebsite?: string;
  }>>({
    title: '',
    description: '',
    company: '',
    city: '',
    country: '',
    remote: false,
    requiredSkills: [],
    optionalSkills: [],
    education: [],
    experience: 'mid' as ExperienceLevel,
    minYearsExperience: 3,
    contractType: 'full_time' as ContractType,
    currency: 'XOF',
    isUrgent: false,
    languageRequirement: 'none',
    gender: 'any',
    maritalStatus: 'any',
    childrenAccepted: true,
    drivingLicense: 'not_required',
  });

  const [currentSkill, setCurrentSkill] = useState('');
  const [jobSuggestions, setJobSuggestions] = useState<string[]>([]);
  const [skillSuggestions, setSkillSuggestions] = useState<string[]>([]);
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [generatedDescription, setGeneratedDescription] = useState('');

  const steps = [
    { id: 1, title: 'Poste', description: 'Titre & Description' },
    { id: 2, title: 'Compétences', description: 'Skills & Langue' },
    { id: 3, title: 'Profil', description: 'Critères candidat' },
    { id: 4, title: 'Localisation', description: 'Lieu & Contrat' },
    { id: 5, title: 'Contact', description: 'Coordonnées' },
    { id: 6, title: 'Récapitulatif', description: 'Validation finale' },
  ];

  // Suggestions de compétences basées sur le titre du poste
  useEffect(() => {
    if (formData.title) {
      const suggestions = getSuggestedSkills(formData.title);
      setSkillSuggestions(suggestions);
    }
  }, [formData.title]);

  // Génération automatique de la description si template sélectionné
  useEffect(() => {
    if (useTemplate && selectedTemplate && formData.title && formData.company && formData.requiredSkills && formData.requiredSkills.length > 0) {
      const experienceLabel = formData.experience === 'entry' ? 'débutant(e)' :
                             formData.experience === 'junior' ? 'junior' :
                             formData.experience === 'mid' ? 'confirmé(e)' :
                             formData.experience === 'senior' ? 'senior' :
                             'expert(e)';
      
      const description = generateJobDescription(selectedTemplate, {
        title: formData.title,
        company: formData.company,
        experience: experienceLabel,
        skills: formData.requiredSkills,
        city: formData.city || 'votre ville',
        country: formData.country,
        education: formData.education,
        minYearsExperience: formData.minYearsExperience,
        languageRequirement: formData.languageRequirement,
        gender: formData.gender,
        maritalStatus: formData.maritalStatus,
        minAge: formData.minAge,
        maxAge: formData.maxAge,
        childrenAccepted: formData.childrenAccepted,
        drivingLicense: formData.drivingLicense,
        contractType: formData.contractType,
        salaryMin: formData.salaryMin,
        salaryMax: formData.salaryMax,
        currency: formData.currency,
        remote: formData.remote,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        contactWhatsApp: formData.contactWhatsApp,
        contactAddress: formData.contactAddress,
        contactWebsite: formData.contactWebsite,
      });
      
      setGeneratedDescription(description);
      setFormData({ ...formData, description, descriptionTemplateId: selectedTemplate });
    }
  }, [
    selectedTemplate, 
    formData.title, 
    formData.company, 
    formData.requiredSkills, 
    formData.city, 
    formData.country,
    formData.experience, 
    formData.education,
    formData.languageRequirement,
    formData.gender,
    formData.maritalStatus,
    formData.minAge,
    formData.maxAge,
    formData.drivingLicense,
    formData.contractType,
    formData.salaryMin,
    formData.salaryMax,
    formData.contactEmail,
    formData.contactPhone,
    formData.contactWhatsApp,
    useTemplate
  ]);

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

  const toggleEducation = (level: EducationLevel) => {
    const education = formData.education || [];
    setFormData({
      ...formData,
      education: education.includes(level)
        ? education.filter(e => e !== level)
        : [...education, level],
    });
  };

  const nextStep = () => {
    if (currentStep < steps.length) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: 
        // Mode paste : on peut passer si les champs sont remplis après parsing
        if (creationMode === 'paste') {
          return formData.title && formData.company && formData.description;
        }
        // Mode template ou manual
        if (useTemplate === null && creationMode === null) return false;
        if (useTemplate) return formData.title && formData.company && selectedTemplate;
        return formData.title && formData.company && formData.description;
      case 2: return (formData.requiredSkills?.length || 0) > 0;
      case 3: return formData.experience && (formData.education?.length || 0) > 0;
      case 4: return formData.country && formData.city && formData.deadline;
      case 5: return formData.contactEmail || formData.contactPhone;
      case 6: return true;
      default: return false;
    }
  };

  const handleSubmit = () => {
    console.log('Creating job post:', formData);
    toast({
      title: '✨ Offre créée avec succès !',
      description: 'Vous pouvez maintenant recevoir et filtrer les CV',
    });
    navigate('/pro/jobs');
  };

  const handlePasteAndParse = async () => {
    if (!pastedJobOffer.trim()) {
      toast({
        title: '❌ Erreur',
        description: 'Veuillez coller une offre d\'emploi',
        variant: 'destructive',
      });
      return;
    }

    setIsParsing(true);
    setAnalysisStage('analyzing');
    
    try {
      // Étape 1: Analyse
      await new Promise(resolve => setTimeout(resolve, 800));
      setAnalysisStage('extracting');
      
      // Étape 2: Extraction
      const parsedData = await jobOfferParsingService.parseJobOffer(pastedJobOffer);
      
      await new Promise(resolve => setTimeout(resolve, 600));
      setAnalysisStage('completing');
      
      // Étape 3: Remplir automatiquement tous les champs du formulaire
      await new Promise(resolve => setTimeout(resolve, 400));
      
      setFormData({
        title: parsedData.title,
        company: parsedData.company,
        description: parsedData.description,
        city: parsedData.city,
        country: parsedData.country,
        remote: parsedData.remote,
        requiredSkills: parsedData.requiredSkills,
        optionalSkills: parsedData.optionalSkills,
        education: parsedData.education,
        experience: parsedData.experience,
        minYearsExperience: parsedData.minYearsExperience,
        contractType: parsedData.contractType,
        salaryMin: parsedData.salaryMin,
        salaryMax: parsedData.salaryMax,
        currency: parsedData.currency,
        deadline: parsedData.deadline,
        isUrgent: parsedData.isUrgent,
        languageRequirement: parsedData.languageRequirement,
        gender: parsedData.gender,
        maritalStatus: parsedData.maritalStatus,
        minAge: parsedData.minAge,
        maxAge: parsedData.maxAge,
        childrenAccepted: parsedData.childrenAccepted,
        drivingLicense: parsedData.drivingLicense,
        contactEmail: parsedData.contactEmail,
        contactPhone: parsedData.contactPhone,
        contactWhatsApp: parsedData.contactWhatsApp,
        contactAddress: parsedData.contactAddress,
        contactWebsite: parsedData.contactWebsite,
      });

      toast({
        title: '✨ Analyse terminée !',
        description: 'Tous les champs ont été remplis automatiquement. Vérifiez et ajustez si nécessaire.',
      });

      // Passer à l'étape suivante
      setCurrentStep(2);
      
    } catch (error: any) {
      console.error('Erreur parsing:', error);
      
      // Gestion spécifique de l'erreur 429 (rate limit)
      if (error?.message?.includes('429') || error?.message?.includes('Resource exhausted')) {
        toast({
          title: '⏳ Limite d\'utilisation atteinte',
          description: 'Trop de requêtes à l\'IA. Veuillez patienter quelques minutes et réessayer.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: '❌ Erreur d\'analyse',
          description: 'Impossible d\'analyser l\'offre. Vérifiez le format et réessayez.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsParsing(false);
    }
  };

  const copyDescription = async () => {
    // Générer la description complète selon le mode
    let descToCopy = '';
    
    if (useTemplate) {
      // Mode template : utiliser la description générée
      descToCopy = generatedDescription;
    } else {
      // Mode manuel : compléter la description manuelle avec tous les détails
      if (!formData.description) {
        toast({
          title: '❌ Erreur',
          description: 'Aucune description à copier',
          variant: 'destructive',
        });
        return;
      }
      
      descToCopy = completeManualDescription(formData.description, {
        title: formData.title || '',
        skills: formData.requiredSkills || [],
        city: formData.city || '',
        country: formData.country,
        education: formData.education,
        minYearsExperience: formData.minYearsExperience,
        experience: formData.experience,
        languageRequirement: formData.languageRequirement,
        gender: formData.gender,
        maritalStatus: formData.maritalStatus,
        minAge: formData.minAge,
        maxAge: formData.maxAge,
        childrenAccepted: formData.childrenAccepted,
        drivingLicense: formData.drivingLicense,
        contractType: formData.contractType,
        salaryMin: formData.salaryMin,
        salaryMax: formData.salaryMax,
        currency: formData.currency,
        remote: formData.remote,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        contactWhatsApp: formData.contactWhatsApp,
        contactAddress: formData.contactAddress,
        contactWebsite: formData.contactWebsite,
      });
    }

    if (!descToCopy) {
      toast({
        title: '❌ Erreur',
        description: 'Aucune description à copier',
        variant: 'destructive',
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(descToCopy);
      toast({
        title: '📋 Description copiée !',
        description: 'La description complète a été copiée dans le presse-papier',
      });
    } catch (error) {
      console.error('Erreur lors de la copie:', error);
      
      // Fallback: créer un textarea temporaire pour la copie
      const textArea = document.createElement('textarea');
      textArea.value = descToCopy;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        document.execCommand('copy');
        textArea.remove();
        toast({
          title: '📋 Description copiée !',
          description: 'La description complète a été copiée dans le presse-papier',
        });
      } catch (err) {
        textArea.remove();
        toast({
          title: '❌ Erreur de copie',
          description: 'Impossible de copier. Veuillez sélectionner et copier manuellement.',
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full mb-4">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-700">Création d'offre intelligente</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Créer une offre d'emploi</h1>
        <p className="mt-2 text-gray-600">Suivez les étapes pour créer votre profil de poste idéal</p>
      </motion.div>

      {/* Stepper */}
      <FormStepper steps={steps} currentStep={currentStep} />

      {/* Form Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
      >
        <AnimatePresence mode="wait">
          {/* Step 1: Titre & Description */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {creationMode !== 'paste' && (
                <>
                  <div>
                    <Label htmlFor="title" className="text-base font-semibold">
                      Titre du poste *
                    </Label>
                    <p className="text-sm text-gray-500 mb-3">
                      Commencez à taper pour voir les suggestions
                    </p>
                    <AutocompleteInput
                      value={formData.title || ''}
                      onChange={(value) => setFormData({ ...formData, title: value })}
                      suggestions={jobSuggestions}
                      onSearch={(query) => setJobSuggestions(searchJobTitles(query))}
                      placeholder="Ex: Développeur Full-Stack, Designer UX/UI, Commercial..."
                      className="text-lg"
                    />
                  </div>

                  <div>
                    <Label htmlFor="company" className="text-base font-semibold">
                      Entreprise *
                    </Label>
                    <Input
                      id="company"
                      value={formData.company || ''}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Nom de votre entreprise"
                      className="mt-2"
                    />
                  </div>
                </>
              )}

              {creationMode === null && useTemplate === null && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border-2 border-dashed border-blue-200 rounded-xl p-6 bg-blue-50/50"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Comment souhaitez-vous créer l'offre ?
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button
                      onClick={() => {
                        setCreationMode('template');
                        setUseTemplate(true);
                      }}
                      variant="outline"
                      className="h-auto py-6 flex-col gap-3 border-2 hover:border-blue-500 hover:bg-blue-50"
                    >
                      <Sparkles className="w-8 h-8 text-blue-600" />
                      <div className="text-center">
                        <div className="font-semibold">Template automatique</div>
                        <div className="text-xs text-gray-600 mt-1">
                          Génération avec vos infos
                        </div>
                      </div>
                    </Button>
                    <Button
                      onClick={() => {
                        setCreationMode('manual');
                        setUseTemplate(false);
                      }}
                      variant="outline"
                      className="h-auto py-6 flex-col gap-3 border-2 hover:border-purple-500 hover:bg-purple-50"
                    >
                      <FileText className="w-8 h-8 text-purple-600" />
                      <div className="text-center">
                        <div className="font-semibold">Écrire moi-même</div>
                        <div className="text-xs text-gray-600 mt-1">
                          Rédaction personnalisée
                        </div>
                      </div>
                    </Button>
                    <Button
                      onClick={() => setCreationMode('paste')}
                      variant="outline"
                      className="h-auto py-6 flex-col gap-3 border-2 hover:border-green-500 hover:bg-green-50"
                    >
                      <Sparkles className="w-8 h-8 text-green-600" />
                      <div className="text-center">
                        <div className="font-semibold">Coller une offre</div>
                        <div className="text-xs text-gray-600 mt-1">
                          L'IA remplit tout automatiquement
                        </div>
                      </div>
                    </Button>
                  </div>
                </motion.div>
              )}

              {creationMode === 'paste' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border-2 border-dashed border-green-200 rounded-xl p-6 bg-gradient-to-br from-green-50 to-emerald-50"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <Label className="text-lg font-bold text-gray-900">
                          Analyse IA automatique
                        </Label>
                        <p className="text-sm text-gray-600">
                          Collez votre offre complète ci-dessous
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setCreationMode(null);
                        setPastedJobOffer('');
                      }}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Changer de mode
                    </Button>
                  </div>

                  <div className="bg-white rounded-lg border-2 border-green-200 p-4 mb-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">Comment ça marche ?</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>✓ Collez votre offre d'emploi (de n'importe quelle source)</li>
                          <li>✓ L'IA extrait automatiquement toutes les informations</li>
                          <li>✓ Tous les champs du formulaire sont remplis instantanément</li>
                          <li>✓ Vous vérifiez et ajustez si nécessaire</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <Textarea
                      value={pastedJobOffer}
                      onChange={(e) => setPastedJobOffer(e.target.value)}
                      placeholder="📋 Collez ici votre offre d'emploi complète...&#10;&#10;Exemple :&#10;RECHERCHE DÉVELOPPEUR FULL-STACK&#10;Entreprise Tech Solutions recherche un développeur expérimenté...&#10;Compétences : React, Node.js, TypeScript...&#10;Contact : recrutement@techsolutions.com"
                      className="min-h-[320px] text-sm bg-white border-2 border-green-200 focus:border-green-400 rounded-lg resize-none"
                    />
                    {pastedJobOffer.length > 0 && (
                      <div className="absolute bottom-3 right-3 text-xs text-gray-500 bg-white px-2 py-1 rounded">
                        {pastedJobOffer.length} caractères
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={handlePasteAndParse}
                    disabled={!pastedJobOffer.trim() || isParsing}
                    className="mt-4 w-full h-12 text-base font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all"
                  >
                    {isParsing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                        Analyse en cours...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Analyser avec l'IA
                      </>
                    )}
                  </Button>
                </motion.div>
              )}

              {useTemplate === true && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-base font-semibold">
                      Choisissez un template *
                    </Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setUseTemplate(null);
                        setSelectedTemplate(null);
                      }}
                    >
                      Changer de mode
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                    Les informations seront remplies automatiquement
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-2">
                    {jobDescriptionTemplates.map((template) => (
                      <motion.div
                        key={template.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedTemplate(template.id)}
                        className={`
                          p-4 rounded-lg border-2 cursor-pointer transition-all
                          ${selectedTemplate === template.id
                            ? 'border-blue-600 bg-blue-50 shadow-md'
                            : 'border-gray-200 hover:border-gray-300'
                          }
                        `}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-sm">{template.name}</span>
                          {selectedTemplate === template.id && (
                            <Check className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {template.template.substring(0, 100)}...
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {useTemplate === false && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <Label htmlFor="description" className="text-base font-semibold">
                      Description du poste *
                    </Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setUseTemplate(null)}
                    >
                      Changer de mode
                    </Button>
                  </div>
                  <Textarea
                    id="description"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Décrivez le poste, les missions, les responsabilités..."
                    className="mt-2 min-h-[200px]"
                  />
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Step 2: Compétences & Langue */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <Label className="text-base font-semibold">
                  Compétences requises *
                </Label>
                <p className="text-sm text-gray-500 mb-3">
                  Suggestions basées sur : {formData.title || 'le poste sélectionné'}
                </p>
                <div className="flex gap-2">
                  <AutocompleteInput
                    value={currentSkill}
                    onChange={setCurrentSkill}
                    suggestions={skillSuggestions}
                    onSearch={(query) => setSkillSuggestions(fuzzySearch(query, skills))}
                    placeholder="Tapez ou sélectionnez une compétence..."
                    className="flex-1"
                  />
                  <Button 
                    onClick={() => addSkill(currentSkill)}
                    disabled={!currentSkill.trim()}
                    className="bg-gradient-to-r from-blue-600 to-purple-600"
                  >
                    Ajouter
                  </Button>
                </div>
                
                {(formData.requiredSkills?.length || 0) > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-wrap gap-2 mt-4"
                  >
                    {formData.requiredSkills?.map((skill, index) => (
                      <motion.div
                        key={skill}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Badge 
                          variant="default" 
                          className="gap-2 py-2 px-3 text-sm bg-gradient-to-r from-blue-600 to-purple-600"
                        >
                          {skill}
                          <X
                            className="w-3 h-3 cursor-pointer hover:text-red-200"
                            onClick={() => removeSkill(skill)}
                          />
                        </Badge>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>

              <div className="space-y-4 pt-6 border-t">
                <div className="flex items-center gap-2 mb-4">
                  <Languages className="w-5 h-5 text-blue-600" />
                  <Label className="text-base font-semibold">
                    Exigences linguistiques
                  </Label>
                </div>
                <RadioGroup
                  value={formData.languageRequirement}
                  onValueChange={(value: LanguageRequirement) => 
                    setFormData({ ...formData, languageRequirement: value })
                  }
                  className="grid grid-cols-1 md:grid-cols-2 gap-3"
                >
                  <div className={`relative flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.languageRequirement === 'bilingual' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <RadioGroupItem value="bilingual" id="bilingual" />
                    <Label htmlFor="bilingual" className="cursor-pointer flex-1 font-medium">
                      <div className="flex items-center gap-2">
                        <Languages className="w-4 h-4" />
                        <span>Bilingue (FR + EN)</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">Français ET Anglais requis</p>
                    </Label>
                  </div>
                  <div className={`relative flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.languageRequirement === 'french' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <RadioGroupItem value="french" id="french" />
                    <Label htmlFor="french" className="cursor-pointer flex-1 font-medium">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🇫🇷</span>
                        <span>Français uniquement</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">Maîtrise du français</p>
                    </Label>
                  </div>
                  <div className={`relative flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.languageRequirement === 'english' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <RadioGroupItem value="english" id="english" />
                    <Label htmlFor="english" className="cursor-pointer flex-1 font-medium">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🇬🇧</span>
                        <span>Anglais uniquement</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">Maîtrise de l'anglais</p>
                    </Label>
                  </div>
                  <div className={`relative flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.languageRequirement === 'none' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <RadioGroupItem value="none" id="none" />
                    <Label htmlFor="none" className="cursor-pointer flex-1 font-medium">
                      <span>Aucune exigence</span>
                      <p className="text-xs text-gray-600 mt-1">Pas de langue spécifique</p>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </motion.div>
          )}

          {/* Step 3: Profil Candidat - AMÉLIORÉ */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Expérience */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  Expérience professionnelle
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Niveau d'expérience *
                    </Label>
                    <Select
                      value={formData.experience}
                      onValueChange={(value: ExperienceLevel) => 
                        setFormData({ ...formData, experience: value })
                      }
                    >
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
                    <Label htmlFor="minYears" className="text-sm font-medium mb-2 block">
                      Années minimum
                    </Label>
                    <Input
                      id="minYears"
                      type="number"
                      min="0"
                      value={formData.minYearsExperience}
                      onChange={(e) => setFormData({ ...formData, minYearsExperience: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
              </div>

              {/* Éducation */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Niveau d'éducation requis *
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {(['high_school', 'bachelor', 'master', 'phd'] as EducationLevel[]).map((level) => (
                    <motion.div
                      key={level}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div
                        onClick={() => toggleEducation(level)}
                        className={`
                          p-4 rounded-xl border-2 cursor-pointer transition-all text-center
                          ${formData.education?.includes(level)
                            ? 'border-purple-600 bg-purple-100 shadow-lg'
                            : 'border-gray-200 hover:border-purple-300 bg-white'
                          }
                        `}
                      >
                        <div className="text-2xl mb-2">
                          {level === 'high_school' && '🎓'}
                          {level === 'bachelor' && '📘'}
                          {level === 'master' && '📗'}
                          {level === 'phd' && '🎖️'}
                        </div>
                        <div className="font-medium text-sm">
                          {level === 'high_school' && 'Bac'}
                          {level === 'bachelor' && 'Licence'}
                          {level === 'master' && 'Master'}
                          {level === 'phd' && 'Doctorat'}
                        </div>
                        {formData.education?.includes(level) && (
                          <Check className="w-4 h-4 text-purple-600 mx-auto mt-2" />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Critères personnels */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-amber-600" />
                  Critères personnels
                </h3>
                
                <div className="space-y-6">
                  {/* Genre */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Genre
                    </Label>
                    <RadioGroup
                      value={formData.gender}
                      onValueChange={(value: Gender) => setFormData({ ...formData, gender: value })}
                      className="flex gap-3"
                    >
                      <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border">
                        <RadioGroupItem value="any" id="any-gender" />
                        <Label htmlFor="any-gender" className="cursor-pointer font-normal">Indifférent</Label>
                      </div>
                      <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male" className="cursor-pointer font-normal">Homme</Label>
                      </div>
                      <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female" className="cursor-pointer font-normal">Femme</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Statut marital */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Statut marital</Label>
                    <RadioGroup
                      value={formData.maritalStatus}
                      onValueChange={(value: MaritalStatus) => setFormData({ ...formData, maritalStatus: value })}
                      className="flex gap-3"
                    >
                      <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border">
                        <RadioGroupItem value="any" id="any-marital" />
                        <Label htmlFor="any-marital" className="cursor-pointer font-normal">Indifférent</Label>
                      </div>
                      <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border">
                        <RadioGroupItem value="single" id="single" />
                        <Label htmlFor="single" className="cursor-pointer font-normal">Célibataire</Label>
                      </div>
                      <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border">
                        <RadioGroupItem value="married" id="married" />
                        <Label htmlFor="married" className="cursor-pointer font-normal">Marié(e)</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Âge */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4" />
                      Tranche d'âge (optionnel)
                    </Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Input
                          type="number"
                          min="18"
                          max="100"
                          placeholder="Âge min (ex: 25)"
                          value={formData.minAge || ''}
                          onChange={(e) => setFormData({ ...formData, minAge: parseInt(e.target.value) })}
                        />
                      </div>
                      <div>
                        <Input
                          type="number"
                          min="18"
                          max="100"
                          placeholder="Âge max (ex: 45)"
                          value={formData.maxAge || ''}
                          onChange={(e) => setFormData({ ...formData, maxAge: parseInt(e.target.value) })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Enfants */}
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Baby className="w-5 h-5 text-amber-600" />
                      <div>
                        <Label htmlFor="children" className="cursor-pointer font-medium">
                          Accepte les candidats avec enfants
                        </Label>
                        <p className="text-xs text-gray-600">Critère non discriminatoire</p>
                      </div>
                    </div>
                    <Switch
                      id="children"
                      checked={formData.childrenAccepted}
                      onCheckedChange={(checked) => setFormData({ ...formData, childrenAccepted: checked })}
                    />
                  </div>

                  {/* Permis */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block flex items-center gap-2">
                      <Car className="w-4 h-4" />
                      Permis de conduire
                    </Label>
                    <RadioGroup
                      value={formData.drivingLicense}
                      onValueChange={(value: DrivingLicense) => setFormData({ ...formData, drivingLicense: value })}
                      className="space-y-2"
                    >
                      <div className="flex items-center space-x-2 bg-white px-4 py-3 rounded-lg border">
                        <RadioGroupItem value="not_required" id="not-required" />
                        <Label htmlFor="not-required" className="cursor-pointer font-normal flex-1">Non requis</Label>
                      </div>
                      <div className="flex items-center space-x-2 bg-white px-4 py-3 rounded-lg border">
                        <RadioGroupItem value="preferred" id="preferred" />
                        <Label htmlFor="preferred" className="cursor-pointer font-normal flex-1">Souhaité (un plus)</Label>
                      </div>
                      <div className="flex items-center space-x-2 bg-white px-4 py-3 rounded-lg border">
                        <RadioGroupItem value="required" id="required" />
                        <Label htmlFor="required" className="cursor-pointer font-normal flex-1">Obligatoire</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Localisation & Contrat */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-600" />
                  Localisation
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="country" className="text-sm font-medium mb-2 block">
                      Pays * (Afrique de l'Ouest & Centrale)
                    </Label>
                    <AutocompleteInput
                      value={formData.country || ''}
                      onChange={(value) => {
                        setFormData({ ...formData, country: value, city: '' });
                        setCitySuggestions([]);
                      }}
                      suggestions={fuzzySearch(formData.country || '', getAllCountryNames())}
                      placeholder="Ex: Sénégal, Côte d'Ivoire, Cameroun..."
                    />
                  </div>

                  {formData.country && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Label htmlFor="city" className="text-sm font-medium mb-2 block">
                        Ville * (Villes de {formData.country})
                      </Label>
                      <AutocompleteInput
                        value={formData.city || ''}
                        onChange={(value) => setFormData({ ...formData, city: value })}
                        suggestions={citySuggestions}
                        onSearch={(query) => setCitySuggestions(searchCities(query, formData.country))}
                        placeholder="Sélectionnez une ville..."
                      />
                    </motion.div>
                  )}

                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        🏠
                      </div>
                      <Label htmlFor="remote" className="cursor-pointer font-medium">
                        Télétravail possible
                      </Label>
                    </div>
                    <Switch
                      id="remote"
                      checked={formData.remote}
                      onCheckedChange={(checked) => setFormData({ ...formData, remote: checked })}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Détails du contrat
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Type de contrat</Label>
                    <Select
                      value={formData.contractType}
                      onValueChange={(value: ContractType) => 
                        setFormData({ ...formData, contractType: value })
                      }
                    >
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

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="salaryMin" className="text-sm font-medium mb-2 block">
                        Salaire min. (optionnel)
                      </Label>
                      <Input
                        id="salaryMin"
                        type="number"
                        placeholder="500000"
                        value={formData.salaryMin || ''}
                        onChange={(e) => setFormData({ ...formData, salaryMin: parseInt(e.target.value) })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="salaryMax" className="text-sm font-medium mb-2 block">
                        Salaire max. (optionnel)
                      </Label>
                      <Input
                        id="salaryMax"
                        type="number"
                        placeholder="1000000"
                        value={formData.salaryMax || ''}
                        onChange={(e) => setFormData({ ...formData, salaryMax: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="deadline" className="text-sm font-medium mb-2 block">
                      Date limite de candidature *
                    </Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                        🔥
                      </div>
                      <Label htmlFor="urgent" className="cursor-pointer font-medium">
                        Marquer comme urgent
                      </Label>
                    </div>
                    <Switch
                      id="urgent"
                      checked={formData.isUrgent}
                      onCheckedChange={(checked) => setFormData({ ...formData, isUrgent: checked })}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 5: Contact */}
          {currentStep === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-6 border border-violet-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Informations de contact
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Comment les candidats peuvent-ils vous contacter ?
                </p>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium mb-2 block flex items-center gap-2">
                      <Mail className="w-4 h-4 text-violet-600" />
                      Email de contact *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="recrutement@entreprise.com"
                      value={formData.contactEmail || ''}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium mb-2 block flex items-center gap-2">
                      <Phone className="w-4 h-4 text-violet-600" />
                      Téléphone (optionnel)
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+221 XX XXX XX XX"
                      value={formData.contactPhone || ''}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="whatsapp" className="text-sm font-medium mb-2 block flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-violet-600" />
                      WhatsApp (optionnel)
                    </Label>
                    <Input
                      id="whatsapp"
                      type="tel"
                      placeholder="+221 XX XXX XX XX"
                      value={formData.contactWhatsApp || ''}
                      onChange={(e) => setFormData({ ...formData, contactWhatsApp: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="address" className="text-sm font-medium mb-2 block flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-violet-600" />
                      Adresse complète (optionnel)
                    </Label>
                    <Textarea
                      id="address"
                      placeholder="Adresse physique de l'entreprise..."
                      value={formData.contactAddress || ''}
                      onChange={(e) => setFormData({ ...formData, contactAddress: e.target.value })}
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="website" className="text-sm font-medium mb-2 block flex items-center gap-2">
                      <Globe className="w-4 h-4 text-violet-600" />
                      Site web (optionnel)
                    </Label>
                    <Input
                      id="website"
                      type="url"
                      placeholder="https://www.entreprise.com"
                      value={formData.contactWebsite || ''}
                      onChange={(e) => setFormData({ ...formData, contactWebsite: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 6: Récapitulatif */}
          {currentStep === 6 && (
            <motion.div
              key="step6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Récapitulatif de l'offre</h2>
                <p className="text-gray-600 mt-2">Vérifiez les informations avant de créer l'offre</p>
              </div>

              {/* Informations principales */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{formData.title}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Entreprise:</span>
                    <span className="ml-2 font-medium">{formData.company}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Localisation:</span>
                    <span className="ml-2 font-medium">{formData.city}, {formData.country}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Type de contrat:</span>
                    <span className="ml-2 font-medium">
                      {formData.contractType === 'full_time' && 'Temps plein (CDI)'}
                      {formData.contractType === 'part_time' && 'Temps partiel'}
                      {formData.contractType === 'contract' && 'CDD'}
                      {formData.contractType === 'internship' && 'Stage'}
                      {formData.contractType === 'freelance' && 'Freelance'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Expérience:</span>
                    <span className="ml-2 font-medium">{formData.minYearsExperience}+ ans</span>
                  </div>
                </div>
              </div>

              {/* Compétences */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Compétences requises</h4>
                <div className="flex flex-wrap gap-2">
                  {formData.requiredSkills?.map((skill) => (
                    <Badge key={skill} className="bg-gradient-to-r from-blue-600 to-purple-600">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Description complète de l'offre
                    {useTemplate && <Badge variant="outline" className="text-xs">Générée automatiquement</Badge>}
                    {!useTemplate && <Badge variant="outline" className="text-xs bg-purple-50">Personnalisée + Détails</Badge>}
                  </h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyDescription}
                    className="gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copier tout
                  </Button>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                    {useTemplate 
                      ? generatedDescription 
                      : completeManualDescription(formData.description || '', {
                          title: formData.title || '',
                          skills: formData.requiredSkills || [],
                          city: formData.city || '',
                          country: formData.country,
                          education: formData.education,
                          minYearsExperience: formData.minYearsExperience,
                          experience: formData.experience,
                          languageRequirement: formData.languageRequirement,
                          gender: formData.gender,
                          maritalStatus: formData.maritalStatus,
                          minAge: formData.minAge,
                          maxAge: formData.maxAge,
                          childrenAccepted: formData.childrenAccepted,
                          drivingLicense: formData.drivingLicense,
                          contractType: formData.contractType,
                          salaryMin: formData.salaryMin,
                          salaryMax: formData.salaryMax,
                          currency: formData.currency,
                          remote: formData.remote,
                          contactEmail: formData.contactEmail,
                          contactPhone: formData.contactPhone,
                          contactWhatsApp: formData.contactWhatsApp,
                          contactAddress: formData.contactAddress,
                        })
                    }
                  </pre>
                </div>
              </div>

              {/* Contact */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Informations de contact</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  {formData.contactEmail && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span>{formData.contactEmail}</span>
                    </div>
                  )}
                  {formData.contactPhone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span>{formData.contactPhone}</span>
                    </div>
                  )}
                  {formData.contactWhatsApp && (
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-gray-500" />
                      <span>{formData.contactWhatsApp}</span>
                    </div>
                  )}
                  {formData.contactWebsite && (
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-gray-500" />
                      <span>{formData.contactWebsite}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Critères */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Critères du candidat</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Langue:</span>
                    <Badge variant="outline">
                      {formData.languageRequirement === 'bilingual' && 'Bilingue (FR+EN)'}
                      {formData.languageRequirement === 'french' && 'Français'}
                      {formData.languageRequirement === 'english' && 'Anglais'}
                      {formData.languageRequirement === 'none' && 'Aucune exigence'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Genre:</span>
                    <Badge variant="outline">
                      {formData.gender === 'any' && 'Indifférent'}
                      {formData.gender === 'male' && 'Homme'}
                      {formData.gender === 'female' && 'Femme'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Permis:</span>
                    <Badge variant="outline">
                      {formData.drivingLicense === 'required' && 'Obligatoire'}
                      {formData.drivingLicense === 'preferred' && 'Souhaité'}
                      {formData.drivingLicense === 'not_required' && 'Non requis'}
                    </Badge>
                  </div>
                  {(formData.minAge || formData.maxAge) && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Âge:</span>
                      <Badge variant="outline">
                        {formData.minAge && `${formData.minAge}+`}
                        {formData.minAge && formData.maxAge && ' - '}
                        {formData.maxAge && `${formData.maxAge} max`}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Précédent
          </Button>

          <div className="text-sm text-gray-500">
            Étape {currentStep} sur {steps.length}
          </div>

          {currentStep < steps.length ? (
            <Button
              onClick={nextStep}
              disabled={!canProceed()}
              className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Suivant
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              <Check className="w-4 h-4" />
              Créer l'offre
            </Button>
          )}
        </div>
      </motion.div>

      {/* Loader d'analyse IA */}
      {isParsing && <AIAnalysisLoader stage={analysisStage} />}
    </div>
  );
};

export default CreateJobPostPage;
