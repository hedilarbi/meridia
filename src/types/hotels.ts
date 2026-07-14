export const SELECTED_HOTEL_STORAGE_KEY = 'meridia:selectedHotel';
export const HOTEL_SEARCH_CACHE_STORAGE_KEY = 'meridia:hotelSearchCache';

export interface HotelSearchContext {
  city: string;
  checkin: string;
  checkout: string;
  adults: number;
  children?: number;
  rooms?: number;
  currencyCode: string;
  languageCode: string;
  pageIndex?: number;
  pageSize?: number;
}

export interface HotelSummary {
  id: string | number;
  kayakKey?: string;
  name: string;
  city: string;
  price: number;
  rate: number;
  image: string;
  images?: string[];
  address?: string;
  stars?: number;
  meals?: string[];
  services?: string[];
  roomEquip?: string[];
  bookingUrl?: string;
  countryCode?: string;
  highestRate?: number;
  latitude?: number;
  longitude?: number;
  numberOfReviews?: number;
  numberOfProviders?: number;
  numberOfRates?: number;
  distance?: number;
  isGreatValue?: boolean;
  isSelfRated?: boolean;
  propertyType?: number;
  searchPageIndex?: number;
}

export interface HotelsApiPayload {
  hotels: HotelSummary[];
  pageIndex: number;
  pageSize: number;
  totalResults?: number;
  totalAvailableResults?: number;
  isComplete?: boolean;
}

export interface StoredSelectedHotel {
  hotel: HotelSummary;
  searchContext?: HotelSearchContext;
  storedAt: number;
}

export interface StoredHotelSearch {
  hotels: HotelSummary[];
  searchContext: HotelSearchContext;
  storedAt: number;
}

export interface HotelOffer {
  providerName: string;
  providerCode?: string;
  providerLogo?: string;
  isDirect?: boolean;
  roomName?: string;
  totalRate: number;
  bookUri: string;
  hasFreeCancellation?: boolean;
  canPayLater?: boolean;
  isCheapestRate?: boolean;
  availableRooms?: number;
}

export interface HotelOffersApiPayload {
  offers: HotelOffer[];
}

export type HomeRegion = 'france' | 'mediterranean' | 'europe' | 'international';

export interface HomeHotel extends HotelSummary {
  region: HomeRegion;
  destinationLabel: string;
  destinationCountry: string;
  searchQuery: string;
  checkin: string;
  checkout: string;
}

export interface HomeHotelsApiPayload {
  hotels: HomeHotel[];
}
