// app/api/product/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/../lib/db'; // Adjust path if needed

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true, // Only fetch active product
      },
      orderBy: {
        createdAt: 'desc', // Show newest product first
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Get Products Error:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}
