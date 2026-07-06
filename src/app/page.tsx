'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useTranslations } from 'next-intl';
import { useCurrency } from '@/contexts/CurrencyContext';

// ============================================
// DONNÉES HÔTELS FILTRABLES
// ============================================

interface FilterableHotel {
  id: string;
  name: string;
  city: string;
  country: string;
  region: 'france' | 'mediterranean' | 'europe' | 'international';
  price: number;
  rating: number;
  image: string;
  amenities: string[];
  category: string;
}

const FILTERABLE_HOTELS: FilterableHotel[] = [
  {
    id: 'f1', name: 'Le Bristol Paris', city: 'Paris', country: 'France', region: 'france',
    price: 850, rating: 9.7, category: 'Palace',
    image: 'https://images.unsplash.com/photo-1606402179428-a57976d71fa4?auto=format&fit=crop&q=80&w=800',
    amenities: ['Spa', 'Piscine', 'Restaurant étoilé', 'Concierge']
  },
  {
    id: 'f2', name: 'Hôtel du Cap-Eden-Roc', city: 'Antibes', country: 'France', region: 'france',
    price: 1200, rating: 9.9, category: 'Luxe',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=800',
    amenities: ['Plage privée', 'Piscine', 'Tennis', 'Spa']
  },
  {
    id: 'f3', name: 'Belmond Hotel Caruso', city: 'Ravello', country: 'Italie', region: 'mediterranean',
    price: 720, rating: 9.6, category: 'Romantique',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800',
    amenities: ['Vue mer', 'Piscine à débordement', 'Jardin', 'Restaurant']
  },
  {
    id: 'f4', name: 'Mystique Santorini', city: 'Santorin', country: 'Grèce', region: 'mediterranean',
    price: 580, rating: 9.5, category: 'Boutique',
    image: 'https://images.unsplash.com/photo-1570213489059-0aac6626cade?auto=format&fit=crop&q=80&w=800',
    amenities: ['Vue caldera', 'Piscine', 'Spa', 'Restaurant']
  },
  {
    id: 'f5', name: 'The Ritz London', city: 'Londres', country: 'Royaume-Uni', region: 'europe',
    price: 690, rating: 9.4, category: 'Palace',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800',
    amenities: ['Restaurant étoilé', 'Spa', 'Bar', 'Concierge']
  },
  {
    id: 'f6', name: 'Hotel Kämp', city: 'Helsinki', country: 'Finlande', region: 'europe',
    price: 320, rating: 9.2, category: 'Design',
    image: 'https://images.unsplash.com/photo-1551882547-ff43c61f3c33?auto=format&fit=crop&q=80&w=800',
    amenities: ['Spa', 'Restaurant', 'Bar', 'Fitness']
  },
  {
    id: 'f7', name: 'Aman Tokyo', city: 'Tokyo', country: 'Japon', region: 'international',
    price: 950, rating: 9.8, category: 'Ultra-Luxe',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800',
    amenities: ['Spa', 'Piscine', 'Restaurant', 'Vue panoramique']
  },
  {
    id: 'f8', name: 'Four Seasons Bali', city: 'Bali', country: 'Indonésie', region: 'international',
    price: 480, rating: 9.6, category: 'Resort',
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=800',
    amenities: ['Plage', 'Spa', 'Yoga', 'Restaurant']
  },
];

