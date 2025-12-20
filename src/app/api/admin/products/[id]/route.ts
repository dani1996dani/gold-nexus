import { NextResponse } from 'next/server';
import { z } from 'zod';
import { withAdminAuth, AdminApiHandler } from '@/lib/admin-auth';
import { getProductById, updateProduct, deleteProduct } from '@/lib/data/products';
import { prisma } from '@/lib/db';

const getHandler: AdminApiHandler = async (req, context) => {
  try {
    const { id } = await context.params;
    const product = await getProductById(id);
    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }
    // Serialize decimal for client
    return NextResponse.json({
      ...product,
      price: product.price.toString(),
    });
  } catch (error) {
    console.error(`[API/ADMIN/PRODUCTS/[id]] Error fetching product:`, error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
};

// Use the same schema as POST but make all fields optional for PUT
const productUpdateSchema = z.object({
  sku: z.string().min(1, 'SKU is required').optional(),
  name: z.string().min(1, 'Name is required').optional(),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive').optional(),
  weight: z.string().min(1, 'Weight is required').optional(),
  karat: z.string().min(1, 'Karat is required').optional(),
  category: z.enum(['BAR', 'COIN', 'JEWELRY']).optional(),
  imageUrl: z.string().url('Must be a valid URL').optional(),
  vendorName: z.string().min(1, 'Vendor name is required').optional(),
  stockStatus: z.enum(['IN_STOCK', 'OUT_OF_STOCK']).optional(),
  isActive: z.boolean().optional(),
});

const putHandler: AdminApiHandler = async (req, context) => {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const data = productUpdateSchema.parse(body);

    // If SKU is being updated, check if the new SKU is already taken by another product
    if (data.sku) {
      const existingProduct = await prisma.product.findFirst({
        where: {
          sku: data.sku,
          id: { not: id },
        },
      });
      if (existingProduct) {
        return NextResponse.json(
          { message: 'Another product with this SKU already exists.' },
          { status: 409 }
        );
      }
    }

    const updatedProduct = await updateProduct(id, data);
    return NextResponse.json(updatedProduct);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid product data', errors: error.issues },
        { status: 400 }
      );
    }
    console.error(`[API/ADMIN/PRODUCTS/[id]] Error updating product:`, error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
};

const deleteHandler: AdminApiHandler = async (req, context) => {
  try {
    const { id } = await context.params;
    await deleteProduct(id);
    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error(`[API/ADMIN/PRODUCTS/[id]] Error deleting product:`, error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
};

export const GET = withAdminAuth(getHandler);
export const PUT = withAdminAuth(putHandler);
export const DELETE = withAdminAuth(deleteHandler);
