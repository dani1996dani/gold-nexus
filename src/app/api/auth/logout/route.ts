// app/api/auth/logout/route.ts

import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // To log out, we create a response and overwrite the cookies with empty values
    // and set their maxAge to 0, which tells the browser to expire them immediately.
    const response = NextResponse.json({ message: 'Logout successful' }, { status: 200 });

    response.cookies.set('accessToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 0, // Expire immediately
    });

    response.cookies.set('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 0, // Expire immediately
    });

    return response;
  } catch (error) {
    console.error('Logout Error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
