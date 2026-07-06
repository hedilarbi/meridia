const DEFAULT_HOTEL_IMAGE =
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200';

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

export interface HotelSearchOptions {
  query: string;
  userTrackId: string;
  clientIp: string;
  checkin: string;
  checkout: string;
  adults: number;
  currencyCode: string;
  languageCode: string;
  pageIndex: number;
  pageSize: number;
  responseOptions?: string;
}

export interface HotelSearchResult {
  id: string;
  kayakKey: string;
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
}

export interface HotelSearchResponse {
  hotels: HotelSearchResult[];
  pageIndex: number;
  pageSize: number;
  totalResults?: number;
  totalAvailableResults?: number;
  isComplete?: boolean;
}

export interface HotelOffersOptions {
  kayakKey: string;
  userTrackId: string;
  clientIp: string;
  checkin: string;
  checkout: string;
  currencyCode: string;
  languageCode: string;
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

export interface HotelOffersResponse {
  offers: HotelOffer[];
}

interface KayakConfig {
  apiKey: string;
  origin: string;
}

interface KayakAutocompleteRecord {
  entityKey?: string;
  name?: string;
  fullName?: string;
  primaryPlaceType?: string;
  displayPlaceType?: string;
  cityName?: string;
  countryName?: string;
  countryCode?: string;
}

interface KayakAutocompleteResponse {
  results?: KayakAutocompleteRecord[];
}

interface KayakHotelImage {
  large?: string;
  small?: string;
}

interface KayakHotelResult {
  id?: number | string;
  key?: string;
  name?: string;
  address?: string;
  hotelCountryCode?: string;
  latitude?: number;
  longitude?: number;
  starRating?: number | null;
  isSelfRated?: boolean;
  images?: KayakHotelImage[];
  lowestRate?: number | null;
  highestRate?: number | null;
  guestRating?: number | null;
  numberOfReviews?: number;
  href?: string;
  distance?: number;
  isGreatValue?: boolean;
  propertyType?: number;
  numberOfProviders?: number;
  numberOfRates?: number;
}

interface KayakHotelsResponse {
  isComplete?: boolean;
  totalResults?: number;
  totalAvailableResults?: number;
  results?: KayakHotelResult[];
  currencyCode?: string;
  languageCode?: string;
  countryCode?: string;
}

interface KayakHotelOfferProvider {
  code?: string;
  name?: string;
  logo?: string;
  isDirect?: boolean;
  isLanguageSupported?: boolean;
}

interface KayakHotelOfferResult {
  roomName?: string;
  totalRate?: number;
  isCheapestRate?: boolean;
  hasFreeCancellation?: boolean;
  canPayLater?: boolean;
  availableRooms?: number;
  providerIndex?: number;
  bookUri?: string;
}

interface KayakHotelDetailResponse {
  isComplete?: boolean;
  providers?: KayakHotelOfferProvider[];
  results?: KayakHotelOfferResult[];
}

export class KayakHotelsError extends Error {
  statusCode: number;
  upstreamStatus?: number;
  operation?: string;

