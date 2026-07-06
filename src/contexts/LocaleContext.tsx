'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import { useTranslations } from 'next-intl';

type Locale = 'fr' | 'en';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

interface LocaleProviderProps {
  children: ReactNode;
}

export function LocaleProvider({ children }: LocaleProviderProps) {
  const [locale, setLocaleState] = useState<Locale>('fr');
  const translations = useTranslations();

  useEffect(() => {
    // Lire la locale depuis le cookie
    const savedLocale = document.cookie
      .split('; ')
      .find(row => row.startsWith('locale='))
      ?.split('=')[1] as Locale | undefined;
    
    if (savedLocale && (savedLocale === 'fr' || savedLocale === 'en')) {
      setLocaleState(savedLocale);
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    // Sauvegarder dans un cookie
    document.cookie = `locale=${newLocale};path=/;max-age=31536000`;
    // Recharger la page pour appliquer la nouvelle langue
    window.location.reload();
  }, []);

  const t = useCallback((key: string) => {
    try {
      return translations(key);
    } catch {
      return key;
    }
  }, [translations]);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextType {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}