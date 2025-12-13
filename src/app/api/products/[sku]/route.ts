// app/api/product/[sku]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/../lib/db';

interface Params {
  params: { sku: string };
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { sku } = await params;

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
