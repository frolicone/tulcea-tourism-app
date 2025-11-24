// Language context for managing app-wide language state
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Language } from '../types';
import { changeLanguage, getCurrentLanguage } from '../services/i18n';
import logger from '../utils/logger';

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => Promise<void>;
  isChangingLanguage: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);

  useEffect(() => {
    // Get initial language from i18n
    const lang = getCurrentLanguage();
    setCurrentLanguage(lang);
  }, []);

  const setLanguage = async (language: Language): Promise<void> => {
    try {
      setIsChangingLanguage(true);
      await changeLanguage(language);
      setCurrentLanguage(language);
    } catch (error) {
      logger.error('Failed to change language:', error);
      throw error;
    } finally {
      setIsChangingLanguage(false);
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        isChangingLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
