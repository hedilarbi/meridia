'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface CategoryTabsProps {
  activeTab: 'hotels' | 'flights' | 'cars';
  onTabChange: (tab: 'hotels' | 'flights' | 'cars') => void;
}

export default function CategoryTabs({ activeTab, onTabChange }: CategoryTabsProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');

  const tabs = [
    { id: 'hotels' as const, label: 'Hôtels', icon: 'fa-hotel' },
    { id: 'flights' as const, label: 'Vols', icon: 'fa-plane' },
    { id: 'cars' as const, label: 'Voitures', icon: 'fa-car' },
  ];

  const regions = [
    { id: 'all', label: 'Tous les Hôtels' },
    { id: 'france', label: 'France' },
    { id: 'med', label: 'Méditerranée' },
    { id: 'europe', label: 'Europe' },
    { id: 'intl', label: 'International' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/hotels?city=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <section className="py-16 max-w-7xl mx-auto px-6 -mt-12 relative z-20">
      <div className="bg-white p-4 rounded-3xl shadow-xl border border-slate-100">
        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-6 pb-4 border-b border-slate-100">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-200'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <i className={`fas ${tab.icon}`}></i>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Hotels Tab Content */}
        {activeTab === 'hotels' && (
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Region Filters */}
            <div className="flex flex-wrap gap-2">
              {regions.map((region) => (
                <button
                  key={region.id}
                  onClick={() => setSelectedRegion(region.id)}
                  className={`category-pill px-6 py-3 rounded-2xl text-sm font-bold border border-slate-100 transition-all ${
                    selectedRegion === region.id ? 'active' : ''
                  }`}
                >
                  {region.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <form onSubmit={handleSearch} className="relative flex-1 md:max-w-xs">
              <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un hôtel, une ville..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-sky-500 outline-none text-sm font-medium"
              />
            </form>
          </div>
        )}

        {/* Flights Tab Content */}
        {activeTab === 'flights' && (
          <div className="space-y-4">
            <div className="flex gap-4 text-sm font-bold">
              <button className="text-sky-600 border-b-2 border-sky-600 pb-1">Aller-retour</button>
              <button className="text-slate-400 hover:text-slate-600">Aller simple</button>
              <button className="text-slate-400 hover:text-slate-600">Multi-destinations</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <i className="fas fa-plane-departure text-sky-500"></i>
                <div className="flex-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">Départ</label>
                  <input type="text" placeholder="Ville de départ" className="w-full bg-transparent font-semibold text-slate-900 outline-none" />
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <i className="fas fa-plane-arrival text-sky-500"></i>
                <div className="flex-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">Destination</label>
                  <input type="text" placeholder="Ville d'arrivée" className="w-full bg-transparent font-semibold text-slate-900 outline-none" />
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <i className="fas fa-calendar text-sky-500"></i>
                <div className="flex-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">Dates</label>
                  <span className="font-semibold text-slate-400">Sélectionner</span>
                </div>
              </div>
              
              <button 
                onClick={() => router.push('/flights')}
                className="btn-primary-modern flex items-center justify-center gap-2"
              >
                <i className="fas fa-search"></i>
                Rechercher
              </button>
            </div>
          </div>
        )}

        {/* Cars Tab Content */}
        {activeTab === 'cars' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <i className="fas fa-location-dot text-sky-500"></i>
              <div className="flex-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Lieu de prise en charge</label>
                <input type="text" placeholder="Aéroport, gare..." className="w-full bg-transparent font-semibold text-slate-900 outline-none" />
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <i className="fas fa-calendar text-sky-500"></i>
              <div className="flex-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Prise en charge</label>
                <span className="font-semibold text-slate-400">Date & heure</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <i className="fas fa-calendar-check text-sky-500"></i>
              <div className="flex-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Restitution</label>
                <span className="font-semibold text-slate-400">Date & heure</span>
              </div>
            </div>
            
            <button 
              onClick={() => router.push('/cars')}
              className="btn-primary-modern flex items-center justify-center gap-2"
            >
              <i className="fas fa-search"></i>
              Rechercher
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
