import { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import PartnerLayout from '@/components/partner/PartnerLayout';
import { useI18n } from '@/i18n/i18nContext';
import { useTranslation } from '@/i18n/i18nContext';

const CreateCVPage = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<'fr' | 'en' | null>(null);
  const navigate = useNavigate();
  const { setLanguage } = useI18n();
  const { t } = useTranslation();

  const handleLanguageSelect = (lang: 'fr' | 'en') => {
    setSelectedLanguage(lang);
  };

  const handleContinue = () => {
    if (selectedLanguage) {
      setLanguage(selectedLanguage);
      navigate('/partner/builder/new');
    }
  };

  const languages = [
    {
      code: 'fr' as const,
      name: 'Français',
      flag: '🇫🇷',
      description: t('home.partner.createCV.frenchDescription'),
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      code: 'en' as const,
      name: 'English',
      flag: '🇬🇧',
      description: t('home.partner.createCV.englishDescription'),
      gradient: 'from-red-500 to-red-600',
    },
  ];

  return (
    <PartnerLayout>
      <div className="min-h-screen flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl"
        >
          <Card className="p-12 bg-card border-border shadow-2xl">
            {/* Header */}
            <div className="text-center mb-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-blue-bright flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/50"
              >
                <Globe className="w-10 h-10 text-primary-foreground" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-4xl font-bold text-foreground mb-4"
              >
                {t('home.partner.createCV.title')}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-lg text-muted-foreground max-w-2xl mx-auto"
              >
                {t('home.partner.createCV.subtitle')}
              </motion.p>
            </div>

            {/* Language Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
            >
              {languages.map((lang, index) => (
                <motion.button
                  key={lang.code}
                  initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  onClick={() => handleLanguageSelect(lang.code)}
                  className={`relative p-8 rounded-2xl border-2 transition-all duration-300 group ${
                    selectedLanguage === lang.code
                      ? 'border-primary bg-primary/5 shadow-xl shadow-primary/20'
                      : 'border-border hover:border-primary/50 hover:shadow-lg'
                  }`}
                >
                  {selectedLanguage === lang.code && (
                    <motion.div
                      layoutId="selected"
                      className="absolute top-4 right-4 w-8 h-8 rounded-full bg-primary flex items-center justify-center"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      <Sparkles className="w-5 h-5 text-primary-foreground" />
                    </motion.div>
                  )}

                  <div className="text-center">
                    <div className="text-6xl mb-4">{lang.flag}</div>
                    <h3 className={`text-2xl font-bold mb-2 transition-colors ${
                      selectedLanguage === lang.code ? 'text-primary' : 'text-foreground group-hover:text-primary'
                    }`}>
                      {lang.name}
                    </h3>
                    <p className="text-muted-foreground">{lang.description}</p>
                  </div>

                  <div className={`mt-6 h-1 rounded-full bg-gradient-to-r ${lang.gradient} opacity-0 group-hover:opacity-100 transition-opacity ${
                    selectedLanguage === lang.code ? 'opacity-100' : ''
                  }`} />
                </motion.button>
              ))}
            </motion.div>

            {/* Continue Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="text-center"
            >
              <Button
                size="lg"
                onClick={handleContinue}
                disabled={!selectedLanguage}
                className="bg-gradient-to-r from-primary to-blue-bright hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed px-8 h-14 text-lg"
              >
                {t('home.partner.createCV.continue')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              {!selectedLanguage && (
                <p className="text-sm text-muted-foreground mt-4">
                  {t('home.partner.createCV.selectLanguage')}
                </p>
              )}
            </motion.div>
          </Card>
        </motion.div>
      </div>
    </PartnerLayout>
  );
};

export default CreateCVPage;
