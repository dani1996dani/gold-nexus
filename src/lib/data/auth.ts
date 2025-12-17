import { cookies } from 'next/headers';
import * as jwt from 'jsonwebtoken';
import { getJwtKeys } from '@/lib/jwt';
import { prisma } from '@/lib/db';
import { Role, User } from '@/generated/prisma/client';
import { NextRequest } from 'next/server';

/**
 * A centralized function to get the authenticated admin user from the request cookie.
 * This can be used by both Server Components (which don't have a request object) 
 * and API routes (which do).
 * @param req Optional NextRequest object from an API route.
 * @returns The admin user object (without password) or null if not authenticated or not an admin.
 */
export async function getAuthenticatedAdmin(req?: NextRequest): Promise<Omit<User, 'password'> | null> {
  let token: string | undefined;

  if (req) {
    token = (await req.cookies).get('accessToken')?.value;
  } else {
    // We must be in a Server Component, so we can use next/headers
    token = (await cookies()).get('accessToken')?.value;
  }

  if (!token) {
    return null;
  }

  try {
    const { publicKey } = getJwtKeys();
    const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] }) as { userId: string; role: Role };

    if (decoded.role !== Role.ADMIN) {
      return null;
    }

    const admin = await prisma.user.findUnique({
      where: { id: decoded.userId, role: Role.ADMIN },
    });
    
    if (!admin) {
        return null;
    }
    
    const { password, ...adminWithoutPassword } = admin;
    return adminWithoutPassword;

  } catch (error) {
    // This will catch expired tokens, invalid signatures, etc.
    console.error('Auth check failed:', error);
    return null;
  }
}
