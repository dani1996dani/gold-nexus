// app/api/product/[sku]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/../lib/db';

export async function GET(request: NextRequest, context: { params: Promise<{ sku: string }> }) {
  try {
    const { sku } = await context.params;

    if (!sku) {
      return NextResponse.json({ error: 'Product SKU is required' }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: {
        sku: sku,
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Get Single Product Error:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}
