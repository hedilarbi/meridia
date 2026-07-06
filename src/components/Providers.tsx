'use client';

import React, { ReactNode } from 'react';
import { LocaleProvider } from '@/contexts/LocaleContext';
import { CurrencyProvider } from '@/contexts/CurrencyContext';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <LocaleProvider>
      <CurrencyProvider>
        {children}
      </CurrencyProvider>
    </LocaleProvider>
  );
}