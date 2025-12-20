// app/api/users/me/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserIdFromToken } from '@/lib/jwt';

export async function GET() {
  try {
    const userId = await getUserIdFromToken();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized: No or invalid token' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        // Explicitly select fields to exclude password
        id: true,
        email: true,
        fullName: true,
        country: true,
        phoneNumber: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        orders: {
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc', // Show most recent orders first
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Get User Error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
