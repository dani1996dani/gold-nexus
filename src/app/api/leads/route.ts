import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { leadSchema } from '@/lib/zod-schemas/leadSchema';
import { getLiveGoldPrice } from '@/lib/gold-price-service';
import { ZodError } from 'zod';
import { Karat } from '@/generated/prisma/client';
import { sendLeadForwardingEmail } from '@/lib/email';

// Simple in-memory cache for Karat data to avoid hitting the DB on every request.
let karatCache: Karat[] | null = null;

async function getKaratPurities(): Promise<Record<string, number>> {
  if (!karatCache) {
    console.log('No karat cache found. Fetching from DB...');
    karatCache = await prisma.karat.findMany();
  }

  return karatCache.reduce((acc: Record<string, number>, karat) => {
    acc[karat.name.toUpperCase()] = Number(karat.purity);
    return acc;
  }, {});
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = leadSchema.parse(body);

    // --- Price Estimation Logic ---
    let estimatedValue: number | null = null;
    try {
      const [goldPriceData, karatPurities] = await Promise.all([
        getLiveGoldPrice(),
        getKaratPurities(),
      ]);

      const livePricePerGram = Number(goldPriceData.currentPrice) / 31.1035; // Convert from oz to grams. Gold price in the market is for 1 oz, not 1 gram.
      const purity = karatPurities[validatedData.estimatedKarat.toUpperCase()];
      const weightInGrams = validatedData.estimatedWeight;

      if (purity) {
        estimatedValue = livePricePerGram * weightInGrams * purity;
      }
    } catch (priceError) {
      console.error('Could not calculate estimated price:', priceError);
      // Not a critical error, we can still save the lead.
    }

    // --- Save Lead to Database ---
    const newLead = await prisma.secondHandLead.create({
      data: {
        ...validatedData,
        estimatedValue: estimatedValue,
      },
    });

    // --- Email Forwarding ---
    await sendLeadForwardingEmail(newLead);

    return NextResponse.json(
      { message: 'Lead submitted successfully.', leadId: newLead.id },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: 'Invalid form data', errors: error.issues },
        { status: 400 }
      );
    }
    console.error('[API/LEADS] Error creating lead:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
