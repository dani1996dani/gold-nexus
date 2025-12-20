// app/api/auth/register/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import * as argon2 from 'argon2';
import { createAndSetSession } from '@/lib/jwt'; // 1. Import our new utility

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, fullName, country, phoneNumber } = body;

    if (!email || !password || !fullName || !country || !phoneNumber) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
    }

    const hashedPassword = await argon2.hash(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        country,
        phoneNumber,
      },
    });

    const sessionResponse = createAndSetSession(user);

    // We want to return a 201 Created status, so we'll just update the status on the response
    return new NextResponse(sessionResponse.body, {
      status: 201,
      headers: sessionResponse.headers,
    });
  } catch (error) {
    console.error('Registration Error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
