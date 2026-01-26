import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, RefreshCw } from 'lucide-react';
import { useTranslation } from '@/i18n/i18nContext';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  // Effet pour le compte à rebours et la redirection automatique
  useEffect(() => {
    if (countdown <= 0) {
      navigate('/');
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-background rounded-xl shadow-lg border border-primary/10 overflow-hidden"
        >
          {/* En-tête avec logo */}
          <div className="bg-gradient-to-r from-primary/10 to-transparent p-6 flex items-center justify-between border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-bold text-xl">S</span>
              </div>
              <h1 className="text-xl font-bold text-foreground">Studyia Career</h1>
            </div>
            <div className="h-8 w-8 rounded-full bg-destructive/10 flex items-center justify-center">
              <span className="text-destructive font-bold">404</span>
            </div>
          </div>

          {/* Contenu */}
          <div className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">{t('errors.pageNotFound') || 'Page non trouvée'}</h2>
            <p className="text-muted-foreground mb-6">
              {t('errors.pageNotFoundDesc') || 'La page que vous recherchez n\'existe pas ou a été déplacée.'}
            </p>

            {/* Détails de l'erreur */}
            <div className="bg-muted/50 rounded-lg p-4 mb-6 border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-foreground">Code:</span>
                <code className="bg-background px-2 py-1 rounded text-sm">NOT_FOUND</code>
              </div>
              <div className="text-xs text-muted-foreground break-all">
                <span className="font-medium">ID:</span> {window.location.pathname}
              </div>
            </div>

            {/* Compte à rebours */}
            <div className="text-center mb-6">
              <p className="text-sm text-muted-foreground">
                {t('errors.redirectCountdown') || 'Redirection automatique dans'} <span className="font-bold text-primary">{countdown}</span> {t('errors.seconds') || 'secondes'}
              </p>
              <div className="w-full bg-muted h-1 mt-2 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-primary"
                  initial={{ width: '100%' }}
                  animate={{ width: `${(countdown / 10) * 100}%` }}
                  transition={{ duration: 1, ease: "linear" }}
                />
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={() => navigate('/')} 
                className="flex-1"
                variant="default"
              >
                <Home className="mr-2 h-4 w-4" />
                {t('errors.backToHome') || 'Accueil'}
              </Button>
              <Button 
                onClick={() => navigate(-1)} 
                className="flex-1"
                variant="outline"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('errors.goBack') || 'Retour'}
              </Button>
              <Button 
                onClick={() => window.location.reload()} 
                className="flex-1"
                variant="ghost"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                {t('errors.refresh') || 'Actualiser'}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Studyia Career. {t('common.allRightsReserved') || 'Tous droits réservés.'}</p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
