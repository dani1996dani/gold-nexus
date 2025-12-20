// app/api/products/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { ProductCategory, Prisma } from '@/generated/prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // 1. Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    // 2. Filtering
    const categoriesParam = searchParams.get('categories');
    const categories = categoriesParam
      ? (categoriesParam.split(',').filter(Boolean) as ProductCategory[])
      : [];

    const isFeatured = searchParams.get('featured') === 'true';

    const where: Prisma.ProductWhereInput = {
      isActive: true,
      ...(isFeatured && { isFeatured: true }),
      ...(categories.length > 0 && {
        category: { in: categories },
      }),
    };
    // 3. Sorting
    const sortBy = searchParams.get('sortBy') || 'price-asc';
    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };

    if (sortBy === 'price-asc') {
      orderBy = { price: 'asc' };
    } else if (sortBy === 'price-desc') {
      orderBy = { price: 'desc' };
    }

    // 4. Execute Query
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    const hasMore = skip + products.length < total;

    return NextResponse.json({
      products,
      metadata: {
        total,
        page,
        limit,
        hasMore,
      },
    });
  } catch (error) {
    console.error('Get Products Error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
