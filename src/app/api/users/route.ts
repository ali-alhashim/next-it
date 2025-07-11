// src/app/api/users/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get('page') || '0');
  const pageSize = parseInt(searchParams.get('pageSize') || '20');
  const search = searchParams.get('search')?.trim() || '';
  const sortField = searchParams.get('sortField') || 'name';
  const sortOrder = searchParams.get('sortOrder') === 'desc' ? -1 : 1;

  try {
    const db = await connectDB();
    const usersCol = db.collection('users');

    // Build search filter (case-insensitive)
    const filter = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { badgeNumber: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const total = await usersCol.countDocuments(filter);

    const users = await usersCol
      .find(filter)
      .sort({ [sortField]: sortOrder })
      .skip(page * pageSize)
      .limit(pageSize)
      .project({ password: 0 }) // exclude password
      .toArray();

    // Add `id` field and fallback photo
    const cleanUsers = users.map((user) => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      badgeNumber: user.badgeNumber,
      role: user.role,
      photo: user.photo || 'uploads/default.png',
    }));

    return NextResponse.json({ users: cleanUsers, total });
  } catch (error) {
    console.error('[API] Failed to fetch users:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

