import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Sparkles, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useTranslation } from '@/i18n/i18nContext';

interface UpdateCVPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

// Popup de maintenance (commenté temporairement)
// Le code ci-dessous est préservé pour réactivation future
/*
const UpdateCVPopup = ({ isOpen, onClose }: UpdateCVPopupProps) => {
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
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
              <div className="relative bg-gradient-to-br from-primary/20 via-blue-bright/10 to-purple-500/10 p-6 border-b border-border/50">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/30 to-transparent rounded-full blur-2xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-bright/20 to-transparent rounded-full blur-xl" />
                
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full bg-background/80 hover:bg-background border border-border/50 transition-all duration-200 hover:scale-110"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
                
                <div className="relative z-10 text-center">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-blue-bright flex items-center justify-center mx-auto mb-4 shadow-lg"
                  >
                    <Wrench className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    Fonctionnalité en cours d'amélioration
                  </h3>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-xl border border-primary/10">
                  <Sparkles className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-foreground font-medium mb-1">
                      Désolé, cette fonctionnalité est en cours d'amélioration
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Nous travaillons actuellement pour rendre la mise à jour de CV encore plus simple et efficace. 
                      En attendant, nous vous invitons à créer votre CV de façon structurée avec notre builder.
                    </p>
                  </div>
                </div>
                
                <Link to="/builder" onClick={onClose}>
                  <Button className="w-full bg-gradient-to-r from-primary to-blue-bright hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 group">
                    <span className="font-medium">Créer mon CV avec le builder</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </Button>
                </Link>
                
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    Bénéficiez d'un accompagnement étape par étape pour un CV professionnel
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
*/

// Composant vide - UpdateCVPopup est désactivé
const UpdateCVPopup = ({ isOpen, onClose }: UpdateCVPopupProps) => {
  return null;
};

export default UpdateCVPopup;
