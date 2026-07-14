import { NextResponse } from 'next/server';
import { getHomeHotels } from '@/lib/homeHotels';
import { createErrorResponse, getClientIp } from '@/lib/hotelsRequestHelpers';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const hotels = await getHomeHotels(getClientIp(request));

    return NextResponse.json({ hotels });
  } catch (error) {
    console.error('Unexpected home hotels API error:', error);
    return createErrorResponse('Failed to fetch featured hotels', 500);
  }
}
