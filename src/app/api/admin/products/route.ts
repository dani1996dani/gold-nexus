import { NextResponse } from 'next/server';
import { withAdminAuth, AdminApiHandler } from '@/lib/admin-auth';
import { getProducts } from '@/lib/data/products';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const getProductsHandler: AdminApiHandler = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const search = searchParams.get('search') || undefined;
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrderParam = searchParams.get('sortOrder') || 'desc';
    const sortOrder = sortOrderParam === 'asc' ? 'asc' : 'desc';

    const productsResult = await getProducts(page, limit, search, sortBy, sortOrder);

    // Serialize Decimal types for the client
    const serializedData = productsResult.data.map((product) => ({
      ...product,
      price: product.price.toString(),
    }));

    return NextResponse.json({
      data: serializedData,
      pagination: productsResult.pagination,
    });
  } catch (error) {
    console.error('[API/ADMIN/PRODUCTS] Error fetching products:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
};

const productSchema = z.object({
  sku: z.string().min(1, 'SKU is required'),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  weight: z.string().min(1, 'Weight is required'),
  karat: z.string().min(1, 'Karat is required'),
  category: z.enum(['BAR', 'COIN', 'JEWELRY']),
  imageUrl: z.string().url('Must be a valid URL'),
  vendorName: z.string().min(1, 'Vendor name is required'),
  stockStatus: z.enum(['IN_STOCK', 'OUT_OF_STOCK']),
  isActive: z.boolean(),
  isFeatured: z.boolean().optional(),
});

const postProductsHandler: AdminApiHandler = async (req) => {
  try {
    const body = await req.json();
    const data = productSchema.parse(body);

    // Check for duplicate SKU
    const existingProduct = await prisma.product.findUnique({
      where: { sku: data.sku },
    });

    if (existingProduct) {
      return NextResponse.json(
        { message: 'A product with this SKU already exists.' },
        { status: 409 }
      );
    }

    const newProduct = await prisma.product.create({
      data,
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid product data', errors: error.issues },
        { status: 400 }
      );
    }
    console.error('[API/ADMIN/PRODUCTS] Error creating product:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
};

export const GET = withAdminAuth(getProductsHandler);
export const POST = withAdminAuth(postProductsHandler);
