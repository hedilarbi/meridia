'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations();

  const footerColumns = [
    {
      title: t('footer.company'),
      links: [t('footer.about'), t('footer.careers'), t('footer.press'), t('footer.blog')],
    },
    {
      title: t('footer.support'),
      links: [t('footer.helpCenter'), t('footer.contactUs'), t('footer.faq'), t('footer.cancellation')],
    },
    {
      title: t('footer.legal'),
      links: [t('footer.terms'), t('footer.privacy'), t('footer.cookies'), t('footer.licenses')],
    },
  ];

  return (
    <footer id="contact" className="bg-slate-900 pt-16 sm:pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 mb-12 sm:mb-16">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6" style={{ textDecoration: 'none' }}>
              <div className="w-10 h-10 bg-linear-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center">
                <i className="fa-solid fa-paper-plane text-white"></i>
              </div>
              <span className="text-xl font-extrabold text-white">
                Officiel<span className="text-sky-400">Vacances</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              {t('footer.description')}
            </p>
            <div className="flex gap-3">
              {['facebook-f', 'twitter', 'instagram', 'linkedin-in'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-white hover:bg-sky-500 hover:text-white transition-colors"
                  style={{ textDecoration: 'none' }}
                >
                  <i className={`fa-brands fa-${social}`}></i>
                </a>
              ))}
            </div>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title}>
              <h4 className="text-white font-bold mb-4 sm:mb-6">{column.title}</h4>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-white hover:text-sky-400 transition-colors text-sm" style={{ textDecoration: 'none' }}>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-400 text-sm">
          <p>© 2025 OfficielVacances. {t('footer.rights')}.</p>
          <div className="flex items-center gap-4">
            <span className="font-semibold">{t('footer.securePayments')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
