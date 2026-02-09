import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Sparkles, Upload, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RateLimitStatus, useRateLimit } from '@/components/RateLimitStatus';
import { ClientRateLimiter } from '@/utils/clientRateLimit';

interface UpdateCVWithLimitProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateCV: () => void;
}

export const UpdateCVWithLimit: React.FC<UpdateCVWithLimitProps> = ({ 
  isOpen, 
  onClose, 
  onUpdateCV 
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { canUpdate, remaining, incrementUsage, formatTimeRemaining } = useRateLimit();

  const handleUpdateCV = async () => {
    if (!canUpdate) return;

    setIsUpdating(true);
    
    try {
      // Incrémenter le compteur avant l'appel API
      incrementUsage();
      
      // Appeler la fonction de mise à jour
      await onUpdateCV();
      
      // Fermer le popup après succès
      onClose();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du CV:', error);
      
      // En cas d'erreur, on pourrait décrémenter le compteur
      // mais pour l'instant on le laisse pour éviter les abus
    } finally {
      setIsUpdating(false);
    }
  };

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
                    <Upload className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    Mettre à jour mon CV
                  </h3>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                {/* Statut de limitation */}
                <RateLimitStatus showDetails={true} />
                
                {canUpdate ? (
                  <>
                    <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-xl border border-primary/10">
                      <Sparkles className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-foreground font-medium mb-1">
                          Améliorez votre CV avec l'IA
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Téléchargez votre CV existant et notre IA l'analysera pour vous proposer des améliorations 
                          et le restructurer de manière professionnelle.
                        </p>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={handleUpdateCV}
                      disabled={isUpdating || !canUpdate}
                      className="w-full bg-gradient-to-r from-primary to-blue-bright hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 group"
                    >
                      {isUpdating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                          <span className="font-medium">Analyse en cours...</span>
                        </>
                      ) : (
                        <>
                          <span className="font-medium">Mettre à jour mon CV</span>
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-xl border border-orange-200">
                    <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-orange-800 font-medium mb-1">
                        Limite quotidienne atteinte
                      </p>
                      <p className="text-sm text-orange-600 leading-relaxed">
                        Vous avez utilisé vos {remaining === 0 ? '2' : '2'} mises à jour gratuites aujourd'hui. 
                        Revenez demain pour continuer à améliorer votre CV.
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    {remaining > 0 
                      ? `Il vous reste ${remaining} mise${remaining > 1 ? 's' : ''} à jour aujourd'hui`
                      : 'Les mises à jour seront disponibles demain'
                    }
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

export default UpdateCVWithLimit;
