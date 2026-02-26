import { motion } from 'framer-motion';
import { Sparkles, FileSearch, Brain, CheckCircle } from 'lucide-react';

type AnalysisStage = 'uploading' | 'extracting' | 'matching' | 'completed';

interface CVAnalysisProgressProps {
  stage: AnalysisStage;
  currentFile?: string;
  totalFiles?: number;
  processedFiles?: number;
}

export const CVAnalysisProgress = ({
  stage,
  currentFile,
  totalFiles = 0,
  processedFiles = 0,
}: CVAnalysisProgressProps) => {
  const stages = [
    {
      id: 'uploading',
      icon: Sparkles,
      title: 'Upload des CV',
      description: 'Envoi des fichiers au serveur...',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'extracting',
      icon: FileSearch,
      title: 'Extraction des données',
      description: 'Traitement des CV en cours...',
      color: 'from-violet-500 to-purple-500',
    },
    {
      id: 'matching',
      icon: Brain,
      title: 'Matching avec l\'offre',
      description: 'Calcul des scores de compatibilité...',
      color: 'from-purple-500 to-pink-500',
    },
    {
      id: 'completed',
      icon: CheckCircle,
      title: 'Traitement terminé',
      description: 'Tous les CV ont été traités avec succès !',
      color: 'from-green-500 to-emerald-500',
    },
  ];

  const currentStageIndex = stages.findIndex((s) => s.id === stage);
  const CurrentIcon = stages[currentStageIndex]?.icon || Sparkles;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4"
      >
        {/* Icône animée */}
        <div className="flex justify-center mb-6">
          <motion.div
            animate={{
              rotate: stage === 'completed' ? 0 : 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: {
                duration: 2,
                repeat: stage === 'completed' ? 0 : Infinity,
                ease: 'linear',
              },
              scale: {
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              },
            }}
            className={`w-20 h-20 rounded-full bg-gradient-to-br ${stages[currentStageIndex]?.color} flex items-center justify-center`}
          >
            <CurrentIcon className="w-10 h-10 text-white" />
          </motion.div>
        </div>

        {/* Titre et description */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {stages[currentStageIndex]?.title}
          </h3>
          <p className="text-sm text-gray-600">
            {stages[currentStageIndex]?.description}
          </p>
        </div>

        {/* Progression fichiers */}
        {totalFiles > 0 && stage !== 'completed' && (
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progression</span>
              <span className="font-semibold">
                {processedFiles} / {totalFiles} CV
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(processedFiles / totalFiles) * 100}%` }}
                transition={{ duration: 0.5 }}
                className={`h-full bg-gradient-to-r ${stages[currentStageIndex]?.color}`}
              />
            </div>
          </div>
        )}

        {/* Fichier en cours */}
        {currentFile && stage !== 'completed' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-50 rounded-lg p-3 mb-6"
          >
            <p className="text-xs text-gray-500 mb-1">Fichier en cours :</p>
            <p className="text-sm font-medium text-gray-900 truncate">
              {currentFile}
            </p>
          </motion.div>
        )}

        {/* Timeline des étapes */}
        <div className="space-y-3">
          {stages.map((stageItem, index) => {
            const isCompleted = index < currentStageIndex;
            const isCurrent = index === currentStageIndex;
            const Icon = stageItem.icon;

            return (
              <motion.div
                key={stageItem.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    isCompleted
                      ? 'bg-green-500'
                      : isCurrent
                      ? `bg-gradient-to-br ${stageItem.color}`
                      : 'bg-gray-200'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-4 h-4 text-white" />
                  ) : (
                    <Icon
                      className={`w-4 h-4 ${
                        isCurrent ? 'text-white' : 'text-gray-400'
                      }`}
                    />
                  )}
                </div>
                <div className="flex-1">
                  <p
                    className={`text-sm font-medium ${
                      isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-400'
                    }`}
                  >
                    {stageItem.title}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Message de succès */}
        {stage === 'completed' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg"
          >
            <p className="text-sm text-green-800 text-center font-medium">
              ✨ {totalFiles} CV analysé{totalFiles > 1 ? 's' : ''} avec succès !
            </p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};
