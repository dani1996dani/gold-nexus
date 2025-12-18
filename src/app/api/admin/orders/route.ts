import { NextResponse } from 'next/server';
import { withAdminAuth, AdminApiHandler } from '@/lib/admin-auth';
import { getOrders } from '@/lib/data/orders';

const getOrdersHandler: AdminApiHandler = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    const ordersData = await getOrders(page, limit);

    return NextResponse.json(ordersData);
  } catch (error) {
    console.error('[API/ADMIN/ORDERS] Error fetching orders:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
};

export const GET = withAdminAuth(getOrdersHandler);