  constructor(
    message: string,
    statusCode: number,
    options: { upstreamStatus?: number; operation?: string } = {},
  ) {
    super(message);
    this.name = 'KayakHotelsError';
    this.statusCode = statusCode;
    this.upstreamStatus = options.upstreamStatus;
    this.operation = options.operation;
  }
}

export async function searchKayakHotels(
  options: HotelSearchOptions,
): Promise<HotelSearchResponse> {
  const config = getKayakConfig();
  const destination = await resolveHotelDestination(config, options.query);
  const kayakResponse = await fetchHotelsForDestination(config, destination, options);

  const hotels = (kayakResponse.results ?? []).map((hotel) =>
    mapKayakHotel(hotel, destination, options.query, config.origin),
  );

  if (hotels.length === 0) {
    throw new KayakHotelsError('No hotels found for this destination', 404);
  }

  const searchResponse: HotelSearchResponse = {
    hotels,
    pageIndex: options.pageIndex,
    pageSize: options.pageSize,
  };

  if (kayakResponse.totalResults !== undefined) {
    searchResponse.totalResults = kayakResponse.totalResults;
  }

  if (kayakResponse.totalAvailableResults !== undefined) {
    searchResponse.totalAvailableResults = kayakResponse.totalAvailableResults;
  }

  if (kayakResponse.isComplete !== undefined) {
    searchResponse.isComplete = kayakResponse.isComplete;
  }

  return searchResponse;
}

export async function getKayakHotelOffers(
  options: HotelOffersOptions,
): Promise<HotelOffersResponse> {
  const config = getKayakConfig();
  const url = createKayakUrl(config.origin, '/api/3.0/hotel', {
    apiKey: config.apiKey,
    userTrackId: options.userTrackId,
    hotel: options.kayakKey,
    checkin: options.checkin,
    checkout: options.checkout,
    currencyCode: options.currencyCode,
    languageCode: options.languageCode,
  });
  const headers = buildKayakHeaders(options.clientIp);

  const detail = await pollUntilComplete(() =>
    fetchKayakJson<KayakHotelDetailResponse>(url, 'hotelOffers', headers),
  );

  const offers = mapHotelOffers(detail);

  if (offers.length === 0) {
    throw new KayakHotelsError('No offers found for this hotel', 404);
  }

  return { offers };
}

function getKayakConfig(): KayakConfig {
  const apiKey = process.env.KAYAK_API_KEY?.trim();
  const baseUrl = process.env.KAYAK_API_BASE_URL?.trim();

  if (!apiKey || !baseUrl) {
    throw new KayakHotelsError('KAYAK configuration is missing', 500);
  }

  try {
    return {
      apiKey,
      origin: new URL(baseUrl).origin,
    };
  } catch {
    throw new KayakHotelsError('KAYAK base URL is invalid', 500);
  }
}

async function resolveHotelDestination(
  config: KayakConfig,
  query: string,
): Promise<KayakAutocompleteRecord> {
  const url = createKayakUrl(config.origin, '/api/affiliate/autocomplete/v1/hotels', {
    apiKey: config.apiKey,
    searchTerm: query,
  });

  const response = await fetchKayakJson<KayakAutocompleteResponse>(
    url,
    'hotelAutocomplete',
    {},
  );
  const results = response.results ?? [];
  const destination =
    results.find((result) => result.entityKey?.startsWith('kplace:')) ??
    results.find((result) => Boolean(result.entityKey));

  if (!destination?.entityKey) {
    throw new KayakHotelsError('No KAYAK destination found for this query', 404);
  }

  return destination;
}

const POLL_DELAY_MS = 1500;
const MAX_POLLS = 3;

async function fetchHotelsForDestination(
  config: KayakConfig,
  destination: KayakAutocompleteRecord,
  options: HotelSearchOptions,
): Promise<KayakHotelsResponse> {
  const params: Record<string, string | number | boolean | undefined> = {
    apiKey: config.apiKey,
    userTrackId: options.userTrackId,
    destination: destination.entityKey,
    checkin: options.checkin,
    checkout: options.checkout,
    languageCode: options.languageCode,
    currencyCode: options.currencyCode,
    pageIndex: options.pageIndex,
    pageSize: options.pageSize,
    responseOptions: options.responseOptions ?? 'images',
  };

  const url = createKayakUrl(config.origin, '/api/3.0/hotels', params);
  const headers = buildKayakHeaders(options.clientIp);

  return pollUntilComplete(() =>
    fetchKayakJson<KayakHotelsResponse>(url, 'hotelSearch', headers),
  );
}

async function pollUntilComplete<T extends { isComplete?: boolean }>(
  fetchOnce: () => Promise<T>,
): Promise<T> {
  // KAYAK's search endpoints run asynchronously; the first request kicks off the
  // search and subsequent polls return more results until isComplete is true.
  let response = await fetchOnce();

  for (let poll = 0; poll < MAX_POLLS && !response.isComplete; poll++) {
    await sleep(POLL_DELAY_MS);
    response = await fetchOnce();
  }

  return response;
}

function buildKayakHeaders(clientIp: string): Record<string, string> {
  return {
    'Accept': 'application/json',
    'User-Agent': 'Mozilla/5.0 (compatible; MeridiaApp/1.0)',
    'x-original-client-ip': clientIp,
  };
}

async function fetchKayakJson<T>(
  url: URL,
  operation: string,
  headers: Record<string, string>,
): Promise<T> {
  const response = await fetch(url, {
    headers,
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new KayakHotelsError(
      'KAYAK API request failed',
      502,
      { upstreamStatus: response.status, operation },
    );
  }

  return (await response.json()) as T;
}

function createKayakUrl(
  origin: string,
  pathname: string,
  params: Record<string, string | number | boolean | undefined>,
): URL {
  const url = new URL(pathname, origin);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });

  return url;
}

