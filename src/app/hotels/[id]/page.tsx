'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import HotelDetails from '../../components/HotelDetails';
import {
  HOTEL_SEARCH_CACHE_STORAGE_KEY,
  SELECTED_HOTEL_STORAGE_KEY,
  type HotelSearchContext,
  type HotelSummary,
  type HotelsApiPayload,
  type StoredHotelSearch,
  type StoredSelectedHotel,
} from '@/types/hotels';

interface SearchParamReader {
  get(name: string): string | null;
}

interface RecentHotel {
  id: string | number;
  name: string;
  imageUrl: string;
  city: string;
}

export default function HotelDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchKey = searchParams.toString();
  const hotelId = useMemo(() => decodeURIComponent(params.id ?? ''), [params.id]);
  const searchContext = useMemo(
    () => createSearchContextFromParams(new URLSearchParams(searchKey)),
    [searchKey],
  );

  const [hotel, setHotel] = useState<HotelSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isActive = true;
    const currentSearchParams = new URLSearchParams(searchKey);

    async function fetchHotelDetails() {
      setLoading(true);
      setError('');

      try {
        const kayakKey = currentSearchParams.get('kayakKey');
        let foundHotel =
          readSelectedHotel(hotelId, kayakKey) ??
          readCachedHotel(hotelId, kayakKey);

        if (!foundHotel && searchContext) {
          foundHotel = await fetchHotelFromSearch(hotelId, kayakKey, searchContext);
        }

        if (!isActive) {
          return;
        }

        if (!foundHotel) {
          setHotel(null);
          setError(
            searchContext
              ? "Cet hôtel n'a pas été retrouvé dans les résultats KAYAK de cette recherche."
              : 'Ouvrez une fiche depuis une recherche hôtel avec destination et dates.',
          );
          return;
        }

        setHotel(foundHotel);
        saveRecentHotel(foundHotel);
      } catch (loadError) {
        if (!isActive) {
          return;
        }

        setHotel(null);
        setError(
          loadError instanceof Error
            ? loadError.message
            : 'Impossible de récupérer cette fiche hôtel.',
        );
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    if (!hotelId) {
      setHotel(null);
      setError('Identifiant hôtel manquant.');
      setLoading(false);
    } else {
      void fetchHotelDetails();
    }

    return () => {
      isActive = false;
    };
  }, [hotelId, searchKey, searchContext]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="container py-5 text-center">
        <button
          type="button"
          className="btn btn-outline-secondary rounded-pill px-4 mb-4"
          onClick={() => router.back()}
        >
          Retour aux résultats
        </button>
        <h1 className="h4 fw-bold mb-2">Hôtel introuvable</h1>
        <p className="text-muted">{error}</p>
      </div>
    );
  }

  return (
    <HotelDetails
      hotel={hotel}
      checkin={searchContext?.checkin}
      checkout={searchContext?.checkout}
      currencyCode={searchContext?.currencyCode}
      languageCode={searchContext?.languageCode}
      onBack={() => router.back()}
    />
  );
}

function createSearchContextFromParams(
  searchParams: SearchParamReader,
): HotelSearchContext | null {
  const city = searchParams.get('city') ?? searchParams.get('q') ?? '';
  const checkin = searchParams.get('checkin') ?? searchParams.get('start') ?? '';
  const checkout = searchParams.get('checkout') ?? searchParams.get('end') ?? '';

  if (!city || !checkin || !checkout) {
    return null;
  }

  return {
    city,
    checkin,
    checkout,
    adults: parsePositiveInteger(searchParams.get('adults'), 2, 1, 12),
    children: parsePositiveInteger(searchParams.get('children'), 0, 0, 12),
    rooms: parsePositiveInteger(searchParams.get('rooms'), 1, 1, 12),
    currencyCode: searchParams.get('currencyCode') ?? 'EUR',
    languageCode: searchParams.get('languageCode') ?? 'fr',
    pageIndex: parsePositiveInteger(searchParams.get('pageIndex'), 0, 0, 1000),
    pageSize: parsePositiveInteger(searchParams.get('pageSize'), 20, 1, 50),
  };
}

