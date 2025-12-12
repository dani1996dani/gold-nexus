// lib/session.ts

import { NextResponse } from 'next/server';
import * as jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { User, Role } from '@/../src/generated/prisma/client'; // Import the User and Role types from Prisma

// Load the keys once and reuse them
const privateKey =
  process.env.NODE_ENV === 'production'
    ? process.env.JWT_PRIVATE_KEY!
    : fs.readFileSync(path.join(process.cwd(), 'private_key.pem'), 'utf8');

// We only need the user's ID and role for the token payload
type UserPayload = Pick<User, 'id' | 'role'>;

export function createAndSetSession(user: UserPayload) {
  if (!privateKey) {
    throw new Error('Private key is not available for session creation');
  }

  // 1. Create the tokens
  const accessToken = jwt.sign({ userId: user.id, role: user.role }, privateKey, {
    algorithm: 'RS256',
    expiresIn: '15m',
  });

  const refreshToken = jwt.sign({ userId: user.id }, privateKey, {
    algorithm: 'RS256',
    expiresIn: '7d',
  });

  // 2. Create the response and set the cookies
  const response = NextResponse.json({ message: 'Authentication successful' }, { status: 200 });

  response.cookies.set('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 15,
  });

  response.cookies.set('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
