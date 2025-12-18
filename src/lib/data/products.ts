import { prisma } from '@/lib/db';
import type { Product, Prisma } from '@/generated/prisma/client';

/**
 * Fetches a paginated list of products for the admin panel.
 * Includes all products, regardless of status.
 */
export async function getProducts(
  page: number,
  limit: number,
  search?: string,
  sortBy: string = 'createdAt',
  sortOrder: 'asc' | 'desc' = 'desc'
) {
  const skip = (page - 1) * limit;

  // Build the where clause for searching
  const where: Prisma.ProductWhereInput = search
    ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { sku: { contains: search, mode: 'insensitive' } },
        ],
      }
    : {};

  const [products, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  // The Decimal type for price is safe to return on the server side.
  // The API route will handle serialization to the client.
  return {
    data: products,
    pagination: {
      total,
      page,
      limit,
      totalPages,
    },
  };
}

/**
 * Fetches a single product by its ID.
 */
export async function getProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
  });
}

/**
 * Updates a product's data.
 */
export async function updateProduct(id: string, data: Prisma.ProductUpdateInput) {
  return prisma.product.update({
    where: { id },
    data,
  });
}

/**
 * Deletes a product by its ID.
 */
export async function deleteProduct(id: string) {
  return prisma.product.delete({
    where: { id },
  });
}
