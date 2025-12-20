import { prisma } from '@/lib/db';

const GOLD_PRICE_ID = 'XAU_USD';
const STALE_AFTER_MS = 1000 * 60 * 60; // 1 hour

interface SwissquoteResponse {
  topo: {
    platform: string;
    server: string;
  };
  spreadProfilePrices: {
    ask: number;
  }[];
}

async function fetchExternalGoldPrice(): Promise<number | null> {
  try {
    const res = await fetch(
      'https://forex-data-feed.swissquote.com/public-quotes/bboquotes/instrument/XAU/USD',
      { next: { revalidate: 0 } } // Don't cache the external fetch itself
    );
    if (!res.ok) {
      console.error('Swissquote API request failed with status:', res.status);
      return null;
    }

    const data: SwissquoteResponse[] = await res.json();
    const swissquoteLtd = data.find(
      (d) => d.topo.platform === 'SwissquoteLtd' && d.topo.server === 'Live5'
    );

    if (swissquoteLtd && swissquoteLtd.spreadProfilePrices.length > 0) {
      // Assuming we take the first available price for simplicity
      return swissquoteLtd.spreadProfilePrices[0].ask;
    }

    return null;
  } catch (error) {
    console.error('Failed to fetch external gold price:', error);
    return null;
  }
}

export async function getLiveGoldPrice() {
  const existingPrice = await prisma.goldPrice.findUnique({
    where: { id: GOLD_PRICE_ID },
  });

  const isStale =
    !existingPrice || new Date().getTime() - existingPrice.updatedAt.getTime() > STALE_AFTER_MS;

  if (!isStale) {
    return existingPrice;
  }

  console.log('Gold price is stale. Fetching new price from external API...');
  const newExternalPrice = await fetchExternalGoldPrice();

  if (newExternalPrice === null) {
    // If the external API fails, return the stale data if it exists,
    // rather than returning nothing.
    if (existingPrice) {
      console.warn('External API failed. Returning stale gold price.');
      return existingPrice;
    }
    // If there's no existing price and the API fails, we have no data to return.
    throw new Error('Failed to fetch gold price and no cached data available.');
  }

  // If there's no existing price, we set previous to the new price to avoid a 0 delta.
  const previousPrice = existingPrice ? existingPrice.currentPrice : newExternalPrice;

  const updatedPrice = await prisma.goldPrice.upsert({
    where: { id: GOLD_PRICE_ID },
    update: {
      currentPrice: newExternalPrice,
      previousPrice: previousPrice,
    },
    create: {
      id: GOLD_PRICE_ID,
      currentPrice: newExternalPrice,
      previousPrice: newExternalPrice, // On first creation, delta is 0
    },
  });

  return updatedPrice;
}
