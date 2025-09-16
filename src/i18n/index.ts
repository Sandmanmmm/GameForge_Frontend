/**
 * Internationalization Configuration
 * Supports multiple languages with dynamic loading
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    common: () => import('../../public/locales/en/common.json'),
    dashboard: () => import('../../public/locales/en/dashboard.json'),
    auth: () => import('../../public/locales/en/auth.json'),
    projects: () => import('../../public/locales/en/projects.json'),
  },
  es: {
    common: () => import('../../public/locales/es/common.json'),
    dashboard: () => import('../../public/locales/es/dashboard.json'),
    auth: () => import('../../public/locales/es/auth.json'),
    projects: () => import('../../public/locales/es/projects.json'),
  },
  fr: {
    common: () => import('../../public/locales/fr/common.json'),
    dashboard: () => import('../../public/locales/fr/dashboard.json'),
    auth: () => import('../../public/locales/fr/auth.json'),
    projects: () => import('../../public/locales/fr/projects.json'),
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: import.meta.env.VITE_NODE_ENV === 'development',
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false, // React already escapes
    },

    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },

    react: {
      useSuspense: true,
      bindI18n: 'languageChanged',
      bindI18nStore: 'added removed',
    },
  });

export default i18n;

// Language utilities
export const supportedLanguages = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
} as const;

export type SupportedLanguage = keyof typeof supportedLanguages;

export const getCurrentLanguage = (): SupportedLanguage => {
  return (i18n.language as SupportedLanguage) || 'en';
};

export const changeLanguage = (lang: SupportedLanguage) => {
  return i18n.changeLanguage(lang);
};
