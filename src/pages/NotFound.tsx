import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSEO } from "@/hooks/useSEO";
import { motion } from "framer-motion";
import { FileQuestion, Home, ArrowLeft, RefreshCw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n/i18nContext";
import { Progress } from "@/components/ui/progress";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [countdown, setCountdown] = useState<number>(10);
  
  useSEO({
    title: '404 - Page non trouvée | Studyia Career',
    description: 'La page que vous recherchez n\'existe pas ou a été déplacée.',
    noindex: true,
    nofollow: true
  });

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    
    // Redirection automatique après le compte à rebours
    if (countdown <= 0) {
      navigate('/');
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [location.pathname, countdown, navigate]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div 
          className="bg-white border border-border rounded-lg shadow-sm overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* En-tête avec logo Studyia */}
          <div className="bg-gradient-to-r from-primary/10 to-transparent p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-bold text-lg">S</span>
              </div>
              <span className="font-medium">Studyia Career</span>
            </div>
          </div>
          
          {/* Contenu de l'erreur */}
          <div className="p-6">
            <motion.div variants={itemVariants} className="mb-6">
              <h1 className="text-2xl font-bold text-center mb-3">
                Cette page n'existe pas
              </h1>
              <p className="text-center text-muted-foreground mb-4">
                Désolé, la page que vous recherchez n'est pas disponible ou a été déplacée.
              </p>
              <div className="flex justify-center mb-4">
                <div className="h-20 w-20 rounded-full bg-muted/50 flex items-center justify-center">
                  <AlertTriangle className="h-10 w-10 text-destructive/70" />
                </div>
              </div>
            </motion.div>
            
            {/* Compte à rebours */}
            <motion.div variants={itemVariants} className="mb-6">
              <div className="text-center mb-2">
                <span className="text-sm">Retour à l'accueil dans <span className="font-bold">{countdown}</span> secondes</span>
              </div>
              <Progress value={(countdown / 10) * 100} className="h-2" />
            </motion.div>
            
            {/* Bouton d'action principal */}
            <motion.div variants={itemVariants}>
              <Button 
                onClick={() => navigate('/')} 
                className="w-full py-6 text-lg"
                variant="default"
              >
                <Home className="mr-2 h-5 w-5" />
                Retourner à la page d'accueil
              </Button>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Footer */}
        <motion.div variants={itemVariants} className="mt-4 text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Studyia Career. {t('common.allRightsReserved') || 'Tous droits réservés.'}</p>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
