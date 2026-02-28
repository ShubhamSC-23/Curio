import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslation from './locales/en/translation.json';
import hiTranslation from './locales/hi/translation.json';
import mrTranslation from './locales/mr/translation.json';

// Language metadata with flags and native names
export const languages = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    dir: 'ltr'
  },
  hi: {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिंदी',
    flag: '🇮🇳',
    dir: 'ltr'
  },
  mr: {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    flag: '🇮🇳',
    dir: 'ltr'
  }
};

// Language detection configuration
const detectionOptions = {
  // Order of detection
  order: ['localStorage', 'navigator', 'htmlTag'],
  
  // Cache user language preference
  caches: ['localStorage'],
  
  // LocalStorage key name
  lookupLocalStorage: 'curio_language',
  
  // Only detect languages in our supported list
  checkWhitelist: true
};

// Initialize i18next
i18n
  .use(LanguageDetector)  // Detect user language
  .use(initReactI18next)  // Pass i18n to react-i18next
  .init({
    // Translation resources
    resources: {
      en: { translation: enTranslation },
      hi: { translation: hiTranslation },
      mr: { translation: mrTranslation }
    },
    
    // Fallback language if translation not found
    fallbackLng: 'en',
    
    // Supported languages
    supportedLngs: ['en', 'hi', 'mr'],
    
    // Language detection configuration
    detection: detectionOptions,
    
    // Interpolation configuration
    interpolation: {
      escapeValue: false // React already escapes values
    },
    
    // React-specific configuration
    react: {
      useSuspense: false // Disable suspense for now
    },
    
    // Debug mode (set to true for development)
    debug: false
  });

export default i18n;
