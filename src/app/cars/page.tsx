'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CarsResultsPage() {
  const searchParams = useSearchParams();
  const location = searchParams.get('location') || '';
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      try {
        // Appel à votre backend NestJS
        const res = await fetch(`http://localhost:3000/api/search/cars?location=${location}`);
        const data = await res.json();
        setCars(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Erreur Cars API:", error);
      } finally {
        setLoading(false);
      }
    };
    if (location) fetchCars();
  }, [location]);

  return (
    <div className="bg-light min-vh-100">
      {/* Barre de recherche simplifiée */}
      <nav className="navbar navbar-light bg-white border-bottom shadow-sm p-3">
        <div className="container">
          <Link href="/" className="navbar-brand fw-bold text-primary">OfficielVacances</Link>
          <div className="d-flex grow mx-4">
            <input type="text" className="form-control rounded-pill px-4" defaultValue={`📍 ${location}`} readOnly />
          </div>
        </div>
      </nav>

      <div className="container py-4">
        <div className="row">
          
          {/* --- FILTRES VOITURES (Gauche) --- */}
          <aside className="col-lg-3">
            <div className="card border-0 shadow-sm p-3 rounded-4 mb-3">
              <h6 className="fw-bold mb-3">Type de véhicule</h6>
              {['Économique', 'SUV', 'Luxe', 'Mini-fourgonnette'].map(type => (
                <div className="form-check small mb-2" key={type}>
                  <input className="form-check-input" type="checkbox" id={type} />
                  <label className="form-check-label" htmlFor={type}>{type}</label>
                </div>
              ))}

              <h6 className="fw-bold mt-4 mb-3">Capacité</h6>
              <div className="form-check small mb-2">
                <input className="form-check-input" type="checkbox" id="5pass" />
                <label className="form-check-label" htmlFor="5pass">5 passagers ou plus</label>
              </div>
              
              <h6 className="fw-bold mt-4 mb-3">Transmission</h6>
              <div className="form-check small mb-2">
                <input className="form-check-input" type="checkbox" id="auto" />
                <label className="form-check-label" htmlFor="auto">Automatique</label>
              </div>
            </div>
          </aside>

          {/* --- LISTE DES VOITURES (Droite) --- */}
          <main className="col-lg-9">
            <h5 className="fw-bold mb-4">Locations disponibles à {location || 'votre destination'}</h5>

            {loading ? (
              <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
            ) : (
              <div className="row g-3">
                {cars.length > 0 ? cars.map((car, index) => (
                  <CarCard key={index} car={car} />
                )) : (
                  /* Simulation si l'API est vide pour le moment */
                  [1, 2, 3].map(i => <CarCard key={i} car={{name: 'Toyota RAV4', type: 'SUV'}} />)
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function CarCard({ car }: any) {
  return (
    <div className="col-md-12">
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden shadow-hover transition mb-3">
        <div className="row g-0">
          <div className="col-md-4 bg-white d-flex align-items-center justify-content-center p-3">
            <img src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=400" className="img-fluid rounded" alt="car" />
          </div>
          <div className="col-md-8">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h5 className="fw-bold mb-1">{car.name || 'Véhicule Intermédiaire'}</h5>
                  <p className="text-muted small mb-3">{car.type || 'SUV'} • Automatique</p>
                </div>
                <div className="text-end text-success small fw-bold">Kilométrage illimité</div>
              </div>

              <div className="d-flex gap-3 mb-4 text-muted small">
                <span>👤 5 passagers</span>
                <span>🧳 2 Bagages</span>
                <span>❄️ Climatisé</span>
              </div>

              <div className="d-flex justify-content-between align-items-end border-top pt-3">
                <div>
                  <span className="badge bg-primary-subtle text-primary">Offre spéciale</span>
                  <p className="extra-small text-muted mt-1 mb-0">Prise en charge à l'aéroport</p>
                </div>
                <div className="text-end">
                  <h3 className="fw-bold text-primary mb-0">{car.price || '52'} €</h3>
                  <p className="text-muted extra-small mb-2">par jour</p>
                  <button className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm">Réserver</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}