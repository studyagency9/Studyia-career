import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { translations, Language } from './translations';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const getNestedTranslation = (obj: any, path: string): string => {
  const keys = path.split('.');
  let result = obj;
  
  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = result[key];
    } else {
      return path; // Retourne la clé si la traduction n'existe pas
    }
  }
  
  return typeof result === 'string' ? result : path;
};

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Récupérer la langue depuis localStorage ou utiliser le navigateur
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && savedLang in translations) {
      return savedLang;
    }
    
    // Détecter la langue du navigateur
    const browserLang = navigator.language.split('-')[0];
    return browserLang === 'en' ? 'en' : 'fr';
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
  }, []);

  const t = useCallback((key: string): string => {
    return getNestedTranslation(translations[language], key);
  }, [language]);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
};

// Hook pour obtenir la fonction de traduction et la langue
export const useTranslation = () => {
  const { t, language } = useI18n();
  return { t, language };
};
