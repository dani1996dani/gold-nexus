import { NextResponse } from 'next/server';
import { withAdminAuth, AdminApiHandler } from '@/lib/admin-auth';
import { getOrderById } from '@/lib/data/orders';
import { prisma } from '@/lib/db';
import { OrderStatus } from '@/generated/prisma/client';

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

const updateOrderHandler: AdminApiHandler = async (req, context) => {
    try {
      const { params: paramsPromise } = context;
      const { id } = await paramsPromise;
      const body = await req.json();
      const { status } = body;
  
      if (!id || typeof id !== 'string') {
        return NextResponse.json({ message: 'Invalid order ID' }, { status: 400 });
      }
  
      // Validate the status against the OrderStatus enum
      const isValidStatus = Object.values(OrderStatus).includes(status);
      if (!status || !isValidStatus) {
        return NextResponse.json({ message: 'Invalid status provided' }, { status: 400 });
      }
  
      const updatedOrder = await prisma.order.update({
        where: { id },
        data: { status },
      });
  
      // Fetch the updated order with full details to return
      const fullyUpdatedOrder = await getOrderById(updatedOrder.id);

      return NextResponse.json(fullyUpdatedOrder);
    } catch (error) {
      console.error(`[API/ADMIN/ORDERS/[id]] Error updating order:`, error);
      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
  };

export const GET = withAdminAuth(getOrderByIdHandler);
export const PUT = withAdminAuth(updateOrderHandler);
