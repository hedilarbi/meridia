import './globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'nprogress/nprogress.css';
import Link from 'next/link';
import { Suspense } from 'react';
import NavigationEvents from './components/navigation-events';

export const metadata = {
  title: 'OfficielVacances | Clone Expedia',
  description: 'Réservez hôtels, vols et voitures',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        {/* Gestionnaire de la barre de progression (NProgress) */}
        <Suspense fallback={null}>
          <NavigationEvents />
        </Suspense>

        {/* --- NAVBAR PRINCIPALE (Style Expedia) --- */}
        <header className="bg-white border-bottom sticky-top shadow-sm" style={{ zIndex: 1050 }}>
          <div className="container py-2">
            <div className="d-flex align-items-center justify-content-between">
              
              {/* Logo et Menu Services */}
              <div className="d-flex align-items-center gap-4">
                <Link href="/" className="navbar-brand fw-bold text-primary fs-3 m-0">
                  OfficielVacances
                </Link>
                
                <nav className="d-none d-md-flex gap-3">
                  <Link href="/hotels" className="text-decoration-none text-dark small fw-bold shadow-hover px-2 py-1 rounded">
                    🏨 Hébergements
                  </Link>
                  <Link href="/flights" className="text-decoration-none text-dark small fw-bold shadow-hover px-2 py-1 rounded">
                    ✈️ Vols
                  </Link>
                  <Link href="/cars" className="text-decoration-none text-dark small fw-bold shadow-hover px-2 py-1 rounded">
                    🚗 Voitures
                  </Link>
                </nav>
              </div>

              {/* Liens utilitaires (Droite) */}
              <div className="d-flex align-items-center gap-3">
                <span className="small d-none d-lg-inline cursor-pointer">Français</span>
                <span className="small d-none d-lg-inline cursor-pointer">Assistance</span>
                <Link href="/trips" className="text-decoration-none text-dark small">Mes voyages</Link>
                <button className="btn btn-outline-primary btn-sm rounded-pill px-3 fw-bold">
                  Se connecter
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Contenu des pages */}
        <main>
          {children}
        </main>

        {/* --- FOOTER (Bas de page) --- */}
        <footer className="bg-white border-top py-5 mt-5">
          <div className="container">
            <div className="row g-4">
              <div className="col-md-3">
                <h6 className="fw-bold">Organisation du voyage</h6>
                <ul className="list-unstyled small text-muted mt-3">
                  <li>Hôtels à Paris</li>
                  <li>Vols vers Londres</li>
                  <li>Location voiture Nice</li>
                </ul>
              </div>
              <div className="col-md-3">
                <h6 className="fw-bold">Aide et Assistance</h6>
                <ul className="list-unstyled small text-muted mt-3">
                  <li>Service client</li>
                  <li>Annuler une réservation</li>
                  <li>Utiliser un coupon</li>
                </ul>
              </div>
              <div className="col-md-6 text-md-end">
                <p className="small text-muted">© 2025 OfficielVacances.com, Inc. Tous droits réservés.</p>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}