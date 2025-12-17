import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/generated/prisma/client';
import { getAuthenticatedAdmin } from './data/auth';

// Define a new type for our handler that includes the authenticated admin user
export type AdminApiHandler = (
  req: NextRequest,
  context: { params: Promise<any>; admin: Omit<User, 'password'> }
) => Promise<NextResponse | Response>;

/**
 * A Higher-Order Function to protect API routes and ensure the user is an admin.
 * @param handler The API route handler to protect.
 * @returns A new handler that performs authentication and authorization checks.
 */
export function withAdminAuth(handler: AdminApiHandler) {
  return async (req: NextRequest, context: { params: Promise<any> }) => {
    const admin = await getAuthenticatedAdmin(req);

    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    return handler(req, { ...context, admin });
  };
}
