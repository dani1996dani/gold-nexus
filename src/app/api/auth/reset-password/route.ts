import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import * as argon2 from 'argon2';

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ message: 'Token and new password are required' }, { status: 400 });
    }

    // 1. Find user with valid token and not expired
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpires: {
          gt: new Date(), // Must be greater than current time
        },
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'Invalid or expired reset token' }, { status: 400 });
    }

    // 2. Hash new password
    const hashedPassword = await argon2.hash(password);

    // 3. Update user and clear token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpires: null,
      },
    });

    return NextResponse.json({ message: 'Password has been reset successfully.' });
  } catch (error) {
    console.error('[API/AUTH/RESET-PASSWORD] Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
