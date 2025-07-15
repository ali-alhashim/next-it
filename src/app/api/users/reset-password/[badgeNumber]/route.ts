// src/app/api/users/reset-password/[badgeNumber]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const badgeNumber = req.nextUrl.pathname.split('/').pop(); // extract from URL
    const { password } = await req.json();

    if (!password || !badgeNumber) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const db = await connectDB();

    const result = await db.collection('users').updateOne(
      { badgeNumber },
      { $set: { password: hashedPassword } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Reset Password Error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
