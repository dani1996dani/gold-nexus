import { NextResponse } from 'next/server';
import { withAdminAuth, AdminApiHandler } from '@/lib/admin-auth';
import { getOrderById } from '@/lib/data/orders';

const getOrderByIdHandler: AdminApiHandler = async (req, context) => {
  try {
    const { params: paramsPromise } = context;
    const { id } = await paramsPromise;

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ message: 'Invalid order ID' }, { status: 400 });
    }

    const order = await getOrderById(id);

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error(`[API/ADMIN/ORDERS/[id]] Error fetching order:`, error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
};

export const GET = withAdminAuth(getOrderByIdHandler);
