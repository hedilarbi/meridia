import { NextResponse } from 'next/server';
import {
  KayakHotelsError,
  searchKayakHotels,
} from '@/lib/kayakHotels';
import {
  RequestValidationError,
  createErrorResponse,
  getClientIp,
  getOrCreateUserTrackId,
  parseCurrencyCode,
  parseIntegerParam,
  parseLanguageCode,
  validateDates,
} from '@/lib/hotelsRequestHelpers';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = (searchParams.get('q') ?? searchParams.get('city') ?? '').trim();

    if (!query) {
      return createErrorResponse('Missing required query parameter: q', 400);
    }

    const checkin = searchParams.get('checkin') ?? searchParams.get('start') ?? undefined;
    const checkout = searchParams.get('checkout') ?? searchParams.get('end') ?? undefined;

    if (!checkin || !checkout) {
      return createErrorResponse('checkin and checkout are required (YYYY-MM-DD)', 400);
    }

    validateDates(checkin, checkout);

    const searchResult = await searchKayakHotels({
      query,
      userTrackId: await getOrCreateUserTrackId(),
      clientIp: getClientIp(request),
      checkin,
      checkout,
      adults: parseIntegerParam(searchParams, 'adults', 2, 1, 12),
      currencyCode: parseCurrencyCode(searchParams),
      languageCode: parseLanguageCode(searchParams),
      pageIndex: parseIntegerParam(searchParams, 'pageIndex', 0, 0, 1000),
      pageSize: parseIntegerParam(searchParams, 'pageSize', 20, 1, 50),
      responseOptions: searchParams.get('responseOptions') ?? undefined,
    });

    return NextResponse.json(searchResult);
  } catch (error) {
    if (error instanceof RequestValidationError) {
      return createErrorResponse(error.message, 400);
    }

    if (error instanceof KayakHotelsError) {
      console.error('KAYAK hotels error:', {
        message: error.message,
        operation: error.operation,
        upstreamStatus: error.upstreamStatus,
      });

      return createErrorResponse(error.message, error.statusCode, {
        operation: error.operation,
        upstreamStatus: error.upstreamStatus,
      });
    }

    console.error('Unexpected hotels API error:', error);
    return createErrorResponse('Failed to fetch hotels', 500);
  }
}
