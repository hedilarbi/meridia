'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { CurrencySelector } from '@/components/CurrencySelector';
import { LanguageSelector } from '@/components/LanguageSelector';

export default function Header() {
  const t = useTranslations();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: t('common.home'), href: '/' },
    { label: t('common.destinations'), href: '/#destinations' },
    { label: t('common.hotels'), href: '/hotels' },
    { label: t('common.flights'), href: '/flights' },
    { label: t('common.contact'), href: '#contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link href="/" className="flex items-center gap-2 sm:gap-3" style={{ textDecoration: 'none' }}>
            <div className="w-9 h-9 sm:w-11 sm:h-11 bg-linear-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/30">
              <i className="fa-solid fa-paper-plane text-white text-sm sm:text-base"></i>
            </div>
            <span className="text-xl sm:text-2xl font-extrabold text-slate-800">
              Officiel<span className="text-sky-500">Vacances</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-slate-900 hover:text-sky-500 font-semibold transition-colors no-underline [text-decoration:none]"
                style={{ textDecoration: 'none' }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <CurrencySelector />
              <LanguageSelector />
            </div>
            <button className="hidden sm:inline-flex bg-linear-to-r from-sky-500 to-blue-600 text-white px-4 sm:px-6 py-2.5 rounded-full font-bold text-sm shadow-lg shadow-sky-500/30 hover:shadow-xl hover:shadow-sky-500/40 transition-all hover:-translate-y-0.5">
              {t('common.login')}
            </button>
            <button
              type="button"
              className="lg:hidden w-10 h-10 rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm"
              aria-label="Ouvrir le menu"
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
            >
              <i className={`fa-solid ${isMobileMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200/60 bg-white shadow-xl">
          <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-3 rounded-xl text-slate-800 font-semibold hover:bg-slate-50 hover:text-sky-500 transition-colors"
                style={{ textDecoration: 'none' }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <button className="mt-2 bg-linear-to-r from-sky-500 to-blue-600 text-white px-4 py-3 rounded-xl font-bold text-sm shadow-lg shadow-sky-500/30">
              {t('common.login')}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
