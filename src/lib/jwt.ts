import fs from 'fs';
import path from 'path';
import * as jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { User } from '@/generated/prisma/client';

interface JwtKeys {
  privateKey: string;
  publicKey: string;
}

// Cache keys in memory
let keys: JwtKeys | null = null;

export function getJwtKeys(): JwtKeys {
  if (keys) {
    return keys;
  }

  if (process.env.NODE_ENV === 'production') {
    if (!process.env.JWT_PRIVATE_KEY || !process.env.JWT_PUBLIC_KEY) {
      throw new Error('JWT keys must be set in production environment');
    }
    keys = {
      privateKey: process.env.JWT_PRIVATE_KEY.replace(/\\n/g, '\n'),
      publicKey: process.env.JWT_PUBLIC_KEY.replace(/\\n/g, '\n'),
    };
  } else {
    keys = {
      privateKey: fs.readFileSync(path.join(process.cwd(), 'private_key.pem'), 'utf8'),
      publicKey: fs.readFileSync(path.join(process.cwd(), 'public_key.pem'), 'utf8'),
    };
  }
  return keys;
}

export function createAndSetSession(user: Omit<User, 'password'>) {
  const { privateKey } = getJwtKeys();
  const { id: userId, role } = user;

  const accessToken = jwt.sign({ userId, role }, privateKey, {
    algorithm: 'RS256',
    expiresIn: '15m',
  });

  const refreshToken = jwt.sign({ userId, role }, privateKey, {
    algorithm: 'RS256',
    expiresIn: '30d',
  });

  const response = NextResponse.json({
    message: 'Authentication successful',
    user: { fullName: user.fullName, email: user.email, role: user.role },
  });

  response.cookies.set('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 15, // 15 minutes
  });

  response.cookies.set('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  return response;
}

export async function getUserIdFromToken(): Promise<string | null> {
  const token = (await cookies()).get('accessToken')?.value;
  if (!token) {
    return null;
  }
  try {
    const { publicKey } = getJwtKeys();
    const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] }) as { userId: string };
    return decoded.userId ?? null;
  } catch (error) {
    // This will catch expired tokens or invalid signatures
    // @ts-expect-error just an error bro
    console.error('Failed to verify access token:', error.name);
    return null;
  }
}
