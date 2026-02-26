import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, ChevronLeft, ChevronRight, Check, Briefcase, Upload, Users, FileText, Star, Mail } from 'lucide-react';
import { useState } from 'react';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const tutorialSteps = [
  {
    id: 1,
    title: 'Bienvenue sur Studyia Career Pro',
    description: 'Votre plateforme de recrutement intelligente',
    content: 'Studyia Career Pro est une solution complète qui vous aide à gérer vos offres d\'emploi et à identifier rapidement les candidats les plus qualifiés pour vos postes.',
    icon: Star,
    color: 'from-violet-600 to-purple-600',
  },
  {
    id: 2,
    title: 'Étape 1 : Créez votre offre d\'emploi',
    description: 'Publiez vos postes à pourvoir en quelques clics',
    content: 'Cliquez sur "Nouvelle offre" pour créer une annonce. Décrivez le poste, les compétences recherchées, le salaire et les avantages. Plus vous êtes précis, meilleur sera le matching avec les candidats.',
    icon: Briefcase,
    color: 'from-blue-600 to-purple-600',
  },
  {
    id: 3,
    title: 'Étape 2 : Recevez et analysez les CV',
    description: 'Analyse automatique et extraction des informations',
    content: 'Uploadez les CV des candidats (jusqu\'à 10 simultanément). Le système extrait automatiquement toutes les informations pertinentes : coordonnées, expériences professionnelles, formations, compétences techniques.',
    icon: Upload,
    color: 'from-violet-500 to-blue-600',
  },
  {
    id: 4,
    title: 'Étape 3 : Découvrez le matching intelligent',
    description: 'Score de compatibilité pour chaque candidat',
    content: 'Le système compare automatiquement les compétences et l\'expérience de chaque candidat avec les exigences de votre offre. Un score sur 100 vous permet d\'identifier immédiatement les profils les plus pertinents.',
    icon: Star,
    color: 'from-purple-600 to-violet-600',
  },
  {
    id: 5,
    title: 'Étape 4 : Consultez les profils détaillés',
    description: 'Vue complète du parcours professionnel',
    content: 'Accédez au profil complet de chaque candidat : parcours professionnel, formations, compétences, et analyse de compatibilité détaillée avec votre offre d\'emploi.',
    icon: Users,
    color: 'from-violet-600 to-blue-600',
  },
  {
    id: 6,
    title: 'Étape 5 : Générez des CV professionnels',
    description: 'Export PDF avec templates personnalisables',
    content: 'Transformez les informations du candidat en CV professionnel au format PDF. Choisissez parmi 10 templates élégants, prévisualisez le résultat en temps réel, et téléchargez le document.',
    icon: FileText,
    color: 'from-blue-600 to-violet-600',
  },
  {
    id: 7,
    title: 'Étape 6 : Contactez vos candidats',
    description: 'Communication directe et simplifiée',
    content: 'Utilisez le bouton "Contacter" pour envoyer un email au candidat. Les coordonnées sont automatiquement extraites du CV et prêtes à l\'emploi pour faciliter votre processus de recrutement.',
    icon: Mail,
    color: 'from-purple-600 to-blue-600',
  },
  {
    id: 8,
    title: 'Vous êtes prêt à commencer',
    description: 'Optimisez votre processus de recrutement',
    content: 'Vous maîtrisez maintenant les fonctionnalités essentielles de Studyia Career Pro. Gagnez un temps précieux dans votre processus de recrutement et identifiez rapidement les meilleurs talents.',
    icon: Check,
    color: 'from-violet-600 to-purple-600',
  },
];

export const TutorialModal = ({ isOpen, onClose }: TutorialModalProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    localStorage.setItem('studyia_tutorial_completed', 'true');
    onClose();
  };

  const step = tutorialSteps[currentStep];
  const Icon = step.icon;
  const progress = ((currentStep + 1) / tutorialSteps.length) * 100;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden"
            >
              {/* Header avec progression */}
              <div className="relative bg-gradient-to-br from-violet-50 via-purple-50 to-blue-50 p-6 pb-8 border-b border-violet-100">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Barre de progression */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                    <span>Étape {currentStep + 1} sur {tutorialSteps.length}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                      className="h-full bg-gradient-to-r from-violet-600 to-blue-600"
                    />
                  </div>
                </div>

                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                    className={`mx-auto w-20 h-20 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center shadow-lg mb-4`}
                  >
                    <Icon className="w-10 h-10 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600 font-medium">
                    {step.description}
                  </p>
                </motion.div>
              </div>

              {/* Contenu */}
              <div className="p-8">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-lg p-6 mb-6 border border-violet-100">
                    <p className="text-gray-700 leading-relaxed text-base">
                    {step.content}
                    </p>
                  </div>

                  {/* Indicateurs de points */}
                  <div className="flex justify-center gap-2 mb-6">
                    {tutorialSteps.map((_, index) => (
                      <div
                        key={index}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          index === currentStep
                            ? 'w-8 bg-violet-600'
                            : index < currentStep
                            ? 'w-2 bg-violet-400'
                            : 'w-2 bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </motion.div>

                {/* Boutons de navigation */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                    className="flex-1 border-gray-300 hover:bg-gray-50"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Précédent
                  </Button>
                  
                  {currentStep === tutorialSteps.length - 1 ? (
                    <Button
                      onClick={handleFinish}
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Commencer !
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNext}
                      className="flex-1 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all"
                    >
                      Suivant
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  )}
                </div>

                {/* Bouton "Passer le tutoriel" */}
                <div className="text-center mt-4">
                  <button
                    onClick={handleFinish}
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Passer le tutoriel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
