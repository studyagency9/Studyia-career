import { useI18n } from '@/i18n/i18nContext';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

/**
 * Composant de démonstration simple pour switcher entre FR et EN
 * À placer dans la navigation ou le header
 */
export const LanguageSwitcherDemo = () => {
  const { language, setLanguage } = useI18n();

  const toggleLanguage = () => {
    setLanguage(language === 'fr' ? 'en' : 'fr');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/30 hover:border-primary/50 transition-all duration-200 group"
      aria-label={`Changer de langue (actuellement ${language === 'fr' ? 'Français' : 'English'})`}
    >
      <Globe className="w-4 h-4 text-primary group-hover:text-primary-foreground transition-colors" />
      <span className="font-semibold text-sm text-primary-foreground">
        {language === 'fr' ? '🇫🇷 FR' : '🇬🇧 EN'}
      </span>
    </button>
  );
};
