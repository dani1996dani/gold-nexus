import { NextResponse } from 'next/server';
import { getLiveGoldPrice } from '@/lib/gold-price-service';
import { headers } from 'next/headers';

// This is the new endpoint for the cron job to call.
// It is protected by the 'x-vercel-cron-secret' header,
// which is automatically sent by Vercel's cron service.
export async function POST() {
  const headersList = await headers();
  const cronSecretHeader = headersList.get('x-vercel-cron-secret');
  const cronSecretEnv = process.env.CRON_SECRET;

  if (!cronSecretEnv) {
    console.error('[CRON] CRON_SECRET environment variable is not set. Denying request.');
    // Don't expose internal config details in the response
    return NextResponse.json({ message: 'Configuration error' }, { status: 500 });
  }

  if (cronSecretHeader !== cronSecretEnv) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('[CRON] Authorized request received. Fetching new gold price...');
    const goldPriceData = await getLiveGoldPrice();
    console.log('[CRON] Successfully updated gold price.');
    return NextResponse.json({
      message: 'Gold price updated successfully',
      price: goldPriceData,
    });
  } catch (error) {
    console.error('[CRON] Error updating gold price:', error);
    return NextResponse.json({ message: 'Failed to update gold price data.' }, { status: 500 });
  }
}
