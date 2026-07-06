'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import {
  Currency,
  CurrencyConfig,
  currencies,
  defaultCurrency,
  exchangeRates,
} from '@/types/i18n';

interface CurrencyContextType {
  currency: Currency;
  currencyConfig: CurrencyConfig;
  setCurrency: (currency: Currency) => void;
  formatPrice: (priceInEur: number, options?: FormatOptions) => string;
  convertPrice: (priceInEur: number) => number;
}

interface FormatOptions {
  decimals?: number;
  showSymbol?: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const STORAGE_KEY = 'app-currency';

interface CurrencyProviderProps {
  children: ReactNode;
}

export function CurrencyProvider({ children }: CurrencyProviderProps) {
  const [currency, setCurrencyState] = useState<Currency>(defaultCurrency);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydratation côté client
  useEffect(() => {
    const savedCurrency = localStorage.getItem(STORAGE_KEY) as Currency | null;
    if (savedCurrency && (savedCurrency === 'EUR' || savedCurrency === 'USD')) {
      setCurrencyState(savedCurrency);
    }
    setIsHydrated(true);
  }, []);

  const currencyConfig = currencies.find(c => c.code === currency) || currencies[0];

  const setCurrency = useCallback((newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem(STORAGE_KEY, newCurrency);
  }, []);

  // Convertir un prix de EUR vers la devise sélectionnée
  const convertPrice = useCallback((priceInEur: number): number => {
    const rate = exchangeRates[currency];
    return priceInEur * rate;
  }, [currency]);

  // Formater un prix avec le symbole de devise
  const formatPrice = useCallback((
    priceInEur: number,
    options: FormatOptions = {}
  ): string => {
    const { decimals = 2, showSymbol = true } = options;
    
    const convertedPrice = convertPrice(priceInEur);
    const formattedNumber = convertedPrice.toFixed(decimals);
    
    if (!showSymbol) {
      return formattedNumber;
    }
    
    const { symbol, position } = currencyConfig;
    
    if (position === 'before') {
      return `${symbol}${formattedNumber}`;
    }
    return `${formattedNumber}${symbol}`;
  }, [convertPrice, currencyConfig]);

  // Éviter le flash pendant l'hydratation
  if (!isHydrated) {
    return null;
  }

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        currencyConfig,
        setCurrency,
        formatPrice,
        convertPrice,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextType {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
