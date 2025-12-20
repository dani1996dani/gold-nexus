import { prisma } from '@/lib/db';

/**
 * Fetches a paginated list of orders.
 * @param page The current page number.
 * @param limit The number of items per page.
 * @returns An object containing paginated order data.
 */
export async function getOrders(
  page: number,
  limit: number,
  sortBy: string = 'createdAt',
  sortOrder: 'asc' | 'desc' = 'desc'
) {
  const skip = (page - 1) * limit;

  // Define allowed sort keys to prevent 'any' usage
  const allowedSortKeys = ['totalAmount', 'displayId', 'status', 'createdAt'] as const;
  type AllowedSortKey = (typeof allowedSortKeys)[number];

  let orderBy: Record<string, any> = {};

  if (sortBy === 'customer') {
    orderBy = { user: { fullName: sortOrder } };
  } else if (allowedSortKeys.includes(sortBy as AllowedSortKey)) {
    orderBy = { [sortBy]: sortOrder };
  } else {
    // Fallback default
    orderBy = { createdAt: 'desc' };
  }

  const [orders, total] = await prisma.$transaction([
    prisma.order.findMany({
      skip,
      take: limit,
      orderBy,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                name: true,
                sku: true,
              },
            },
          },
        },
      },
    }),
    prisma.order.count(),
  ]);

  const totalPages = Math.ceil(total / limit);

  // Serialize Decimal types and JSON fields
  const serializedOrders = orders.map((order) => ({
    ...order,
    totalAmount: order.totalAmount.toString(),
    shippingAddressJson: order.shippingAddressJson, // Prisma Client already parses Json fields
    items: order.items.map((item) => ({
      ...item,
      priceAtPurchase: item.priceAtPurchase.toString(),
    })),
  }));

  return {
    data: serializedOrders,
    pagination: {
      total,
      page,
      limit,
      totalPages,
    },
  };
}

/**
 * Fetches a single order by its ID.
 * @param id The ID of the order to fetch.
 * @returns The order object or null if not found.
 */
export async function getOrderById(id: string) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },
      items: {
        include: {
          product: {
            select: {
              name: true,
              sku: true,
              imageUrl: true,
            },
          },
        },
      },
    },
  });

  if (!order) {
    return null;
  }

  // Serialize Decimal types and JSON fields
  const serializedOrder = {
    ...order,
    totalAmount: order.totalAmount.toString(),
    shippingAddressJson: order.shippingAddressJson, // Prisma Client already parses Json fields
    items: order.items.map((item) => ({
      ...item,
      priceAtPurchase: item.priceAtPurchase.toString(),
    })),
  };

  return serializedOrder;
}
