// Types pour l'internationalisation
export type Locale = 'fr' | 'en';

export interface LocaleConfig {
  code: Locale;
  name: string;
  flag: string;
}

export const locales: LocaleConfig[] = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
];

export const defaultLocale: Locale = 'fr';

// Types pour les devises
export type Currency = 'EUR' | 'USD';

export interface CurrencyConfig {
  code: Currency;
  symbol: string;
  name: string;
  position: 'before' | 'after';
}

export const currencies: CurrencyConfig[] = [
  { code: 'EUR', symbol: '€', name: 'Euro', position: 'after' },
  { code: 'USD', symbol: '$', name: 'US Dollar', position: 'before' },
];

export const defaultCurrency: Currency = 'EUR';

// Taux de conversion (base: EUR)
export const exchangeRates: Record<Currency, number> = {
  EUR: 1,
  USD: 1.10,
};

// Types pour les messages
export interface Messages {
  common: {
    welcome: string;
    home: string;
    about: string;
    services: string;
    contact: string;
    login: string;
    signup: string;
    search: string;
    learnMore: string;
    getStarted: string;
    viewAll: string;
  };
  navigation: {
    menu: string;
    language: string;
    currency: string;
  };
  hero: {
    title: string;
    subtitle: string;
    cta: string;
  };
  products: {
    title: string;
    featured: string;
    new: string;
    addToCart: string;
    outOfStock: string;
    price: string;
  };
  pricing: {
    title: string;
    subtitle: string;
    monthly: string;
    yearly: string;
    starter: PlanMessages;
    pro: PlanMessages;
    enterprise: PlanMessages;
  };
  footer: {
    rights: string;
    privacy: string;
    terms: string;
  };
}

export interface PlanMessages {
  name: string;
  description: string;
  features: string[];
}