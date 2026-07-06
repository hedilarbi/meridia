'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface HeroProps {
  onSectionChange?: (section: string) => void;
}

export default function Hero({ onSectionChange }: HeroProps) {
  const router = useRouter();
  const [city, setCity] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showTravelers, setShowTravelers] = useState(false);
  const [travelers, setTravelers] = useState({ adults: 2, children: 0, rooms: 1 });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      const params = new URLSearchParams({
        city: city,
        adults: String(travelers.adults),
        children: String(travelers.children),
        rooms: String(travelers.rooms),
        ...(startDate && { start: startDate.toISOString().split('T')[0] }),
        ...(endDate && { end: endDate.toISOString().split('T')[0] }),
      });
      router.push(`/hotels?${params.toString()}`);
    }
  };

  const updateTravelers = (type: 'adults' | 'children' | 'rooms', delta: number) => {
    setTravelers(prev => ({
      ...prev,
      [type]: Math.max(type === 'children' ? 0 : 1, prev[type] + delta)
    }));
  };

  const travelersText = `${travelers.adults} adulte${travelers.adults > 1 ? 's' : ''}${travelers.children > 0 ? `, ${travelers.children} enfant${travelers.children > 1 ? 's' : ''}` : ''}, ${travelers.rooms} chambre${travelers.rooms > 1 ? 's' : ''}`;

  return (
    <section className="hero-section relative flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=2000" 
          alt="Destination de rêve" 
          className="w-full h-full object-cover hero-bg-animate"
        />
        <div className="absolute inset-0 hero-gradient"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full text-white pt-28 pb-20">
        <div className="max-w-4xl">
          {/* Badge */}
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-sky-500 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
              Nouvelle Saison
            </span>
            <span className="text-white/80 font-bold italic tracking-wide hidden sm:inline">
              Explorez les plus belles destinations
            </span>
          </div>

          {/* Title */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-black mb-8 leading-none tracking-tighter">
            L'art de <br/>
            <span className="text-sky-400">voyager.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-white/90 mb-12 max-w-2xl font-medium leading-relaxed">
            OfficielVacances vous ouvre les portes des lieux les plus confidentiels de France, d'Europe et d'Asie.
          </p>

          {/* Search Box */}
          <div className="search-bar-modern p-3 sm:p-4 max-w-4xl">
            <form onSubmit={handleSearch}>
              <div className="flex flex-col lg:flex-row gap-3">
                {/* Destination */}
                <div className="search-input-group flex-1 flex items-center gap-3 px-4 py-3 rounded-2xl border border-slate-100 hover:border-sky-200 transition-all">
                  <i className="fas fa-location-dot text-sky-500 text-lg"></i>
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Où allez-vous ?
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Saisissez une destination"
                      className="w-full text-slate-900 font-semibold placeholder:text-slate-400 text-sm"
                    />
                  </div>
                </div>

                {/* Dates */}
                <div className="search-input-group flex items-center gap-3 px-4 py-3 rounded-2xl border border-slate-100 hover:border-sky-200 transition-all lg:w-64">
                  <i className="fas fa-calendar text-sky-500 text-lg"></i>
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Dates
                    </label>
                    <div className="flex items-center gap-2">
                      <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        placeholderText="Arrivée"
                        className="w-20 text-slate-900 font-semibold placeholder:text-slate-400 text-sm bg-transparent"
                        dateFormat="dd MMM"
                      />
                      <span className="text-slate-300">—</span>
                      <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate}
                        placeholderText="Départ"
                        className="w-20 text-slate-900 font-semibold placeholder:text-slate-400 text-sm bg-transparent"
                        dateFormat="dd MMM"
                      />
                    </div>
                  </div>
                </div>

                {/* Travelers */}
                <div className="relative">
                  <div 
                    onClick={() => setShowTravelers(!showTravelers)}
                    className="search-input-group flex items-center gap-3 px-4 py-3 rounded-2xl border border-slate-100 hover:border-sky-200 transition-all cursor-pointer lg:w-56"
                  >
                    <i className="fas fa-user text-sky-500 text-lg"></i>
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Voyageurs
                      </label>
                      <span className="text-slate-900 font-semibold text-sm truncate block">
                        {travelersText}
                      </span>
                    </div>
                    <i className={`fas fa-chevron-down text-slate-400 transition-transform ${showTravelers ? 'rotate-180' : ''}`}></i>
                  </div>

                  {/* Travelers Dropdown */}
                  {showTravelers && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-large p-4 z-50 border border-slate-100">
                      {[
                        { label: 'Adultes', key: 'adults' as const, min: 1 },
                        { label: 'Enfants', key: 'children' as const, min: 0 },
                        { label: 'Chambres', key: 'rooms' as const, min: 1 },
                      ].map(item => (
                        <div key={item.key} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                          <span className="font-semibold text-slate-700">{item.label}</span>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => updateTravelers(item.key, -1)}
                              className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:border-sky-500 hover:text-sky-500 transition-colors disabled:opacity-50"
                              disabled={travelers[item.key] <= item.min}
                            >
                              <i className="fas fa-minus text-xs"></i>
                            </button>
                            <span className="w-8 text-center font-bold">{travelers[item.key]}</span>
                            <button
                              type="button"
                              onClick={() => updateTravelers(item.key, 1)}
                              className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:border-sky-500 hover:text-sky-500 transition-colors"
                            >
                              <i className="fas fa-plus text-xs"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => setShowTravelers(false)}
                        className="w-full mt-3 py-2 bg-sky-500 text-white rounded-xl font-bold hover:bg-sky-600 transition-colors"
                      >
                        Appliquer
                      </button>
                    </div>
                  )}
                </div>

                {/* Search Button */}
                <button
                  type="submit"
                  className="btn-primary-modern py-4 px-8 text-lg whitespace-nowrap"
                >
                  <i className="fas fa-search mr-2"></i>
                  Rechercher
                </button>
              </div>
            </form>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 mt-8">
            <button 
              onClick={() => onSectionChange?.('hotels')}
              className="bg-white text-slate-900 px-8 sm:px-12 py-4 sm:py-5 rounded-3xl font-black text-base sm:text-xl transition-all hover:bg-sky-500 hover:text-white shadow-2xl"
            >
              Explorer nos Hôtels
            </button>
            <button className="btn-outline-modern px-8 sm:px-12 py-4 sm:py-5 text-base sm:text-xl">
              Circuits Privés
            </button>
          </div>
        </div>
      </div>

      {/* Floating Stats */}
      <div className="floating-stats absolute bottom-8 sm:bottom-12 right-6 sm:right-12 hidden lg:flex gap-8 sm:gap-12 p-6 sm:p-8">
        <div className="text-white">
          <p className="text-3xl sm:text-4xl font-black">450+</p>
          <p className="text-white/60 font-bold uppercase text-xs tracking-widest">Hôtels Partenaires</p>
        </div>
        <div className="text-white">
          <p className="text-3xl sm:text-4xl font-black">24/7</p>
          <p className="text-white/60 font-bold uppercase text-xs tracking-widest">Conciergerie</p>
        </div>
      </div>
    </section>
  );
}
