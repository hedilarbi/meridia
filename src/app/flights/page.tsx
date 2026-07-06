'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function FlightsResultsPage() {
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '';
  const [flights, setFlights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlights = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3000/api/search/flights/popular`);
        const data = await res.json();
        setFlights(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Erreur Vols API:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFlights();
  }, [from]);

  return (
    <div className="bg-light min-vh-100">
      {/* Header de recherche rapide */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top shadow-sm p-3" style={{ zIndex: 1040 }}>
        <div className="container">
          <Link href="/" className="navbar-brand fw-bold text-primary">OfficielVacances</Link>
          <div className="d-flex grow mx-4">
            <div className="input-group">
                <span className="input-group-text bg-white rounded-start-pill border-end-0">✈️</span>
                <input type="text" className="form-control rounded-end-pill shadow-sm border-start-0 bg-white" value={from} readOnly />
            </div>
          </div>
        </div>
      </nav>

      <div className="container py-4">
        <div className="row">
          
          {/* --- FILTRES (Gauche) --- */}
          <aside className="col-lg-3">
            <div className="card border-0 shadow-sm p-4 mb-3 rounded-4 sticky-top" style={{ top: '100px' }}>
              <h6 className="fw-bold mb-3">Escales</h6>
              <div className="form-check small mb-2">
                <input className="form-check-input" type="checkbox" id="direct" />
                <label className="form-check-label" htmlFor="direct">Vols directs</label>
              </div>
              <div className="form-check small mb-2">
                <input className="form-check-input" type="checkbox" id="1stop" />
                <label className="form-check-label" htmlFor="1stop">1 escale</label>
              </div>

              <h6 className="fw-bold mt-4 mb-3">Compagnies</h6>
              {['Air France', 'Lufthansa', 'Emirates', 'EasyJet'].map(airline => (
                <div className="form-check small mb-2" key={airline}>
                  <input className="form-check-input" type="checkbox" id={airline} />
                  <label className="form-check-label" htmlFor={airline}>{airline}</label>
                </div>
              ))}
            </div>
          </aside>

          {/* --- LISTE DES VOLS (Droite) --- */}
          <main className="col-lg-9">
            <h5 className="fw-bold mb-4">Vols disponibles au départ de {from || 'votre ville'}</h5>
            
            {loading ? (
              /* --- SKELETON LOADER POUR LES VOLS --- */
              <div className="d-flex flex-column gap-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="card border-0 shadow-sm rounded-4 overflow-hidden" style={{ height: '160px' }}>
                    <div className="card-body p-4 d-flex align-items-center">
                       <div className="placeholder-glow col-2 text-center">
                          <div className="placeholder rounded-circle mb-2" style={{width: '50px', height: '50px'}}></div>
                          <div className="placeholder col-8 rounded"></div>
                       </div>
                       <div className="placeholder-glow col-7 px-4 border-start border-end h-100 d-flex flex-column justify-content-center">
                          <div className="placeholder col-10 rounded mb-3"></div>
                          <div className="placeholder col-6 rounded"></div>
                       </div>
                       <div className="placeholder-glow col-3 text-center">
                          <div className="placeholder col-6 rounded mb-2 py-3"></div>
                          <div className="placeholder col-8 rounded-pill py-3"></div>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              flights.map((flight: any, index: number) => (
                <div key={index} className="card border-0 shadow-sm mb-3 rounded-4 shadow-hover transition overflow-hidden">
                  <div className="card-body p-0">
                    <div className="row g-0 align-items-center p-4">
                      {/* Logo et Info Compagnie */}
                      <div className="col-md-2 text-center">
                        <div className="bg-light rounded-circle mx-auto mb-2 d-flex align-items-center justify-content-center" style={{width: '50px', height: '50px'}}>
                          ✈️
                        </div>
                        <span className="small fw-bold d-block">{flight.airline || 'Compagnie'}</span>
                      </div>

                      {/* Horaires et Trajet */}
                      <div className="col-md-7 px-4 border-start border-end">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <div>
                            <h5 className="fw-bold mb-0">10:45</h5>
                            <span className="text-muted small">CDG</span>
                          </div>
                          <div className="grow mx-4 text-center position-relative">
                            <span className="extra-small text-muted d-block mb-1">2h 15m (Direct)</span>
                            <hr className="m-0 border-primary opacity-50" />
                          </div>
                          <div className="text-end">
                            <h5 className="fw-bold mb-0">13:00</h5>
                            <span className="text-muted small">LHR</span>
                          </div>
                        </div>
                        <p className="extra-small text-success m-0 fw-bold">✨ Sélectionné par 85% des voyageurs</p>
                      </div>

                      {/* Prix et Action */}
                      <div className="col-md-3 text-center">
                        <h3 className="fw-bold text-dark mb-0">{flight.price || '89'} €</h3>
                        <p className="text-muted extra-small mb-3">Aller simple / Pers.</p>
                        <button className="btn btn-primary rounded-pill px-4 fw-bold w-100 shadow-sm">
                          Choisir
                        </button>
                      </div>
                    </div>
                    {/* Pied de carte (Détails) */}
                    <div className="bg-light p-2 text-center border-top">
                        <span className="extra-small text-muted fw-bold cursor-pointer">Détails du vol ⌵</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </main>
        </div>
      </div>
    </div>
  );
}