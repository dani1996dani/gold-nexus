import { NextRequest, NextResponse } from 'next/server';
import * as jwt from 'jsonwebtoken';
import { getJwtKeys } from './jwt';
import { prisma } from './db';
import { Role } from '@/generated/prisma/client';
import { User } from '@/generated/prisma/client';

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
    const token = (await req.cookies).get('accessToken')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
    }

    try {
      const { publicKey } = getJwtKeys();
      const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] }) as { userId: string; role: Role };

      // 1. Check if the token payload has the ADMIN role.
      if (!decoded || !decoded.userId || decoded.role !== Role.ADMIN) {
        return NextResponse.json({ message: 'Forbidden: Insufficient privileges' }, { status: 403 });
      }

      // 2. Double-check against the database to ensure the user still exists and is an admin.
      const admin = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!admin || admin.role !== Role.ADMIN) {
        return NextResponse.json({ message: 'Forbidden: Admin user not found or role has changed' }, { status: 403 });
      }
      
      // Remove password before passing to the handler
      const { password, ...adminWithoutPassword } = admin;

      // 3. If all checks pass, call the original handler with the admin user object.
      return handler(req, { ...context, admin: adminWithoutPassword });
    } catch (error) {
      // This will catch expired tokens or invalid signatures
      if (error instanceof jwt.JsonWebTokenError) {
        return NextResponse.json({ message: `Unauthorized: ${error.message}` }, { status: 401 });
      }
      console.error('Admin auth middleware error:', error);
      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
  };
}
