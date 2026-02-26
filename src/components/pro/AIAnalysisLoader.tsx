import { motion } from 'framer-motion';
import { Sparkles, Brain, CheckCircle2, Zap } from 'lucide-react';

interface AIAnalysisLoaderProps {
  stage?: 'analyzing' | 'extracting' | 'completing';
}

export const AIAnalysisLoader = ({ stage = 'analyzing' }: AIAnalysisLoaderProps) => {
  const stages = [
    { key: 'analyzing', icon: Brain, label: 'Analyse du texte', color: 'text-blue-600' },
    { key: 'extracting', icon: Zap, label: 'Extraction des données', color: 'text-purple-600' },
    { key: 'completing', icon: CheckCircle2, label: 'Finalisation', color: 'text-green-600' },
  ];

  const currentStageIndex = stages.findIndex(s => s.key === stage);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4"
      >
        {/* Header avec icône animée */}
        <div className="flex flex-col items-center mb-8">
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: { duration: 3, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            }}
            className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-green-500 rounded-full flex items-center justify-center mb-4"
          >
            <Sparkles className="w-10 h-10 text-white" />
          </motion.div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Analyse IA en cours
          </h3>
          <p className="text-gray-600 text-center">
            L'intelligence artificielle analyse votre offre d'emploi
          </p>
        </div>

        {/* Barre de progression animée */}
        <div className="mb-8">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-green-500"
              initial={{ width: '0%' }}
              animate={{ width: `${((currentStageIndex + 1) / stages.length) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Étapes */}
        <div className="space-y-4">
          {stages.map((stageItem, index) => {
            const Icon = stageItem.icon;
            const isActive = index === currentStageIndex;
            const isCompleted = index < currentStageIndex;

            return (
              <motion.div
                key={stageItem.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                  isActive ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200' :
                  isCompleted ? 'bg-green-50' : 'bg-gray-50'
                }`}
              >
                <div className={`flex-shrink-0 ${
                  isActive ? 'animate-pulse' : ''
                }`}>
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  ) : (
                    <Icon className={`w-6 h-6 ${isActive ? stageItem.color : 'text-gray-400'}`} />
                  )}
                </div>
                
                <div className="flex-1">
                  <p className={`font-medium ${
                    isActive ? 'text-gray-900' :
                    isCompleted ? 'text-green-700' : 'text-gray-500'
                  }`}>
                    {stageItem.label}
                  </p>
                </div>

                {isActive && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="flex-shrink-0"
                  >
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full" />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Message d'encouragement */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-gray-500">
            ✨ Cela ne prendra que quelques secondes...
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};
