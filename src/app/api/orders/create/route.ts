import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { shippingSchema } from '@/lib/zod-schemas/shippingSchema';
import { getUserIdFromToken } from '@/lib/jwt';

const cartItemSchema = z.object({
  id: z.string().uuid(),
  quantity: z.number().min(1),
});

const orderCreationSchema = z.object({
  shippingAddress: shippingSchema,
  cartItems: z.array(cartItemSchema).min(1),
});

// Stub for Stripe Checkout Session creation
async function createStripeCheckoutSession(order: any, user: any) {
  // TODO: MILESTONE 4 - Implement actual Stripe Checkout Session creation
  console.log(`[STUB] Creating Stripe Checkout Session for Order ID: ${order.id}`);
  const mockCheckoutUrl = `/checkout/success?orderId=${order.id}`;

  return {
    url: mockCheckoutUrl,
    stripeSessionId: `mock_stripe_session_${new Date().getTime()}`,
  };
}

export async function POST(req: NextRequest) {
  // 1. Corrected Authentication Guard
  const userId = await getUserIdFromToken();
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ message: 'Authenticated user not found' }, { status: 404 });
  }

  // 2. Request Body Validation
  const body = await req.json();
  const validation = orderCreationSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { message: 'Invalid request body', errors: validation.error.flatten() },
      { status: 400 }
    );
  }
  const { shippingAddress, cartItems } = validation.data;

  try {
    // 3. Server-Side Price Verification
    const productIds = cartItems.map((item) => item.id);
    const productsFromDb = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        isActive: true,
      },
    });

    if (productsFromDb.length !== productIds.length) {
      const foundIds = new Set(productsFromDb.map((p) => p.id));
      const missingIds = productIds.filter((id) => !foundIds.has(id));
      return NextResponse.json(
        { message: 'One or more products are not available.', missingProductIds: missingIds },
        { status: 400 }
      );
    }

    const totalAmount = cartItems.reduce((acc, item) => {
      const product = productsFromDb.find((p) => p.id === item.id)!;
      return acc + product.price.toNumber() * item.quantity;
    }, 0);

    // 4. Create the Order in a Database Transaction
    const orderItemsCreateData = cartItems.map((item) => {
      const product = productsFromDb.find((p) => p.id === item.id)!;
      return {
        productId: item.id,
        quantity: item.quantity,
        priceAtPurchase: product.price,
      };
    });

    const newOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId,
          totalAmount,
          shippingAddressJson: { ...shippingAddress, country: shippingAddress.country.name },
          status: 'PENDING',
          items: {
            create: orderItemsCreateData,
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
      return order;
    });

    // 5. Prepare for Stripe (Milestone 4)
    const stripeSession = await createStripeCheckoutSession(newOrder, user);

    // TODO: MILESTONE 4 - Update the order with the real Stripe Session ID
    console.log(
      `[STUB] Would update Order ${newOrder.id} with Stripe Session ID: ${stripeSession.stripeSessionId}`
    );

    return NextResponse.json(
      { orderId: newOrder.id, checkoutUrl: stripeSession.url },
      { status: 201 }
    );
  } catch (error) {
    console.error('Order creation failed:', error);
    return NextResponse.json(
      { message: 'Internal server error during order creation' },
      { status: 500 }
    );
  }
}
