// src/app/api/users/[badgeNumber]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';

export async function GET(req: NextRequest) {
  const badgeNumber = req.nextUrl.pathname.split('/').pop(); // get badgeNumber from URL

  if (!badgeNumber) {
    return new NextResponse('Missing badge number', { status: 400 });
  }

  console.log("open user Detail for badgeNumber " + badgeNumber);

  try {
    const db = await connectDB();

    const user = await db.collection('users').findOne(
      { badgeNumber },
      { projection: { password: 0 } } // exclude password
    );

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('[API] Failed to fetch user:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
