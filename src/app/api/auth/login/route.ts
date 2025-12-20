// app/api/auth/login/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import * as argon2 from 'argon2';
import { createAndSetSession } from '@/lib/jwt'; // 1. Import our new utility

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const passwordIsValid = await argon2.verify(user.password, password);

    if (!passwordIsValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    return createAndSetSession(user);
  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
