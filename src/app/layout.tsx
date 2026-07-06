import './globals.css';
import 'nprogress/nprogress.css';
import { Suspense } from 'react';
import NavigationEvents from './components/navigation-events';
import Script from 'next/script';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { Providers } from '@/components/Providers';
import Header from './components/Header';
import Footer from './components/Footer';

export const metadata = {
  title: 'OfficielVacances | Comparez vos voyages de rêve',
  description: 'Comparez hôtels, vols et voitures pour préparer vos prochaines vacances.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <Suspense fallback={null}>
              <NavigationEvents />
            </Suspense>
            <Header />
            <main className="pt-16 sm:pt-20">
              {children}
            </main>
            <Footer />
          </Providers>
        </NextIntlClientProvider>
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
