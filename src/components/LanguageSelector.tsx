'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLocale } from '@/contexts/LocaleContext';
import { locales, Locale } from '@/types/i18n';

export function LanguageSelector() {
  const { locale, setLocale } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLocale = locales.find(l => l.code === locale) || locales[0];

  // Fermer le dropdown quand on clique ailleurs
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: Locale) => {
    setLocale(code);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg
                   bg-slate-100 hover:bg-slate-200 border border-slate-200
                   transition-all duration-200 text-sm font-semibold
                   focus:outline-none focus:ring-2 focus:ring-sky-500/50"
        aria-label="Changer de langue"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="text-base">{currentLocale.flag}</span>
        <span className="text-slate-700">{currentLocale.code.toUpperCase()}</span>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-40 rounded-xl overflow-hidden
                     bg-white border border-slate-200
                     shadow-xl shadow-slate-200/50 z-200"
          role="listbox"
          aria-label="Sélectionner une langue"
        >
          {locales.map((loc) => (
            <button
              key={loc.code}
              onClick={() => handleSelect(loc.code)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left
                         transition-colors duration-150
                         ${locale === loc.code
                           ? 'bg-sky-50 text-sky-600'
                           : 'text-slate-700 hover:bg-slate-50'
                         }`}
              role="option"
              aria-selected={locale === loc.code}
            >
              <span className="text-lg">{loc.flag}</span>
              <span className="font-semibold">{loc.name}</span>
              {locale === loc.code && (
                <svg className="w-4 h-4 ml-auto text-sky-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}