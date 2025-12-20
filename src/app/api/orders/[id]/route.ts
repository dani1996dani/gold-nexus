import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserIdFromToken } from '@/lib/jwt';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await getUserIdFromToken();
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
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
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    // Security Check: Ensure the order belongs to the requesting user
    if (order.userId !== userId) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Serialize Decimal
    const serializedOrder = {
      ...order,
      totalAmount: order.totalAmount.toString(),
      items: order.items.map((item) => ({
        ...item,
        priceAtPurchase: item.priceAtPurchase.toString(),
      })),
    };

    return NextResponse.json(serializedOrder);
  } catch (error) {
    console.error('[API/ORDERS/[ID]] Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