const FEATURED_HOTELS = [
  {
    id: '1', name: 'Villa Roches Rouges', location: 'Saint-Raphaël, France', price: 320, rating: 9.5,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800',
    description: 'Icône du design face à la mer, entre pins et roches rouges.',
    tags: ['Bord de mer', 'Design'], badge: { text: 'Coup de cœur', color: 'bg-rose-500' }
  },
  {
    id: '2', name: 'Amanzoe Resort', location: 'Porto Heli, Grèce', price: 890, rating: 9.8,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800',
    description: 'Sanctuaire grec avec vues à 360° sur le Péloponnèse.',
    tags: ['Ultra-Luxe', 'Piscine privée'], badge: { text: 'Exclusif', color: 'bg-amber-500' }
  },
  {
    id: '3', name: 'Castello di Reschio', location: 'Ombrie, Italie', price: 650, rating: 9.7,
    image: 'https://images.unsplash.com/photo-1551882547-ff43c61f3c33?auto=format&fit=crop&q=80&w=800',
    description: 'Château millénaire restauré dans les collines toscanes.',
    tags: ['Historique', 'Nature'], badge: { text: 'Patrimoine', color: 'bg-emerald-500' }
  },
  {
    id: '4', name: 'Mandarin Oriental', location: 'Paris, France', price: 780, rating: 9.6,
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800',
    description: 'Élégance parisienne au cœur de la Rue Saint-Honoré.',
    tags: ['Palace', 'Spa'], badge: { text: 'Palace', color: 'bg-sky-500' }
  },
  {
    id: '5', name: 'Aman Tokyo', location: 'Tokyo, Japon', price: 950, rating: 9.9,
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800',
    description: 'Minimalisme japonais au sommet de la ville.',
    tags: ['Design', 'Vue panoramique'], badge: { text: 'Top 10 Mondial', color: 'bg-violet-500' }
  },
  {
    id: '6', name: 'Les Roches Blanches', location: 'Cassis, France', price: 420, rating: 9.4,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800',
    description: 'Art déco surplombant les calanques de Cassis.',
    tags: ['Vue mer', 'Restaurant étoilé'], badge: { text: 'Éco-label', color: 'bg-teal-500' }
  },
];

