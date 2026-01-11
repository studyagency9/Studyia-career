import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Monitor, Smartphone, Zap, Shield, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/i18n/i18nContext';

export const DownloadAppDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà fermé la popup
    const hasClosedDialog = localStorage.getItem('studyia_partner_app_dialog_closed');
    
    // Afficher la popup après 3 secondes si elle n'a pas été fermée
    if (!hasClosedDialog) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('studyia_partner_app_dialog_closed', 'true');
  };

  const handleDownload = () => {
    // Créer un fichier raccourci .url pour Windows avec icône personnalisée
    const dashboardUrl = `${window.location.origin}/partner/dashboard`;
    const faviconUrl = `${window.location.origin}/favicon.svg`;
    
    // Format .url avec icône personnalisée
    const shortcutContent = `[InternetShortcut]
URL=${dashboardUrl}
IconFile=${faviconUrl}
IconIndex=0
[{000214A0-0000-0000-C000-000000000046}]
Prop3=19,11`;
    
    // Créer un blob et télécharger le fichier
    const blob = new Blob([shortcutContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = '🎯 Studyia Career - Dashboard Partner.url';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    handleClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          {/* Dialog */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
            <div className="relative bg-gradient-to-br from-card via-card to-primary/5 rounded-3xl border-2 border-primary/20 shadow-2xl overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/20 to-blue-bright/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-green-500/20 to-primary/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Content */}
              <div className="relative p-8">
                {/* Icon */}
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-blue-bright rounded-2xl blur-xl opacity-50" />
                    <div className="relative w-20 h-20 bg-gradient-to-br from-primary to-blue-bright rounded-2xl flex items-center justify-center shadow-lg">
                      <Monitor className="w-10 h-10 text-white" />
                    </div>
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-3xl font-bold text-center mb-3 bg-gradient-to-r from-primary via-blue-600 to-primary bg-clip-text text-transparent">
                  {t('home.partner.downloadApp.title')}
                </h2>

                {/* Subtitle */}
                <p className="text-center text-muted-foreground mb-6">
                  {t('home.partner.downloadApp.subtitle')}
                </p>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-primary/10 to-transparent border border-primary/20">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-blue-bright flex items-center justify-center flex-shrink-0">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{t('home.partner.downloadApp.feature1')}</p>
                      <p className="text-xs text-muted-foreground">{t('home.partner.downloadApp.feature1Desc')}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-bright/10 to-transparent border border-blue-bright/20">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-bright to-primary flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{t('home.partner.downloadApp.feature2')}</p>
                      <p className="text-xs text-muted-foreground">{t('home.partner.downloadApp.feature2Desc')}</p>
                    </div>
                  </div>

                </div>

                {/* Buttons */}
                <div className="flex flex-col gap-3">
                  <Button
                    onClick={handleDownload}
                    size="lg"
                    className="w-full bg-gradient-to-r from-primary via-blue-600 to-primary hover:shadow-xl hover:scale-[1.02] transition-all"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    {t('home.partner.downloadApp.downloadButton')}
                  </Button>

                  <Button
                    onClick={handleClose}
                    variant="ghost"
                    size="sm"
                    className="w-full"
                  >
                    {t('home.partner.downloadApp.later')}
                  </Button>
                </div>
              </div>
            </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
