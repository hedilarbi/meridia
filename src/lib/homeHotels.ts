import { KayakHotelsError, searchKayakHotels } from './kayakHotels';
import type { HomeHotel, HomeRegion } from '@/types/hotels';

interface HomeDestination {
  query: string;
  label: string;
  country: string;
  region: HomeRegion;
}

const HOME_DESTINATIONS: HomeDestination[] = [
  { query: 'Paris', label: 'Paris', country: 'France', region: 'france' },
  { query: 'Nice', label: 'Nice', country: 'France', region: 'france' },
  { query: 'Santorini', label: 'Santorin', country: 'Grèce', region: 'mediterranean' },
  { query: 'Rome', label: 'Rome', country: 'Italie', region: 'mediterranean' },
  { query: 'London', label: 'Londres', country: 'Royaume-Uni', region: 'europe' },
  { query: 'Vienna', label: 'Vienne', country: 'Autriche', region: 'europe' },
  { query: 'Tokyo', label: 'Tokyo', country: 'Japon', region: 'international' },
  { query: 'Marrakech', label: 'Marrakech', country: 'Maroc', region: 'international' },
];

const HOTELS_PER_DESTINATION = 4;
const CACHE_TTL_MS = 15 * 60 * 1000;

let cache: { hotels: HomeHotel[]; expiresAt: number } | null = null;

export function getRollingSearchDates(daysFromNow: number, nights: number): { checkin: string; checkout: string } {
  const checkinDate = new Date();
  checkinDate.setUTCHours(0, 0, 0, 0);
  checkinDate.setUTCDate(checkinDate.getUTCDate() + daysFromNow);

  const checkoutDate = new Date(checkinDate);
  checkoutDate.setUTCDate(checkoutDate.getUTCDate() + nights);

  return {
    checkin: checkinDate.toISOString().slice(0, 10),
    checkout: checkoutDate.toISOString().slice(0, 10),
  };
}

export async function getHomeHotels(clientIp: string): Promise<HomeHotel[]> {
  if (cache && cache.expiresAt > Date.now()) {
    return cache.hotels;
  }

  const { checkin, checkout } = getRollingSearchDates(30, 3);

  const settledResults = await Promise.allSettled(
    HOME_DESTINATIONS.map(async (destination) => {
      const response = await searchKayakHotels({
        query: destination.query,
        userTrackId: crypto.randomUUID(),
        clientIp,
        checkin,
        checkout,
        adults: 2,
        currencyCode: 'EUR',
        languageCode: 'fr',
        pageIndex: 0,
        pageSize: HOTELS_PER_DESTINATION,
      });

      return response.hotels.slice(0, HOTELS_PER_DESTINATION).map((hotel): HomeHotel => ({
        ...hotel,
        region: destination.region,
        destinationLabel: destination.label,
        destinationCountry: destination.country,
        searchQuery: destination.query,
        checkin,
        checkout,
      }));
    }),
  );

  const hotels = settledResults.flatMap((result) => {
    if (result.status === 'fulfilled') {
      return result.value;
    }

    if (!(result.reason instanceof KayakHotelsError)) {
      console.error('Unexpected home hotels error:', result.reason);
    }

    return [];
  });

  cache = { hotels, expiresAt: Date.now() + CACHE_TTL_MS };

  return hotels;
}
