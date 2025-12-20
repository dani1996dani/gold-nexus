import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const karats = await prisma.karat.findMany({
      orderBy: {
        // Order by purity descending, so 24K is first
        purity: 'desc',
      },
    });

    // Prisma's Decimal type is not directly serializable to JSON.
    // We need to convert it to a string or number for the API response.
    const serializableKarats = karats.map((k) => ({
      ...k,
      purity: k.purity.toString(),
    }));

    return NextResponse.json(serializableKarats);
  } catch (error) {
    console.error('[API/KARATS] Error fetching karats:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
