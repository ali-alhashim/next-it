// src/app/api/users/[badgeNumber]/route.ts
import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';

export async function GET(req: NextRequest, { params }: { params: { badgeNumber: string } }) {
  const badgeNumber = params.badgeNumber;
  console.log("open user Detail for badgeNumber"+badgeNumber);
  try {
    const db = await connectDB();

    const user = await db.collection('users').findOne(
      { badgeNumber: badgeNumber },
      { projection: { password: 0 } } // exclude password or sensitive data
    );

    if (!user) {
      return new Response('User not found', { status: 404 });
    }

    return Response.json(user);
  } catch (error) {
    console.error('[API] Failed to fetch user:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
