import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone, Zap, Star, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface InstallPWAPromptProps {
  triggerShow?: boolean;
  onClose?: () => void;
}

export const InstallPWAPrompt = ({ triggerShow = false, onClose }: InstallPWAPromptProps) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Vérifier si l'app est déjà installée
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowPrompt(false);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  useEffect(() => {
    console.log('📱 InstallPWAPrompt - triggerShow:', triggerShow);
    // Afficher le prompt si triggerShow est true et que l'app n'est pas déjà installée
    if (triggerShow && !window.matchMedia('(display-mode: standalone)').matches) {
      const hasClosedPrompt = localStorage.getItem('studyia_associate_pwa_prompt_closed');
      console.log('📱 hasClosedPrompt:', hasClosedPrompt);
      if (!hasClosedPrompt) {
        console.log('✅ Affichage du prompt PWA');
        setShowPrompt(true);
      } else {
        console.log('⚠️ Prompt PWA déjà fermé par l\'utilisateur');
      }
    } else {
      console.log('⚠️ Conditions non remplies - triggerShow:', triggerShow, 'standalone:', window.matchMedia('(display-mode: standalone)').matches);
    }
  }, [triggerShow]);

  const handleInstall = async () => {
    console.log('🔘 Bouton Installer cliqué - deferredPrompt:', !!deferredPrompt);
    
    if (deferredPrompt) {
      // Si l'API est disponible, utiliser le prompt natif
      try {
        console.log('✅ Déclenchement du prompt natif PWA');
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        console.log('📱 Résultat installation:', outcome);
        if (outcome === 'accepted') {
          console.log('✅ PWA installée avec succès');
        } else {
          console.log('❌ Installation PWA refusée par l\'utilisateur');
        }

        setDeferredPrompt(null);
        setShowPrompt(false);
      } catch (error) {
        console.error('❌ Erreur lors de l\'installation PWA:', error);
      }
    } else {
      // Si l'API n'est pas disponible, fermer le prompt
      // L'utilisateur devra installer manuellement via le menu du navigateur
      console.log('⚠️ API beforeinstallprompt non disponible');
      console.log('💡 L\'utilisateur doit installer via le menu du navigateur');
      setShowPrompt(false);
      if (onClose) onClose();
    }
  };

  const handleClose = () => {
    setShowPrompt(false);
    localStorage.setItem('studyia_associate_pwa_prompt_closed', 'true');
    if (onClose) onClose();
  };

  if (!showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50"
      >
        <div className="relative bg-gradient-to-br from-white via-primary/5 to-green-500/5 dark:from-card dark:via-card dark:to-primary/5 rounded-3xl border-2 border-primary/30 shadow-2xl overflow-hidden backdrop-blur-xl">
          {/* Decorative gradients */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/30 to-green-500/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-500/20 to-primary/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-muted/50 hover:bg-muted transition-colors z-10"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Content */}
          <div className="relative p-6">
            {/* Icon & Title */}
            <div className="flex items-start gap-4 mb-5">
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-green-600 rounded-2xl blur-xl opacity-60 animate-pulse" />
                <div className="relative w-14 h-14 bg-gradient-to-br from-primary via-blue-600 to-green-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <Smartphone className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-xl mb-1 bg-gradient-to-r from-primary via-blue-600 to-green-600 bg-clip-text text-transparent">{t('associate.pwa.title')}</h3>
                <p className="text-sm text-muted-foreground">{t('associate.pwa.subtitle')}</p>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-3 mb-5">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-primary/10 via-blue-500/10 to-transparent border border-primary/20">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center flex-shrink-0 shadow-md">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium">{t('associate.pwa.feature1')}</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-transparent border border-green-500/20">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-md">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium">{t('associate.pwa.feature2')}</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-2">
              <Button
                onClick={handleInstall}
                size="lg"
                className="w-full bg-gradient-to-r from-primary via-blue-600 to-green-600 hover:shadow-xl hover:scale-[1.02] transition-all font-semibold"
              >
                <Download className="w-5 h-5 mr-2" />
                {t('associate.pwa.installButton')}
              </Button>
              <Button
                onClick={handleClose}
                variant="ghost"
                size="sm"
                className="w-full text-muted-foreground hover:text-foreground"
              >
                {t('associate.pwa.later')}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
