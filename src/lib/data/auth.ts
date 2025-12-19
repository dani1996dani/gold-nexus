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
 * @param options Configuration options.
 * @returns The admin user object (without password) or null if not authenticated or not an admin.
 */
export async function getAuthenticatedAdmin(
  req?: NextRequest, 
  options: { allowRefresh?: boolean } = { allowRefresh: false }
): Promise<Omit<User, 'password'> | null> {
  let accessToken: string | undefined;
  let refreshToken: string | undefined;

  if (req) {
    accessToken = (await req.cookies).get('accessToken')?.value;
    refreshToken = (await req.cookies).get('refreshToken')?.value;
  } else {
    // We must be in a Server Component, so we can use next/headers
    const cookieStore = await cookies();
    accessToken = cookieStore.get('accessToken')?.value;
    refreshToken = cookieStore.get('refreshToken')?.value;
  }

  const { publicKey } = getJwtKeys();

  // 1. Try Access Token
  if (accessToken) {
    try {
      const decoded = jwt.verify(accessToken, publicKey, { algorithms: ['RS256'] }) as { userId: string; role: Role };
      if (decoded.role === Role.ADMIN) {
        return await fetchAdminUser(decoded.userId);
      }
    } catch (error) {
      // Access token invalid/expired. Fall through to refresh token check if allowed.
    }
  }

  // 2. Try Refresh Token (Fallback)
  if (options.allowRefresh && refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, publicKey, { algorithms: ['RS256'] }) as { userId: string; role: Role };
      if (decoded.role === Role.ADMIN) {
        return await fetchAdminUser(decoded.userId);
      }
    } catch (error) {
      console.error('Refresh token auth check failed:', error);
    }
  }

  return null;
}

async function fetchAdminUser(userId: string) {
  try {
    const admin = await prisma.user.findUnique({
      where: { id: userId, role: Role.ADMIN },
    });
    
    if (!admin) {
        return null;
    }
    
    const { password, ...adminWithoutPassword } = admin;
    return adminWithoutPassword;
  } catch (error) {
    console.error('Database auth fetch failed:', error);
    return null;
  }
}