async function fetchHotelFromSearch(
  hotelId: string,
  kayakKey: string | null,
  searchContext: HotelSearchContext,
): Promise<HotelSummary | null> {
  const params = new URLSearchParams({
    city: searchContext.city,
    checkin: searchContext.checkin,
    checkout: searchContext.checkout,
    adults: String(searchContext.adults),
    currencyCode: searchContext.currencyCode,
    languageCode: searchContext.languageCode,
    pageIndex: String(searchContext.pageIndex ?? 0),
    pageSize: String(searchContext.pageSize ?? 20),
  });

  const response = await fetch(`/api/hotels?${params.toString()}`);
  const payload: unknown = await response.json();

  if (!response.ok) {
    throw new Error(getApiErrorMessage(payload) ?? 'Impossible de récupérer les détails hôtel.');
  }

  return findHotelInResults(getHotelsFromPayload(payload), hotelId, kayakKey);
}

function readSelectedHotel(
  hotelId: string,
  kayakKey: string | null,
): HotelSummary | null {
  const storedHotel = readSessionJson<StoredSelectedHotel>(SELECTED_HOTEL_STORAGE_KEY);

  if (!storedHotel?.hotel || !matchesHotel(storedHotel.hotel, hotelId, kayakKey)) {
    return null;
  }

  return storedHotel.hotel;
}

function readCachedHotel(
  hotelId: string,
  kayakKey: string | null,
): HotelSummary | null {
  const cachedSearch = readSessionJson<StoredHotelSearch>(HOTEL_SEARCH_CACHE_STORAGE_KEY);
  return findHotelInResults(cachedSearch?.hotels ?? [], hotelId, kayakKey);
}

function readSessionJson<T>(key: string): T | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const rawValue = sessionStorage.getItem(key);
    return rawValue ? (JSON.parse(rawValue) as T) : null;
  } catch {
    return null;
  }
}

function findHotelInResults(
  hotels: HotelSummary[],
  hotelId: string,
  kayakKey: string | null,
): HotelSummary | null {
  return hotels.find((hotel) => matchesHotel(hotel, hotelId, kayakKey)) ?? null;
}

function matchesHotel(
  hotel: HotelSummary,
  hotelId: string,
  kayakKey: string | null,
): boolean {
  return (
    String(hotel.id) === hotelId ||
    hotel.kayakKey === hotelId ||
    Boolean(kayakKey && hotel.kayakKey === kayakKey)
  );
}

function getHotelsFromPayload(payload: unknown): HotelSummary[] {
  if (Array.isArray(payload)) {
    return payload as HotelSummary[];
  }

  if (!payload || typeof payload !== 'object') {
    return [];
  }

  const response = payload as Partial<HotelsApiPayload>;
  return Array.isArray(response.hotels) ? response.hotels : [];
}

function getApiErrorMessage(payload: unknown): string | null {
  if (!payload || typeof payload !== 'object' || !('error' in payload)) {
    return null;
  }

  const error = (payload as { error?: unknown }).error;
  return typeof error === 'string' ? error : null;
}

function saveRecentHotel(hotel: HotelSummary): void {
  if (typeof window === 'undefined') {
    return;
  }

  const recentHotels = readLocalJson<RecentHotel[]>('recentHotels') ?? [];
  const hotelToSave: RecentHotel = {
    id: hotel.id,
    name: hotel.name,
    imageUrl: hotel.image,
    city: hotel.city || 'Destination',
  };

  const updatedSearches = [
    hotelToSave,
    ...recentHotels.filter((recentHotel) => recentHotel.id !== hotel.id),
  ].slice(0, 4);

  try {
    localStorage.setItem('recentHotels', JSON.stringify(updatedSearches));
  } catch {
    // Recent searches are optional.
  }
}

function readLocalJson<T>(key: string): T | null {
  try {
    const rawValue = localStorage.getItem(key);
    return rawValue ? (JSON.parse(rawValue) as T) : null;
  } catch {
    return null;
  }
}

function parsePositiveInteger(
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
