// i18n configuration for multi-language support
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Language } from '../types';
import logger from '../utils/logger';

// Import translation files
import en from '../locales/en.json';
import ro from '../locales/ro.json';
import fr from '../locales/fr.json';
import de from '../locales/de.json';

const LANGUAGE_STORAGE_KEY = '@tulcea_app_language';

// Language detector plugin for AsyncStorage
const languageDetector = {
  type: 'languageDetector' as const,
  async: true,
  detect: async (callback: (lang: string) => void) => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (savedLanguage) {
        callback(savedLanguage);
      } else {
        // Default to English if no language is saved
        callback('en');
      }
    } catch (error) {
      logger.error('Error detecting language:', error);
      callback('en');
    }
  },
  init: () => {},
  cacheUserLanguage: async (language: string) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch (error) {
      logger.error('Error caching language:', error);
    }
  },
};

// Initialize i18n
i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ro: { translation: ro },
      fr: { translation: fr },
      de: { translation: de },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already handles escaping
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;

// Helper function to change language
export const changeLanguage = async (language: Language): Promise<void> => {
  try {
    await i18n.changeLanguage(language);
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch (error) {
    logger.error('Error changing language:', error);
    throw error;
  }
};

// Helper function to get current language
export const getCurrentLanguage = (): Language => {
  return i18n.language as Language;
};
