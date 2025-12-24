import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { shippingSchema } from '@/lib/zod-schemas/shippingSchema';
import { getUserIdFromToken } from '@/lib/jwt';

import { stripe } from '@/lib/stripe';

const cartItemSchema = z.object({
  id: z.string().uuid(),
  quantity: z.number().min(1),
});

const orderCreationSchema = z.object({
  shippingAddress: shippingSchema,
  cartItems: z.array(cartItemSchema).min(1),
});

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

    // 4. Create Stripe PaymentIntent
    // Stripe expects amount in cents
    const amountInCents = Math.round(totalAmount * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      metadata: {
        userId: userId,
        userEmail: user.email,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // 5. Create the Order in a Database Transaction
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
          shippingAddressJson: { ...shippingAddress, country: shippingAddress.country?.name ?? '' },
          status: 'UNPAID',
          stripePaymentIntentId: paymentIntent.id,
          items: {
            create: orderItemsCreateData,
          },
        },
      });
      return order;
    });

    // 6. Return clientSecret for frontend
    return NextResponse.json(
      {
        orderId: newOrder.id,
        displayId: newOrder.displayId,
        clientSecret: paymentIntent.client_secret,
      },
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
