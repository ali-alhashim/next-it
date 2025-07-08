// src/app/api/users/route.ts

import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb'; 

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get('page') || '0');
  const pageSize = parseInt(searchParams.get('pageSize') || '20');

  try {
    const db = await connectDB();

    const total = await db.collection('users').countDocuments();
    const users = await db
      .collection('users')
      .find({})
      .skip(page * pageSize)
      .limit(pageSize)
      .project({ password: 0 }) // exclude password for safety
      .toArray();

    return Response.json({ users, total });
  } catch (error) {
    console.error('[API] Failed to fetch users:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