function mapKayakHotel(
  hotel: KayakHotelResult,
  destination: KayakAutocompleteRecord,
  fallbackQuery: string,
  origin: string,
): HotelSearchResult {
  const rate = toPositiveNumber(hotel.guestRating) ?? 0;
  const stars = toPositiveNumber(hotel.starRating);
  const city = destination.cityName ?? destination.name ?? fallbackQuery;
  const images = getHotelImages(hotel);

  return removeUndefined({
    id: String(hotel.id ?? hotel.key ?? hotel.name ?? crypto.randomUUID()),
    kayakKey: String(hotel.key ?? ''),
    name: hotel.name ?? 'Hotel',
    city,
    price: toPositiveNumber(hotel.lowestRate) ?? 0,
    rate: roundToOneDecimal(rate),
    image: getHotelImage(hotel),
    images: images.length > 0 ? images : undefined,
    address: hotel.address,
    stars: stars ? Math.min(Math.max(Math.round(stars), 1), 5) : undefined,
    bookingUrl: normalizePublicBookingHref(hotel.href, origin),
    countryCode: hotel.hotelCountryCode ?? destination.countryCode,
    highestRate: toPositiveNumber(hotel.highestRate),
    latitude: toFiniteNumber(hotel.latitude),
    longitude: toFiniteNumber(hotel.longitude),
    numberOfReviews: toPositiveInteger(hotel.numberOfReviews),
    numberOfProviders: toPositiveInteger(hotel.numberOfProviders),
    numberOfRates: toPositiveInteger(hotel.numberOfRates),
    distance: toPositiveNumber(hotel.distance),
    isGreatValue: hotel.isGreatValue,
    isSelfRated: hotel.isSelfRated,
    propertyType: toPositiveInteger(hotel.propertyType),
  });
}

function mapHotelOffers(detail: KayakHotelDetailResponse): HotelOffer[] {
  const providers = detail.providers ?? [];

  return (detail.results ?? [])
    .map((result) => mapHotelOffer(result, providers))
    .filter((offer): offer is HotelOffer => Boolean(offer))
    .sort((a, b) => a.totalRate - b.totalRate);
}

function mapHotelOffer(
  result: KayakHotelOfferResult,
  providers: KayakHotelOfferProvider[],
): HotelOffer | undefined {
  const bookUri = toValidUrl(result.bookUri);
  const totalRate = toPositiveNumber(result.totalRate);
  const provider =
    result.providerIndex !== undefined ? providers[result.providerIndex] : undefined;

  if (!bookUri || totalRate === undefined || !provider?.name) {
    return undefined;
  }

  return removeUndefined({
    providerName: provider.name,
    providerCode: provider.code,
    providerLogo: provider.logo,
    isDirect: provider.isDirect,
    roomName: result.roomName,
    totalRate,
    bookUri,
    hasFreeCancellation: result.hasFreeCancellation,
    canPayLater: result.canPayLater,
    isCheapestRate: result.isCheapestRate,
    availableRooms: toPositiveInteger(result.availableRooms),
  });
}

function toValidUrl(value: string | undefined): string | undefined {
  if (!value) {
    return undefined;
  }

  try {
    return new URL(value).toString();
  } catch {
    return undefined;
  }
}

function getHotelImage(hotel: KayakHotelResult): string {
  return getHotelImages(hotel)[0] ?? DEFAULT_HOTEL_IMAGE;
}

function getHotelImages(hotel: KayakHotelResult): string[] {
  const images = hotel.images
    ?.flatMap((image) => [image.large, image.small])
    .filter((image): image is string => Boolean(image));

  return [...new Set(images ?? [])];
}

function normalizePublicBookingHref(href: string | undefined, origin: string): string | undefined {
  if (!href) {
    return undefined;
  }

  try {
    const url = new URL(href, origin);

    if (url.pathname.startsWith('/api/')) {
      return undefined;
    }

    return url.toString();
  } catch {
    return undefined;
  }
}

function toPositiveNumber(value: number | null | undefined): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) && value > 0
    ? value
    : undefined;
}

function toFiniteNumber(value: number | null | undefined): number | undefined {
  return typeof value === 'number' && Number.isFinite(value)
    ? value
    : undefined;
}

function toPositiveInteger(value: number | null | undefined): number | undefined {
  return Number.isInteger(value) && typeof value === 'number' && value > 0
    ? value
    : undefined;
}

function roundToOneDecimal(value: number): number {
  return Math.round(value * 10) / 10;
}

function removeUndefined<T extends Record<string, JsonValue | undefined>>(
  value: T,
): T {
  return Object.fromEntries(
    Object.entries(value).filter(([, entryValue]) => entryValue !== undefined),
  ) as T;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
