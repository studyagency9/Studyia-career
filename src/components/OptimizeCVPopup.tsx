import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Sparkles, Wrench, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useTranslation } from '@/i18n/i18nContext';

interface OptimizeCVPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const OptimizeCVPopup = ({ isOpen, onClose }: OptimizeCVPopupProps) => {
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Popup */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ 
                duration: 0.3,
                type: "spring",
                stiffness: 300,
                damping: 25
              }}
              className="bg-background border-2 border-border rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with gradient background */}
              <div className="relative bg-gradient-to-br from-blue-bright/20 via-primary/10 to-purple-500/10 p-6 border-b border-border/50">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-bright/30 to-transparent rounded-full blur-2xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/20 to-transparent rounded-full blur-xl" />
                
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full bg-background/80 hover:bg-background border border-border/50 transition-all duration-200 hover:scale-110"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
                
                {/* Icon and title */}
                <div className="relative z-10 text-center">
                  <motion.div
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-bright to-primary flex items-center justify-center mx-auto mb-4 shadow-lg"
                  >
                    <TrendingUp className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    Fonctionnalité en cours d'amélioration
                  </h3>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6 space-y-4">
                <div className="flex items-start gap-3 p-4 bg-blue-bright/5 rounded-xl border border-blue-bright/10">
                  <Sparkles className="w-5 h-5 text-blue-bright mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-foreground font-medium mb-1">
                      Désolé, cette fonctionnalité est en cours d'amélioration
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Nous travaillons actuellement pour rendre l'optimisation de CV encore plus performante avec les dernières technologies d'IA. 
                      En attendant, nous vous invitons à finaliser votre CV de façon structurée avec notre builder.
                    </p>
                  </div>
                </div>
                
                {/* Action button */}
                <Button 
                  onClick={onClose}
                  className="w-full bg-gradient-to-r from-blue-bright to-primary hover:shadow-lg hover:shadow-blue-bright/50 transition-all duration-300 group"
                >
                  <span className="font-medium">Continuer à finaliser mon CV</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
                
                {/* Additional info */}
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    Votre CV sera prêt à télécharger en quelques minutes
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default OptimizeCVPopup;
