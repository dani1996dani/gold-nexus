// app/api/auth/refresh/route.ts
import { NextRequest, NextResponse } from 'next/server';
import * as jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { getJwtKeys } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;

    if (!refreshToken) {
      return NextResponse.json({ error: 'No refresh token provided' }, { status: 401 });
    }

    const { privateKey, publicKey } = getJwtKeys();

    let decoded;
    try {
      // 1. Verify the refresh token is valid and not expired
      decoded = jwt.verify(refreshToken, publicKey, { algorithms: ['RS256'] }) as {
        userId: string;
        role: string;
      };
    } catch (err) {
      // If verification fails, the token is invalid or expired
      return NextResponse.json({ error: 'Invalid or expired refresh token' }, { status: 401 });
    }

    // 2. If valid, issue a new access token AND a new refresh token (Rolling Session)
    const newAccessToken = jwt.sign({ userId: decoded.userId, role: decoded.role }, privateKey, {
      algorithm: 'RS256',
      expiresIn: '15m',
    });

    const newRefreshToken = jwt.sign({ userId: decoded.userId, role: decoded.role }, privateKey, {
      algorithm: 'RS256',
      expiresIn: '30d',
    });

    // 3. Send the new tokens back
    const response = NextResponse.json(
      { message: 'Token refreshed successfully' },
      { status: 200 }
    );

    response.cookies.set('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 15, // 15 minutes
    });

    response.cookies.set('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (error) {
    console.error('Refresh Token Error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
