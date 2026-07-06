'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import NProgress from 'nprogress';

export default function NavigationEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // On configure NProgress
    NProgress.configure({ showSpinner: false });
    
    // On termine la barre quand la route a fini de changer
    NProgress.done();

    return () => {
      // On commence la barre dès qu'un clic de navigation a lieu
      NProgress.start();
    };
  }, [pathname, searchParams]);

  return null;
}