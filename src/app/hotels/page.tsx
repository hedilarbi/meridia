'use client';
import { useSearchParams } from 'next/navigation';
import { type FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import HotelCard from '../components/HotelCard';
import {
  HOTEL_SEARCH_CACHE_STORAGE_KEY,
  type HotelSearchContext,
  type HotelSummary,
  type HotelsApiPayload,
  type StoredHotelSearch,
} from '@/types/hotels';

const HOTEL_PAGE_SIZE = 20;

interface TravelersState {
  adults: number;
  children: number;
  rooms: number;
}

export default function HotelsResultsPage() {
  const searchParams = useSearchParams();
  const initialCity = searchParams.get('city') ?? searchParams.get('q') ?? '';
  const initialCheckin = searchParams.get('checkin') ?? searchParams.get('start') ?? '';
  const initialCheckout = searchParams.get('checkout') ?? searchParams.get('end') ?? '';
  const initialHasCompleteSearch = Boolean(initialCity && initialCheckin && initialCheckout);
  const initialTravelers = {
    adults: parsePositiveIntegerParam(searchParams.get('adults'), 2, 1, 12),
    children: parsePositiveIntegerParam(searchParams.get('children'), 0, 0, 12),
    rooms: parsePositiveIntegerParam(searchParams.get('rooms'), 1, 1, 12),
  };
  
  // ÉTATS DES PARAMÈTRES DE RECHERCHE
  const [city, setCity] = useState(initialCity);
  const [checkin, setCheckin] = useState(initialCheckin);
  const [checkout, setCheckout] = useState(initialCheckout);
  const [showTravelers, setShowTravelers] = useState(false);
  const [travelers, setTravelers] = useState(initialTravelers);
  
  // ÉTATS D'INTERFACE
  const [hotels, setHotels] = useState<HotelSummary[]>([]);
  const [loading, setLoading] = useState(initialHasCompleteSearch);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(initialHasCompleteSearch);
  const [sortBy, setSortBy] = useState('recommended');
  const [isEditMode, setIsEditMode] = useState(false);
  const [shouldRunInitialSearch, setShouldRunInitialSearch] = useState(initialHasCompleteSearch);
  const [activeSearchContext, setActiveSearchContext] = useState<HotelSearchContext | null>(
    initialHasCompleteSearch
      ? createSearchContext(initialCity, initialCheckin, initialCheckout, initialTravelers, 0, HOTEL_PAGE_SIZE)
      : null,
  );
  const [pageIndex, setPageIndex] = useState(0);
  const [loadedPageSize, setLoadedPageSize] = useState(HOTEL_PAGE_SIZE);
  const [totalAvailableResults, setTotalAvailableResults] = useState<number | null>(null);
  const [totalResults, setTotalResults] = useState<number | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  // ÉTATS DE FILTRAGE FONCTIONNELS
  const [searchName, setSearchName] = useState('');
  const [maxPrice, setMaxPrice] = useState(9999);
  const [minRating, setMinRating] = useState('any');
  const [selectedStars, setSelectedStars] = useState<number[]>([]);
  const [selectedMeals, setSelectedMeals] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedRoomEquip, setSelectedRoomEquip] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('bootstrap/dist/js/bootstrap.bundle.min.js');
    }
  }, []);

  useEffect(() => {
    if (!activeSearchContext || hotels.length === 0) {
      return;
    }

    persistHotelSearch(hotels, activeSearchContext);
  }, [activeSearchContext, hotels]);

  // Fonction utilitaire pour basculer les filtres tableaux
  const toggleFilter = <T,>(value: T, state: T[], setState: (next: T[]) => void) => {
    setState(state.includes(value) ? state.filter(i => i !== value) : [...state, value]);
  };

  // Réinitialisation
  const resetFilters = useCallback(() => {
    setSearchName('');
    setMaxPrice(9999);
    setMinRating('any');
    setSelectedStars([]);
    setSelectedMeals([]);
    setSelectedServices([]);
    setSelectedRoomEquip([]);
  }, []);

  const fetchHotelsData = useCallback(async (
    requestedPageIndex = 0,
    appendResults = false,
  ) => {
    const trimmedCity = city.trim();

    if (!trimmedCity) {
      setError('La ville ou destination est obligatoire.');
      setIsEditMode(true);
      return;
    }

    if (!checkin || !checkout) {
      setError('Les dates check-in et check-out sont obligatoires.');
      setIsEditMode(true);
      return;
    }

    if (checkout <= checkin) {
      setError('La date check-out doit être après la date check-in.');
      setIsEditMode(true);
      return;
    }

    setError('');
    if (appendResults) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    setHasSearched(true);
    setIsEditMode(false);
    setShowTravelers(false);

    if (!appendResults) {
      resetFilters();
      setPageIndex(0);
      setTotalResults(null);
      setTotalAvailableResults(null);
    }

    try {
      const params = new URLSearchParams({
        city: trimmedCity,
        checkin,
        checkout,
        adults: String(travelers.adults),
        currencyCode: 'EUR',
        languageCode: 'fr',
        pageIndex: String(requestedPageIndex),
        pageSize: String(HOTEL_PAGE_SIZE),
      });

      const res = await fetch(`/api/hotels?${params.toString()}`);
      const data: unknown = await res.json();

      if (!res.ok) {
        throw new Error(getApiErrorMessage(data) ?? 'Impossible de récupérer les hôtels.');
      }
      
      const payload = normalizeHotelsPayload(data, requestedPageIndex, HOTEL_PAGE_SIZE);

      // On normalise les champs optionnels pour garder le filtrage stable.
      const enrichedData: HotelSummary[] = payload.hotels.map(h => ({
        ...h,
        stars: h.stars ?? 0,
        meals: h.meals ?? [],
        services: h.services ?? [],
        roomEquip: h.roomEquip ?? [],
        searchPageIndex: payload.pageIndex,
      }));

      setHotels((currentHotels) =>
        appendResults ? mergeHotelResults(currentHotels, enrichedData) : enrichedData,
      );
      setPageIndex(payload.pageIndex);
      setLoadedPageSize(payload.pageSize);
      setTotalResults(payload.totalResults ?? null);
      setTotalAvailableResults(payload.totalAvailableResults ?? payload.totalResults ?? null);
      setActiveSearchContext(
        createSearchContext(trimmedCity, checkin, checkout, travelers, payload.pageIndex, payload.pageSize),
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur API inconnue.';
      if (!appendResults) {
        setHotels([]);
      }
      setError(message);
      console.error('Erreur API:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [checkin, checkout, city, resetFilters, travelers]);

  useEffect(() => {
    if (!shouldRunInitialSearch) return;
    setShouldRunInitialSearch(false);
    void fetchHotelsData();
  }, [fetchHotelsData, shouldRunInitialSearch]);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void fetchHotelsData();
  };

  const handleLoadMore = () => {
    void fetchHotelsData(pageIndex + 1, true);
  };

  const cityLabel = city.trim() || 'Destination';
  const checkinLabel = checkin ? formatIsoDate(checkin) : 'Check-in';
  const checkoutLabel = checkout ? formatIsoDate(checkout) : 'Check-out';
  const travelersCount = travelers.adults + travelers.children;
  const travelersLabel = `${travelersCount} voyageur${travelersCount > 1 ? 's' : ''}`;

  const updateTravelers = (type: 'adults' | 'children' | 'rooms', delta: number) => {
    const minValue = type === 'children' ? 0 : 1;

    setTravelers((currentTravelers) => ({
      ...currentTravelers,
      [type]: Math.max(minValue, currentTravelers[type] + delta),
    }));
  };

  // LOGIQUE DE FILTRAGE RÉELLE
  const filteredHotels = useMemo(() => {
    return hotels.filter(h => {
      const matchName = h.name.toLowerCase().includes(searchName.toLowerCase());
      const matchPrice = (h.price || 0) <= maxPrice;
      const matchRating = minRating === 'any' ? true : (h.rate || 0) >= parseFloat(minRating);
      const matchStars = selectedStars.length === 0 ? true : selectedStars.includes(h.stars ?? 0);
      const matchMeals = selectedMeals.length === 0 ? true : selectedMeals.some(m => (h.meals ?? []).includes(m));
      const matchServices = selectedServices.length === 0 ? true : selectedServices.every(s => (h.services ?? []).includes(s));
      const matchRoom = selectedRoomEquip.length === 0 ? true : selectedRoomEquip.every(re => (h.roomEquip ?? []).includes(re));

      return matchName && matchPrice && matchRating && matchStars && matchMeals && matchServices && matchRoom;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return (a.price || 0) - (b.price || 0);
      if (sortBy === 'rating_desc') return (b.rate || 0) - (a.rate || 0);
      return 0;
    });
  }, [hotels, sortBy, searchName, maxPrice, minRating, selectedStars, selectedMeals, selectedServices, selectedRoomEquip]);

  const hasMoreHotels =
    totalAvailableResults !== null
      ? hotels.length < totalAvailableResults
      : hotels.length > 0 && hotels.length >= (pageIndex + 1) * loadedPageSize;
  const totalKnownResults = totalAvailableResults ?? totalResults;
  const resultCountLabel = loading
    ? 'Recherche en cours'
    : totalKnownResults !== null
      ? `${filteredHotels.length} établissements affichés sur ${totalKnownResults}`
      : `${filteredHotels.length} établissements trouvés`;

  const renderSearchForm = () => (
    <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl shadow-black/20 w-full search-card mx-auto">
      <div className="flex gap-1 sm:gap-2 mb-4 sm:mb-6 bg-slate-100 rounded-xl p-1">
        <button
          type="button"
          className="flex-1 flex items-center justify-center gap-2 py-2.5 sm:py-3 rounded-lg font-bold text-sm transition-all bg-white text-sky-600 shadow-md"
        >
          <i className="fa-solid fa-hotel"></i>
          <span>Hôtels</span>
        </button>
      </div>

      <form onSubmit={handleSearch}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Où allez-vous ?
            </label>
            <div className="relative">
              <i className="fa-solid fa-location-dot absolute left-4 top-1/2 -translate-y-1/2 text-sky-500"></i>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Paris, Tokyo, Bali..."
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-2 border-transparent rounded-xl font-semibold text-slate-800 placeholder:text-slate-400 focus:border-sky-500 focus:bg-white outline-none transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Arrivée
            </label>
            <div className="relative">
              <i className="fa-solid fa-calendar absolute left-4 top-1/2 -translate-y-1/2 text-sky-500 z-10"></i>
              <DatePicker
                selected={isoDateToDate(checkin)}
                onChange={(date: Date | null) => {
                  const nextCheckin = dateToIsoDate(date);
                  setCheckin(nextCheckin);

                  if (checkout && nextCheckin && checkout <= nextCheckin) {
                    setCheckout('');
                  }
                }}
                placeholderText="Arrivée"
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-2 border-transparent rounded-xl font-semibold text-slate-800 placeholder:text-slate-400 focus:border-sky-500 focus:bg-white outline-none transition-all"
                dateFormat="dd MMM yyyy"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Départ
            </label>
            <div className="relative">
              <i className="fa-solid fa-calendar-check absolute left-4 top-1/2 -translate-y-1/2 text-sky-500 z-10"></i>
              <DatePicker
                selected={isoDateToDate(checkout)}
                onChange={(date: Date | null) => setCheckout(dateToIsoDate(date))}
                placeholderText="Départ"
                minDate={isoDateToDate(checkin) ?? undefined}
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-2 border-transparent rounded-xl font-semibold text-slate-800 placeholder:text-slate-400 focus:border-sky-500 focus:bg-white outline-none transition-all"
                dateFormat="dd MMM yyyy"
                required
              />
            </div>
          </div>

          <div className="relative">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Voyageurs
            </label>
            <button
              type="button"
              onClick={() => setShowTravelers((isOpen) => !isOpen)}
              className="w-full flex items-center gap-3 pl-11 pr-4 py-3.5 bg-slate-50 border-2 border-transparent rounded-xl font-semibold text-slate-800 hover:border-sky-500 hover:bg-white transition-all text-left"
            >
              <i className="fa-solid fa-user absolute left-4 text-sky-500"></i>
              <span>{travelersLabel}</span>
              <i className={`fa-solid fa-chevron-down ml-auto transition-transform ${showTravelers ? 'rotate-180' : ''}`}></i>
            </button>

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

        <button
          type="submit"
          className="w-full mt-4 sm:mt-6 bg-linear-to-r from-sky-500 to-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-sky-500/30 hover:shadow-xl hover:shadow-sky-500/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
          disabled={loading}
        >
          <i className="fa-solid fa-search"></i>
          {loading ? 'Recherche...' : 'Rechercher'}
        </button>
      </form>

      {error && (isEditMode || !hasSearched) && (
        <div className="alert alert-danger mt-3 mb-0 py-2 small">{error}</div>
      )}
    </div>
  );

  // COMPOSANT FILTRES
  const renderFilterContent = (isMobile = false) => (
    <div className={isMobile ? "" : "card border-0 shadow-sm p-3 rounded-4 bg-white"}>
      <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
        <h6 className="fw-bold mb-0">Filtrer par</h6>
        <button className="btn btn-link btn-sm p-0 text-decoration-none extra-small" onClick={resetFilters}>Tout effacer</button>
      </div>
      
      {/* NOM */}
      <div className="mb-4">
        <label className="small fw-bold mb-2">Rechercher un nom</label>
        <div className="input-group input-group-sm border rounded-2 bg-light">
          <span className="input-group-text bg-transparent border-0"><i className="bi bi-search text-muted"></i></span>
          <input type="text" className="form-control border-0 bg-transparent shadow-none" placeholder="ex: Marriott" value={searchName} onChange={(e) => setSearchName(e.target.value)} />
        </div>
      </div>

      {/* BUDGET */}
      <div className="mb-4 border-top pt-3">
        <p className="small fw-bold mb-2">Budget max : {maxPrice} €</p>
        <input type="range" className="form-range" min="0" max="5000" step="50" value={maxPrice} onChange={(e) => setMaxPrice(parseInt(e.target.value))} />
      </div>

      {/* ÉTOILES */}
      <div className="mb-4 border-top pt-3">
        <p className="small fw-bold mb-2">Nombre d&apos;étoiles</p>
        {[5, 4, 3, 2, 1].map(star => (
          <div className="form-check small mb-2" key={star}>
            <input className="form-check-input" type="checkbox" id={`s-${star}`} checked={selectedStars.includes(star)} onChange={() => toggleFilter(star, selectedStars, setSelectedStars)} />
            <label className="form-check-label text-muted" htmlFor={`s-${star}`}>
              {star} <i className="bi bi-star-fill text-warning extra-small"></i>
            </label>
          </div>
        ))}
      </div>

      {/* SERVICES */}
      <div className="mb-4 border-top pt-3">
        <p className="small fw-bold mb-2">Services hôtel</p>
        {['Piscine', 'Wi-Fi gratuit', 'Parking', 'Spa', 'Salle de sport'].map((s, idx) => (
          <div className="form-check small mb-2" key={idx}>
            <input className="form-check-input" type="checkbox" id={`srv-${idx}`} checked={selectedServices.includes(s)} onChange={() => toggleFilter(s, selectedServices, setSelectedServices)} />
            <label className="form-check-label text-muted" htmlFor={`srv-${idx}`}>{s}</label>
          </div>
        ))}
      </div>

      {/* CHAMBRE */}
      <div className="mb-4 border-top pt-3">
        <p className="small fw-bold mb-2">Dans la chambre</p>
        {['Climatisation', 'Baignoire', 'Cuisine', 'Vue sur mer'].map((re, idx) => (
          <div className="form-check small mb-2" key={idx}>
            <input className="form-check-input" type="checkbox" id={`rm-${idx}`} checked={selectedRoomEquip.includes(re)} onChange={() => toggleFilter(re, selectedRoomEquip, setSelectedRoomEquip)} />
            <label className="form-check-label text-muted" htmlFor={`rm-${idx}`}>{re}</label>
          </div>
        ))}
      </div>

      {/* NOTES */}
      <div className="mb-4 border-top pt-3">
        <p className="small fw-bold mb-2">Note voyageurs</p>
        {[{ id: 'any', label: "Toutes", val: 'any' }, { id: '45', label: '4,5+', val: '4.5' }, { id: '40', label: '4+', val: '4.0' }].map(r => (
          <div className="form-check small mb-1" key={r.id}>
            <input className="form-check-input" type="radio" name={isMobile ? "m-rate" : "p-rate"} id={isMobile ? `m-${r.id}` : r.id} checked={minRating === r.val} onChange={() => setMinRating(r.val)} />
            <label className="form-check-label text-muted" htmlFor={isMobile ? `m-${r.id}` : r.id}>{r.label}</label>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-light min-vh-100 text-dark">
      {hasSearched && (
        <div className="bg-white border-bottom py-3 shadow-sm hotels-search-sticky">
          <div className="container">
            {isEditMode ? renderSearchForm() : (
              <div className="d-flex align-items-center justify-content-between bg-light border rounded-pill px-3 py-2 shadow-sm">
                <div className="d-flex align-items-center gap-3 overflow-hidden grow">
                  <div className="text-truncate px-2 border-end border-secondary-subtle">
                    <i className="bi bi-geo-alt text-primary"></i> <strong className="ms-1">{cityLabel}</strong>
                  </div>
                  <div className="small fw-bold d-none d-md-block text-nowrap border-end pe-3 border-secondary-subtle">{checkinLabel}</div>
                  <div className="small fw-bold d-none d-lg-block text-nowrap">{checkoutLabel}</div>
                </div>
                <div className="d-flex gap-2 ms-2">
                  <button className="btn btn-outline-primary rounded-pill px-3 py-1 fw-bold btn-sm shadow-sm" onClick={() => setIsEditMode(true)}>Modifier</button>
                  {hotels.length > 0 && (
                    <button className="btn btn-primary rounded-pill px-3 py-1 fw-bold btn-sm shadow-sm d-lg-none" data-bs-toggle="offcanvas" data-bs-target="#offcanvasFilters">Filtres</button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {!hasSearched && (
        <div className="container py-5">
          {renderSearchForm()}
        </div>
      )}

      {hasSearched && (
      <div className="container py-4">
        <div className="row g-4">
          {hotels.length > 0 && (
          <aside className="col-lg-3 d-none d-lg-block">
            <div className="hotels-sidebar-sticky">
              <div className="card border-0 shadow-sm rounded-4 mb-3 overflow-hidden text-center p-4 bg-primary text-white" style={{ background: 'linear-gradient(45deg, #0d6efd, #0dcaf0)' }}>
                <i className="bi bi-map-fill fs-2 mb-2"></i>
                <button className="btn btn-light btn-sm fw-bold rounded-pill shadow-sm">Afficher sur la carte</button>
              </div>
              {renderFilterContent()}
            </div>
          </aside>
          )}

          <main className={hotels.length > 0 ? 'col-lg-9' : 'col-12'}>
            <div className="d-flex justify-content-between align-items-center mb-3 px-1">
              <span className="small text-muted fw-bold">
                {resultCountLabel}
              </span>
              {hotels.length > 0 && (
                <select className="form-select form-select-sm w-auto border shadow-sm rounded-pill px-3 fw-bold text-primary" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="recommended">Recommandés</option>
                  <option value="price_asc">Prix bas</option>
                  <option value="rating_desc">Mieux notés</option>
                </select>
              )}
            </div>

            {loading ? (
              <div className="text-center py-5"><div className="spinner-border text-primary"></div><p className="mt-3 text-muted">Chargement des hôtels...</p></div>
            ) : (
              <>
                {error ? (
                  <div className="text-center py-5">
                    <i className="bi bi-exclamation-triangle fs-1 text-warning mb-3 d-block"></i>
                    <h5 className="text-muted">Recherche impossible</h5>
                    <p className="text-muted small">{error}</p>
                    <button className="btn btn-outline-primary rounded-pill px-4 fw-bold" onClick={() => setIsEditMode(true)}>Modifier la recherche</button>
                  </div>
                ) : filteredHotels.length > 0 ? (
                  <div className="row g-4 pb-5">
                    {filteredHotels.map((hotel) => (
                      <div key={hotel.id} className="col-md-6 col-lg-4">
                        <HotelCard
                          hotel={hotel}
                          searchContext={
                            activeSearchContext
                              ? {
                                  ...activeSearchContext,
                                  pageIndex: hotel.searchPageIndex ?? activeSearchContext.pageIndex,
                                }
                              : undefined
                          }
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <i className="bi bi-search fs-1 text-muted mb-3 d-block"></i>
                    <h5 className="text-muted">Aucun hôtel ne correspond</h5>
                    <p className="text-muted small">Essayez de modifier vos filtres ou votre recherche</p>
                  </div>
                )}
                
                {hasMoreHotels && (
                  <div className="text-center mb-5">
                    <button 
                      className="btn btn-outline-primary rounded-pill px-5 py-3 fw-bold"
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                    >
                      {loadingMore ? 'Chargement...' : "Afficher plus d'établissements"}
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
      )}

      {hasSearched && hotels.length > 0 && (
      <div className="offcanvas offcanvas-bottom rounded-top-5" tabIndex={-1} id="offcanvasFilters" style={{ height: '85vh' }}>
        <div className="offcanvas-header border-bottom">
          <h5 className="offcanvas-title fw-bold">Filtres</h5>
          <button type="button" className="btn-close shadow-none" data-bs-dismiss="offcanvas"></button>
        </div>
        <div className="offcanvas-body bg-light">{renderFilterContent(true)}</div>
        <div className="p-3 border-top bg-white"><button className="btn btn-primary w-100 rounded-pill py-3 fw-bold" data-bs-dismiss="offcanvas">Voir les résultats</button></div>
      </div>
      )}

      <style jsx>{`
        .extra-small { font-size: 0.7rem; }
        .search-card { max-width: 980px; }
        .search-card :global(.react-datepicker-wrapper),
        .search-card :global(.react-datepicker__input-container) { width: 100%; }
        .hotels-search-sticky {
          position: sticky;
          top: 4rem;
          z-index: 45;
        }
        .hotels-sidebar-sticky {
          position: sticky;
          top: 11rem;
          z-index: 5;
        }
        @media (min-width: 640px) {
          .hotels-search-sticky { top: 5rem; }
          .hotels-sidebar-sticky { top: 12rem; }
        }
        .transition { transition: all 0.3s ease; }
        .hotel-card-hover:hover { transform: translateY(-5px); box-shadow: 0 15px 35px rgba(0,0,0,0.1) !important; }
        .rounded-top-5 { border-top-left-radius: 2.5rem !important; border-top-right-radius: 2.5rem !important; }
      `}</style>
    </div>
  );
}

function parsePositiveIntegerParam(
  value: string | null,
  defaultValue: number,
  min: number,
  max: number,
): number {
  const parsedValue = Number(value);

  return Number.isInteger(parsedValue) && parsedValue >= min && parsedValue <= max
    ? parsedValue
    : defaultValue;
}

function createSearchContext(
  city: string,
  checkin: string,
  checkout: string,
  travelers: TravelersState,
  pageIndex: number,
  pageSize: number,
): HotelSearchContext {
  return {
    city,
    checkin,
    checkout,
    adults: travelers.adults,
    children: travelers.children,
    rooms: travelers.rooms,
    currencyCode: 'EUR',
    languageCode: 'fr',
    pageIndex,
    pageSize,
  };
}

function persistHotelSearch(
  hotels: HotelSummary[],
  searchContext: HotelSearchContext,
): void {
  if (typeof window === 'undefined') {
    return;
  }

  const payload: StoredHotelSearch = {
    hotels,
    searchContext,
    storedAt: Date.now(),
  };

  try {
    sessionStorage.setItem(HOTEL_SEARCH_CACHE_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore storage quota/privacy errors; the detail page can still refetch.
  }
}

function mergeHotelResults(
  currentHotels: HotelSummary[],
  nextHotels: HotelSummary[],
): HotelSummary[] {
  const hotelsByKey = new Map<string, HotelSummary>();

  [...currentHotels, ...nextHotels].forEach((hotel) => {
    hotelsByKey.set(getHotelIdentity(hotel), hotel);
  });

  return Array.from(hotelsByKey.values());
}

function getHotelIdentity(hotel: HotelSummary): string {
  return hotel.kayakKey || String(hotel.id);
}

function normalizeHotelsPayload(
  payload: unknown,
  fallbackPageIndex: number,
  fallbackPageSize: number,
): HotelsApiPayload {
  if (Array.isArray(payload)) {
    return {
      hotels: payload as HotelSummary[],
      pageIndex: fallbackPageIndex,
      pageSize: fallbackPageSize,
    };
  }

  if (!payload || typeof payload !== 'object') {
    return {
      hotels: [],
      pageIndex: fallbackPageIndex,
      pageSize: fallbackPageSize,
    };
  }

  const response = payload as Partial<HotelsApiPayload>;

  return {
    hotels: Array.isArray(response.hotels) ? response.hotels : [],
    pageIndex: toInteger(response.pageIndex, fallbackPageIndex),
    pageSize: toInteger(response.pageSize, fallbackPageSize),
    totalResults: toOptionalNumber(response.totalResults),
    totalAvailableResults: toOptionalNumber(response.totalAvailableResults),
    isComplete: typeof response.isComplete === 'boolean' ? response.isComplete : undefined,
  };
}

function toInteger(value: unknown, fallbackValue: number): number {
  return typeof value === 'number' && Number.isInteger(value)
    ? value
    : fallbackValue;
}

function toOptionalNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value)
    ? value
    : undefined;
}

function getApiErrorMessage(payload: unknown): string | null {
  if (!payload || typeof payload !== 'object' || !('error' in payload)) {
    return null;
  }

  const error = (payload as { error?: unknown }).error;
  return typeof error === 'string' ? error : null;
}

function formatIsoDate(value: string): string {
  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function isoDateToDate(value: string): Date | null {
  if (!value) {
    return null;
  }

  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function dateToIsoDate(date: Date | null): string {
  if (!date) {
    return '';
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
