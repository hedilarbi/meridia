import { NextResponse } from 'next/server';
import {
  KayakHotelsError,
  getKayakHotelOffers,
} from '@/lib/kayakHotels';
import {
  RequestValidationError,
  createErrorResponse,
  getClientIp,
  getOrCreateUserTrackId,
  parseCurrencyCode,
  parseLanguageCode,
  validateDates,
} from '@/lib/hotelsRequestHelpers';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const kayakKey = (searchParams.get('kayakKey') ?? '').trim();

    if (!kayakKey) {
      return createErrorResponse('Missing required query parameter: kayakKey', 400);
    }

    const checkin = searchParams.get('checkin') ?? undefined;
    const checkout = searchParams.get('checkout') ?? undefined;

    if (!checkin || !checkout) {
      return createErrorResponse('checkin and checkout are required (YYYY-MM-DD)', 400);
    }

    validateDates(checkin, checkout);

    const offersResult = await getKayakHotelOffers({
      kayakKey,
      userTrackId: await getOrCreateUserTrackId(),
      clientIp: getClientIp(request),
      checkin,
      checkout,
      currencyCode: parseCurrencyCode(searchParams),
      languageCode: parseLanguageCode(searchParams),
    });

    return NextResponse.json(offersResult);
  } catch (error) {
    if (error instanceof RequestValidationError) {
      return createErrorResponse(error.message, 400);
    }

    if (error instanceof KayakHotelsError) {
      console.error('KAYAK hotel offers error:', {
        message: error.message,
        operation: error.operation,
        upstreamStatus: error.upstreamStatus,
      });

      return createErrorResponse(error.message, error.statusCode, {
        operation: error.operation,
        upstreamStatus: error.upstreamStatus,
      });
    }

    console.error('Unexpected hotel offers API error:', error);
    return createErrorResponse('Failed to fetch hotel offers', 500);
  }
}
