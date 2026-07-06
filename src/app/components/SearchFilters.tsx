'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchFilters() {
  const [activeTab, setActiveTab] = useState('stays');
  const [city, setCity] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      const path = activeTab === 'flights' ? '/flights' : '/hotels';
      router.push(`${path}?city=${encodeURIComponent(city)}`);
    }
  };

  return (
    <div className="card border shadow-sm rounded-4 mx-auto overflow-hidden text-start" style={{ maxWidth: '950px' }}>
      {/* Barre d'onglets */}
      <div className="d-flex justify-content-center border-bottom bg-white pt-3">
        {[
          { id: 'stays', label: 'Séjours', icon: '🏨' },
          { id: 'flights', label: 'Vols', icon: '✈️' },
          { id: 'cars', label: 'Voitures', icon: '🚗' },
          { id: 'activities', label: 'Activités', icon: '🎟️' }
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`btn border-0 pb-2 px-4 rounded-0 transition ${activeTab === tab.id ? 'border-bottom border-primary border-3 text-primary fw-bold' : 'text-muted'}`}
          >
            <div className="fs-3 mb-1">{tab.icon}</div>
            <span className="small">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="p-4">
        <form onSubmit={handleSearch}>
          {/* SECTION SÉJOURS */}
          {activeTab === 'stays' && (
            <div className="row g-2 align-items-center">
              <div className="col-md-5">
                <div className="border rounded-3 p-2 d-flex align-items-center bg-white shadow-hover transition">
                  <span className="me-2 fs-5">📍</span>
                  <div className="w-100">
                    <label className="extra-small text-muted d-block m-0">Où allez-vous ?</label>
                    <input type="text" className="form-control border-0 p-0 shadow-none fw-bold" placeholder="Saisissez une ville" value={city} onChange={(e) => setCity(e.target.value)} />
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="border rounded-3 p-2 d-flex align-items-center bg-white shadow-hover transition text-muted">
                  <span className="me-2 fs-5">📅</span>
                  <div className="w-100">
                    <label className="extra-small text-muted d-block m-0">Dates</label>
                    <div className="fw-bold small">Sam. 14 fév. - Dim. 22 fév.</div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <button type="submit" className="btn btn-primary w-100 rounded-pill py-3 fw-bold shadow-sm">Rechercher</button>
              </div>
            </div>
          )}

          {/* SECTION VOLS */}
          {activeTab === 'flights' && (
            <div>
              <div className="d-flex gap-3 mb-3 small fw-bold text-primary">
                <span className="border-bottom border-primary pb-1">Aller-retour</span>
                <span className="text-muted">Aller simple</span>
              </div>
              <div className="row g-2 align-items-center">
                <div className="col-md-6">
                  <div className="d-flex border rounded-3 overflow-hidden shadow-hover transition">
                    <input type="text" className="form-control border-0 p-3 fw-bold shadow-none w-50" placeholder="Départ" />
                    <div className="bg-light d-flex align-items-center px-2">⇌</div>
                    <input type="text" className="form-control border-0 p-3 fw-bold shadow-none w-50" placeholder="Destination" value={city} onChange={(e) => setCity(e.target.value)} />
                  </div>
                </div>
                <div className="col-md-4">
                   <div className="border rounded-3 p-3 bg-white fw-bold shadow-hover transition text-muted">Sélectionnez vos dates</div>
                </div>
                <div className="col-md-2">
                  <button type="submit" className="btn btn-primary rounded-pill w-100 py-3 fw-bold">Trouver</button>
                </div>
              </div>
            </div>
          )}

          {/* SECTION VOITURES */}
          {activeTab === 'cars' && (
            <div className="row g-2 align-items-center text-muted">
              <div className="col-md-4"><div className="border rounded-3 p-3 bg-white fw-bold shadow-hover transition">📍 Lieu de prise en charge</div></div>
              <div className="col-md-3"><div className="border rounded-3 p-3 bg-white fw-bold shadow-hover transition">📅 Dates</div></div>
              <div className="col-md-3"><div className="border rounded-3 p-3 bg-white fw-bold shadow-hover transition">🕒 10:30</div></div>
              <div className="col-md-2"><button className="btn btn-primary rounded-pill w-100 py-3 fw-bold">Rechercher</button></div>
            </div>
          )}

          {/* SECTION ACTIVITÉS */}
          {activeTab === 'activities' && (
            <div className="row g-2 align-items-center">
              <div className="col-md-9">
                <div className="border rounded-3 p-3 d-flex align-items-center bg-white shadow-hover transition">
                  <span className="me-2 fs-5">🎟️</span>
                  <input type="text" className="form-control border-0 p-0 shadow-none fw-bold" placeholder="Activités, visites guidées, musées..." />
                </div>
              </div>
              <div className="col-md-3">
                <button className="btn btn-primary rounded-pill w-100 py-3 fw-bold">Explorer</button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}