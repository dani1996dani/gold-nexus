import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// This configures the route to be revalidated every 60 seconds.
// It provides a fast, cached endpoint for the frontend to consume.
// The data is updated in the background by a separate cron job.
export const revalidate = 60;

const GOLD_PRICE_ID = 'XAU_USD';

export async function GET() {
  try {
    const goldPriceData = await prisma.goldPrice.findUnique({
      where: { id: GOLD_PRICE_ID },
    });

    if (!goldPriceData) {
      return NextResponse.json({ message: 'Gold price data not available.' }, { status: 404 });
    }

    // The Prisma Decimal type is not directly serializable, so we convert to string.
    // The client component already handles parsing this string.
    const serializableData = {
      ...goldPriceData,
      currentPrice: goldPriceData.currentPrice.toString(),
      previousPrice: goldPriceData.previousPrice.toString(),
    };

    return NextResponse.json(serializableData);
  } catch (error) {
    console.error('[API/GOLD-PRICE] Error fetching gold price from DB:', error);
    return NextResponse.json({ message: 'Failed to fetch gold price data.' }, { status: 500 });
  }
}
