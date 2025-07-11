//src/app/api/users/reset-password/[badgeNumber]/route.ts

import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest, { params }: { params: { badgeNumber: string } }) {
  try {
    const { badgeNumber } = params;
    const { password } = await req.json();

    if (!password || !badgeNumber) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const db = await connectDB();

    const result = await db.collection('users').updateOne(
      { badgeNumber },
      { $set: { password: hashedPassword } }
    );

    if (result.modifiedCount === 0) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    return new Response(JSON.stringify({ success: true }));
  } catch (err) {
    console.error('Reset Password Error:', err);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}