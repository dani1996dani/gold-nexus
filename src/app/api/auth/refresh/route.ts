// app/api/auth/refresh/route.ts
import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import * as jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;

    if (!refreshToken) {
      return NextResponse.json({ error: 'No refresh token provided' }, { status: 401 });
    }

    // Load keys conditionally
    const privateKey = process.env.NODE_ENV === 'production'
      ? process.env.JWT_PRIVATE_KEY!
      : fs.readFileSync(path.join(process.cwd(), 'private_key.pem'), 'utf8');

    const publicKey = process.env.NODE_ENV === 'production'
      ? process.env.JWT_PUBLIC_KEY!
      : fs.readFileSync(path.join(process.cwd(), 'public_key.pem'), 'utf8');

    let decoded;
    try {
      // 1. Verify the refresh token is valid and not expired
      decoded = jwt.verify(refreshToken, publicKey, { algorithms: ['RS256'] }) as { userId: string, role: string };
    } catch (err) {
      // If verification fails, the token is invalid or expired
      return NextResponse.json({ error: 'Invalid or expired refresh token' }, { status: 401 });
    }

    // 2. If valid, issue a new access token
    const newAccessToken = jwt.sign(
      { userId: decoded.userId, role: decoded.role }, // Carry over the user info
      privateKey,
      { algorithm: 'RS256', expiresIn: '15m' }
    );

    // 3. Send the new access token back
    const response = NextResponse.json({ message: 'Token refreshed successfully' }, { status: 200 });
    response.cookies.set('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 15, // 15 minutes
    });

    return response;

  } catch (error) {
    console.error('Refresh Token Error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}