const DESTINATIONS = [
  { name: 'Santorin', country: 'Grèce', price: 690, image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=800' },
  { name: 'Venise', country: 'Italie', price: 520, image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&q=80&w=800' },
  { name: 'Kyoto', country: 'Japon', price: 1450, image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800' },
];

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export default function Home() {
  const t = useTranslations();
  const { formatPrice } = useCurrency();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'hotels' | 'flights' | 'cars'>('hotels');

  // États recherche
  const [city, setCity] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showTravelers, setShowTravelers] = useState(false);
  const [travelers, setTravelers] = useState({ adults: 2, children: 0, rooms: 1 });

  // États pour le filtre dynamique
  const [hotels] = useState<FilterableHotel[]>(FILTERABLE_HOTELS);
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1500]);
  const [isLoading] = useState(false);

  // Filtrage des hôtels
  const filteredHotels = hotels.filter(hotel => {
    const matchesRegion = selectedRegion === 'all' || hotel.region === selectedRegion;
    const matchesSearch = hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          hotel.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          hotel.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = hotel.price >= priceRange[0] && hotel.price <= priceRange[1];
    return matchesRegion && matchesSearch && matchesPrice;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedCity = city.trim();
    if (!trimmedCity) {
      return;
    }

    const params = new URLSearchParams({
      city: trimmedCity,
      adults: String(travelers.adults),
      children: String(travelers.children),
      rooms: String(travelers.rooms),
    });

    if (startDate) {
      params.set('checkin', dateToIsoDate(startDate));
    }

    if (endDate) {
      params.set('checkout', dateToIsoDate(endDate));
    }

    const path =
      activeTab === 'flights' ? '/flights' :
      activeTab === 'cars' ? '/cars' :
      '/hotels';

    router.push(`${path}?${params.toString()}`);
  };

  const updateTravelers = (type: 'adults' | 'children' | 'rooms', delta: number) => {
    setTravelers(prev => ({
      ...prev,
      [type]: Math.max(type === 'children' ? 0 : 1, prev[type] + delta)
    }));
  };

  // Données traduites
  const CATEGORIES = [
    { icon: 'fa-umbrella-beach', title: t('categories.beach'), description: t('categories.beachDesc'), color: 'from-orange-400 to-orange-600' },
    { icon: 'fa-mountain-sun', title: t('categories.adventure'), description: t('categories.adventureDesc'), color: 'from-sky-400 to-sky-600' },
    { icon: 'fa-city', title: t('categories.city'), description: t('categories.cityDesc'), color: 'from-emerald-400 to-emerald-600' },
    { icon: 'fa-spa', title: t('categories.wellness'), description: t('categories.wellnessDesc'), color: 'from-purple-400 to-purple-600' },
  ];

  const INSPIRATIONS = [
    { icon: 'fa-wine-glass', title: t('inspirations.gastronomy'), description: t('inspirations.gastronomyDesc') },
    { icon: 'fa-sailboat', title: t('inspirations.cruises'), description: t('inspirations.cruisesDesc') },
    { icon: 'fa-leaf', title: t('inspirations.ecoLuxe'), description: t('inspirations.ecoLuxeDesc') },
    { icon: 'fa-gem', title: t('inspirations.heritage'), description: t('inspirations.heritageDesc') },
  ];

  const REGION_FILTERS = [
    { id: 'all', label: t('explore.all'), icon: 'fa-globe' },
    { id: 'france', label: t('explore.france'), icon: 'fa-flag' },
    { id: 'mediterranean', label: t('explore.mediterranean'), icon: 'fa-sun' },
    { id: 'europe', label: t('explore.europe'), icon: 'fa-earth-europe' },
    { id: 'international', label: t('explore.international'), icon: 'fa-plane' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ============================================ */}
      {/* HERO SECTION */}
      {/* ============================================ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=2000"
            alt="Paradise beach"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-b from-slate-900/60 via-slate-900/40 to-slate-900/80"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full py-12 sm:py-20">
          <div className="max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-6 sm:mb-8">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              <span className="text-white/90 text-sm font-semibold">{t('hero.badge')}</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-4 sm:mb-6 leading-tight">
              {t('hero.title')}<br/>
              <span className="text-transparent bg-clip-text bg-linear-to-r from-sky-400 to-cyan-300">
                {t('hero.titleHighlight')}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-white/80 mb-8 sm:mb-12 max-w-2xl leading-relaxed">
              {t('hero.subtitle')}
            </p>
          </div>

          {/* Search Box */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl shadow-black/20 w-full">
            {/* Tabs */}
            <div className="flex gap-1 sm:gap-2 mb-4 sm:mb-6 bg-slate-100 rounded-xl p-1">
              {[
                { id: 'hotels', icon: 'fa-hotel', label: t('tabs.hotels') },
                { id: 'flights', icon: 'fa-plane', label: t('tabs.flights') },
                { id: 'cars', icon: 'fa-car', label: t('tabs.cars') },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'hotels' | 'flights' | 'cars')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 sm:py-3 rounded-lg font-bold text-sm transition-all ${
                    activeTab === tab.id
                      ? 'bg-white text-sky-600 shadow-md'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <i className={`fa-solid ${tab.icon}`}></i>
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearch}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {/* Destination */}
                <div className="sm:col-span-2 lg:col-span-1">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    {t('hero.where')}
                  </label>
                  <div className="relative">
                    <i className="fa-solid fa-location-dot absolute left-4 top-1/2 -translate-y-1/2 text-sky-500"></i>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder={t('hero.searchPlaceholder')}
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-2 border-transparent rounded-xl font-semibold text-slate-800 placeholder:text-slate-400 focus:border-sky-500 focus:bg-white outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Dates */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    {t('hero.arrival')}
                  </label>
                  <div className="relative">
                    <i className="fa-solid fa-calendar absolute left-4 top-1/2 -translate-y-1/2 text-sky-500"></i>
                    <DatePicker
                      selected={startDate}
                      onChange={(date: Date | null) => setStartDate(date)}
                      placeholderText={t('hero.arrival')}
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-2 border-transparent rounded-xl font-semibold text-slate-800 placeholder:text-slate-400 focus:border-sky-500 focus:bg-white outline-none transition-all"
                      dateFormat="dd MMM yyyy"
                    />
                  </div>
                </div>

                {/* Departure */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    {t('hero.departure')}
                  </label>
                  <div className="relative">
                    <i className="fa-solid fa-calendar-check absolute left-4 top-1/2 -translate-y-1/2 text-sky-500"></i>
                    <DatePicker
                      selected={endDate}
                      onChange={(date: Date | null) => setEndDate(date)}
                      placeholderText={t('hero.departure')}
                      minDate={startDate || undefined}
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-2 border-transparent rounded-xl font-semibold text-slate-800 placeholder:text-slate-400 focus:border-sky-500 focus:bg-white outline-none transition-all"
                      dateFormat="dd MMM yyyy"
                    />
                  </div>
                </div>

                {/* Travelers */}
                <div className="relative">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    {t('hero.travelers')}
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowTravelers(!showTravelers)}
                    className="w-full flex items-center gap-3 pl-11 pr-4 py-3.5 bg-slate-50 border-2 border-transparent rounded-xl font-semibold text-slate-800 hover:border-sky-500 hover:bg-white transition-all text-left"
                  >
                    <i className="fa-solid fa-user absolute left-4 text-sky-500"></i>
                    <span>{travelers.adults + travelers.children} {t('hero.travelers').toLowerCase()}</span>
                    <i className={`fa-solid fa-chevron-down ml-auto transition-transform ${showTravelers ? 'rotate-180' : ''}`}></i>
                  </button>

                  {/* Dropdown */}
                  {showTravelers && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 p-4 z-50">
                      {[
                        { label: 'Adultes', key: 'adults' as const, min: 1 },
                        { label: 'Enfants', key: 'children' as const, min: 0 },
                        { label: 'Chambres', key: 'rooms' as const, min: 1 },
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                          <span className="font-semibold text-slate-700">{item.label}</span>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => updateTravelers(item.key, -1)}
                              disabled={travelers[item.key] <= item.min}
                              className="w-8 h-8 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-600 hover:border-sky-500 hover:text-sky-500 disabled:opacity-40 transition-colors"
                            >
                              <i className="fa-solid fa-minus text-xs"></i>
                            </button>
                            <span className="w-6 text-center font-bold">{travelers[item.key]}</span>
                            <button
                              type="button"
                              onClick={() => updateTravelers(item.key, 1)}
                              className="w-8 h-8 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-600 hover:border-sky-500 hover:text-sky-500 transition-colors"
                            >
                              <i className="fa-solid fa-plus text-xs"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className="w-full mt-4 sm:mt-6 bg-linear-to-r from-sky-500 to-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-sky-500/30 hover:shadow-xl hover:shadow-sky-500/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-search"></i>
                {t('hero.search')}
              </button>
            </form>
          </div>

          {/* Stats */}
          <div className="hidden lg:flex items-center gap-8 mt-12">
            {[
              { value: '450+', label: t('stats.hotels') },
              { value: '50k+', label: t('stats.clients') },
              { value: '24/7', label: t('stats.support') },
            ].map((stat, i) => (
              <div key={i} className="text-white">
                <div className="text-3xl font-black">{stat.value}</div>
                <div className="text-white/60 text-sm font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* CATEGORIES SECTION */}
      {/* ============================================ */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-800 mb-4">
              {t('categories.title')}
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              {t('categories.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {CATEGORIES.map((cat, i) => (
              <div
                key={i}
                className="group relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border-2 border-slate-100 hover:border-transparent hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300 cursor-pointer hover:-translate-y-2"
              >
                <div className={`w-14 h-14 sm:w-16 sm:h-16 bg-linear-to-br ${cat.color} rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  <i className={`fa-solid ${cat.icon} text-white text-xl sm:text-2xl`}></i>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">{cat.title}</h3>
                <p className="text-slate-500 text-sm">{cat.description}</p>
                <i className="fa-solid fa-arrow-right absolute bottom-6 right-6 text-slate-300 group-hover:text-sky-500 group-hover:translate-x-1 transition-all"></i>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* INSPIRATIONS SECTION */}
      {/* ============================================ */}
      <section className="py-16 sm:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 sm:mb-16 gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-800 mb-3">
                {t('inspirations.title')}
              </h2>
              <p className="text-slate-500 text-lg">{t('inspirations.subtitle')}</p>
            </div>
            <a href="#" className="text-sky-500 font-bold hover:text-sky-600 transition-colors flex items-center gap-2" style={{textDecoration: 'none'}}>
              {t('common.viewAll')} <i className="fa-solid fa-arrow-right"></i>
            </a>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {INSPIRATIONS.map((item, i) => (
              <div
                key={i}
                className="group bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 cursor-pointer border border-slate-100"
              >
                <i className={`fa-solid ${item.icon} text-3xl sm:text-4xl text-sky-500 mb-4 sm:mb-6 block group-hover:scale-110 transition-transform`}></i>
                <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* DYNAMIC FILTER SECTION - Explorez nos hôtels */}
      {/* ============================================ */}
      <section className="py-16 sm:py-24 bg-linear-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="text-center mb-10 sm:mb-14">
            <span className="inline-block bg-linear-to-r from-sky-500 to-blue-600 text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-4 shadow-lg shadow-sky-500/25">
              <i className="fa-solid fa-fire mr-2"></i>{t('explore.badge')}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-800 mb-4">
              {t('explore.title')}
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              {t('explore.subtitle')}
            </p>
          </div>

          {/* Filter Bar */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl shadow-slate-200/50 border border-slate-100 mb-10">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Region Filters */}
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                {REGION_FILTERS.map((region) => (
                  <button
                    key={region.id}
                    onClick={() => setSelectedRegion(region.id)}
                    className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                      selectedRegion === region.id
                        ? 'bg-linear-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/30'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <i className={`fa-solid ${region.icon} text-xs`}></i>
                    <span className="hidden sm:inline">{region.label}</span>
                    <span className="sm:hidden">{region.label.split(' ')[0]}</span>
                  </button>
                ))}
              </div>

              {/* Search Input */}
              <div className="relative w-full lg:w-80">
                <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('explore.searchPlaceholder')}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl font-medium text-slate-800 placeholder:text-slate-400 focus:border-sky-500 focus:bg-white outline-none transition-all"
                />
              </div>
            </div>

            {/* Price Range */}
            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <span className="text-sm font-semibold text-slate-600">
                  <i className="fa-solid fa-euro-sign mr-2 text-sky-500"></i>
                  {t('explore.budget')}
                </span>
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-sm font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-lg">{formatPrice(priceRange[0])}</span>
                  <input
                    type="range"
                    min="0"
                    max="1500"
                    step="50"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-500"
                  />
                  <span className="text-sm font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-lg">{formatPrice(priceRange[1])}</span>
                </div>
                <span className="text-sm text-slate-500">
                  {filteredHotels.length} {t('explore.hotelsFound')}
                </span>
              </div>
            </div>
          </div>

          {/* Hotels Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredHotels.length === 0 ? (
            <div className="text-center py-20">
              <i className="fa-solid fa-search text-6xl text-slate-300 mb-6"></i>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">{t('explore.noResults')}</h3>
              <p className="text-slate-500">{t('explore.noResultsDesc')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {filteredHotels.map((hotel) => (
                <div
                  key={hotel.id}
                  onClick={() => router.push(`/hotels/${hotel.id}`)}
                  className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-2xl hover:shadow-slate-300/50 transition-all duration-500 hover:-translate-y-2 cursor-pointer"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={hotel.image}
                      alt={hotel.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {/* Rating */}
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-lg">
                      <i className="fa-solid fa-star text-amber-400 text-xs"></i>
                      <span className="font-bold text-slate-800 text-sm">{hotel.rating}</span>
                    </div>
                    {/* Category Badge */}
                    <div className="absolute top-3 right-3 bg-linear-to-r from-slate-800 to-slate-900 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-lg">
                      {hotel.category}
                    </div>
                    {/* Price Tag */}
                    <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl shadow-lg">
                      <span className="text-lg font-black text-slate-800">{formatPrice(hotel.price)}</span>
                      <span className="text-slate-500 text-xs font-medium">{t('common.perNight')}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    {/* Location */}
                    <div className="flex items-center gap-1.5 text-sky-500 text-xs font-semibold mb-2">
                      <i className="fa-solid fa-location-dot"></i>
                      <span>{hotel.city}, {hotel.country}</span>
                    </div>

                    {/* Name */}
                    <h3 className="text-base font-bold text-slate-800 mb-3 group-hover:text-sky-600 transition-colors line-clamp-1">
                      {hotel.name}
                    </h3>

                    {/* Amenities */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {hotel.amenities.slice(0, 3).map((amenity, i) => (
                        <span
                          key={i}
                          className="bg-slate-100 text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        >
                          {amenity}
                        </span>
                      ))}
                      {hotel.amenities.length > 3 && (
                        <span className="bg-sky-100 text-sky-600 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                          +{hotel.amenities.length - 3}
                        </span>
                      )}
                    </div>

                    {/* CTA */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <i
                            key={i}
                            className={`fa-solid fa-star text-xs ${
                              i < Math.floor(hotel.rating / 2) ? 'text-amber-400' : 'text-slate-200'
                            }`}
                          ></i>
                        ))}
                      </div>
                      <span className="text-sky-500 font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                        {t('common.see')} <i className="fa-solid fa-arrow-right text-xs"></i>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* View All Button */}
          <div className="text-center mt-10">
            <Link
              href="/hotels"
              className="inline-flex items-center gap-2 bg-white text-slate-800 px-8 py-4 rounded-full font-bold border-2 border-slate-200 hover:border-sky-500 hover:text-sky-600 transition-all shadow-lg hover:shadow-xl"
            >
              <i className="fa-solid fa-th-large"></i>
              {t('common.seeAll')}
              <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* FEATURED HOTELS SECTION */}
      {/* ============================================ */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 sm:mb-16 gap-4">
            <div>
              <span className="inline-block bg-sky-100 text-sky-600 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
                {t('featured.badge')}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-800 mb-3">
                {t('featured.title')}
              </h2>
              <p className="text-slate-500 text-lg">{t('featured.subtitle')}</p>
            </div>
            <Link
              href="/hotels"
              className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-full font-bold hover:bg-sky-600 transition-colors"
            >
              {t('common.seeAll')} <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {FEATURED_HOTELS.map((hotel) => (
              <div
                key={hotel.id}
                className="group bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 hover:-translate-y-2"
              >
                {/* Image */}
                <div className="relative h-56 sm:h-64 overflow-hidden">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {/* Badge */}
                  <div className={`absolute top-4 left-4 ${hotel.badge.color} text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg`}>
                    {hotel.badge.text}
                  </div>
                  {/* Rating */}
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                    <i className="fa-solid fa-star text-amber-400 text-sm"></i>
                    <span className="font-bold text-slate-800">{hotel.rating}</span>
                  </div>
                  {/* Favorite */}
                  <button className="absolute bottom-4 right-4 w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors shadow-lg">
                    <i className="fa-regular fa-heart"></i>
                  </button>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6">
                  <div className="flex items-center gap-2 text-sky-500 text-xs font-bold uppercase tracking-wider mb-2">
                    <i className="fa-solid fa-location-dot"></i>
                    <span>{hotel.location}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-sky-600 transition-colors">
                    {hotel.name}
                  </h3>
                  <p className="text-slate-500 text-sm mb-4 line-clamp-2">{hotel.description}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {hotel.tags.map((tag, i) => (
                      <span key={i} className="bg-slate-100 text-slate-600 text-xs font-semibold px-2.5 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div>
                      <span className="text-2xl font-black text-slate-800">{formatPrice(hotel.price)}</span>
                      <span className="text-slate-400 text-sm font-medium"> {t('common.perNight')}</span>
                    </div>
                    <Link
                      href={`/hotels/${hotel.id}`}
                      className="text-sky-500 font-bold flex items-center gap-2 hover:gap-3 transition-all"
                    >
                      Voir l&apos;offre <i className="fa-solid fa-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* DESTINATIONS SECTION */}
      {/* ============================================ */}
      <section id="destinations" className="py-16 sm:py-24 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              {t('destinations.title')}
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              {t('destinations.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {DESTINATIONS.map((dest, i) => (
              <div
                key={i}
                onClick={() => router.push(`/hotels?city=${dest.name}`)}
                className="group relative h-80 sm:h-96 rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer"
              >
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                  <h3 className="text-2xl sm:text-3xl font-black text-white mb-1">
                    {dest.name}
                  </h3>
                  <p className="text-white/70 font-medium mb-4">{dest.country}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold">
                      {t('common.from')} <span className="text-sky-400">{formatPrice(dest.price)}</span>
                    </span>
                    <span className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white group-hover:bg-sky-500 transition-colors">
                      <i className="fa-solid fa-arrow-right"></i>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* NEWSLETTER SECTION */}
      {/* ============================================ */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-linear-to-br from-sky-500 to-blue-600 rounded-3xl sm:rounded-[40px] p-8 sm:p-12 md:p-16 text-center relative overflow-hidden">
            {/* Decorations */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 sm:mb-6">
                {t('newsletter.title')}
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
                {t('newsletter.subtitle')}
              </p>
              <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                <input
                  type="email"
                  placeholder={t('newsletter.placeholder')}
                  className="flex-1 px-6 py-4 rounded-xl sm:rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder:text-white/60 font-semibold focus:bg-white/30 outline-none transition-colors"
                />
                <button
                  type="submit"
                  className="px-8 py-4 bg-white text-sky-600 rounded-xl sm:rounded-full font-bold hover:bg-slate-100 transition-colors shadow-lg"
                >
                  {t('newsletter.button')}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

function dateToIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
