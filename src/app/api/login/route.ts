// app/api/login/route.ts
import { connectDB } from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  const { badgeNumber, password } = await req.json();

  if (!badgeNumber || !password) {
    return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
  }

  const db = await connectDB();
  const user = await db.collection('users').findOne({ badgeNumber });

  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  const match = await bcrypt.compare(password, user.passwordHash);

  if (!match) {
    return NextResponse.json({ message: 'Incorrect password' }, { status: 401 });
  }

  // Todo: set session/cookie here
  console.log("Login Success")
  return NextResponse.json({ success: true });
}
