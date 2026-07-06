import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const KAYAK_USER_TRACK_ID_COOKIE = 'kayak_user_track_id';
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export class RequestValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RequestValidationError';
  }
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') ?? '127.0.0.1';
}

export async function getOrCreateUserTrackId(): Promise<string> {
  const cookieStore = await cookies();
  const existingUserTrackId = cookieStore.get(KAYAK_USER_TRACK_ID_COOKIE)?.value;

  if (existingUserTrackId && UUID_PATTERN.test(existingUserTrackId)) {
    return existingUserTrackId;
  }

  const userTrackId = crypto.randomUUID();

  cookieStore.set(KAYAK_USER_TRACK_ID_COOKIE, userTrackId, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });

  return userTrackId;
}

export function parseIntegerParam(
  searchParams: URLSearchParams,
  name: string,
  defaultValue: number,
  min: number,
  max: number,
): number {
  const rawValue = searchParams.get(name);

  if (!rawValue) {
    return defaultValue;
  }

  const value = Number(rawValue);

  if (!Number.isInteger(value) || value < min || value > max) {
    throw new RequestValidationError(
      `${name} must be an integer between ${min} and ${max}`,
    );
  }

  return value;
}

export function parseCurrencyCode(searchParams: URLSearchParams): string {
  const currencyCode = (
    searchParams.get('currencyCode') ??
    searchParams.get('currency') ??
    'EUR'
  ).toUpperCase();

  if (!/^[A-Z]{3}$/.test(currencyCode)) {
    throw new RequestValidationError('currencyCode must be an ISO 4217 code');
  }

  return currencyCode;
}

export function parseLanguageCode(searchParams: URLSearchParams): string {
  const languageCode =
    searchParams.get('languageCode') ?? searchParams.get('language') ?? 'fr';

  if (!/^[a-zA-Z]{2}(?:_[A-Z]{2})?$/.test(languageCode)) {
    throw new RequestValidationError('languageCode must be a valid language code');
  }

  return languageCode;
}

export function validateDates(checkin?: string, checkout?: string): void {
  if (!checkin && !checkout) {
    return;
  }

  if (!checkin || !checkout) {
    throw new RequestValidationError('checkin and checkout must be provided together');
  }

  const checkinDate = parseIsoDate('checkin', checkin);
  const checkoutDate = parseIsoDate('checkout', checkout);

  if (checkoutDate <= checkinDate) {
    throw new RequestValidationError('checkout must be after checkin');
  }
}

function parseIsoDate(name: string, value: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new RequestValidationError(`${name} must use YYYY-MM-DD format`);
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    throw new RequestValidationError(`${name} must be a valid date`);
  }

  return date;
}

export function createErrorResponse(
  message: string,
  status: number,
  details: Record<string, string | number | undefined> = {},
): NextResponse {
  return NextResponse.json(
    {
      error: message,
      ...Object.fromEntries(
        Object.entries(details).filter(([, value]) => value !== undefined),
      ),
    },
    { status },
  );
}
