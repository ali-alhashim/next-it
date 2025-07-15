// app/api/users/me/router.ts
import { NextResponse, NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { getServerSession } from 'next-auth'; // Import getServerSession
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  // Get the user session using getServerSession
  const session = await getServerSession(authOptions);

  // Check if the user is authenticated and if badgeNumber exists in the session
  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ error: 'Not logged in or badge number not found in session' }, { status: 401 });
  }

  const badgeNumber = session.user.email; // Get badgeNumber from the session
  console.log(`the badgeNumber is: ${badgeNumber}`);

  try {
    const db = await connectDB();
    const user = await db.collection('users').findOne({ badgeNumber });

    if (!user) {
      // This case should ideally not happen if the badgeNumber in the session is valid,
      // but it's good for robustness.
      return NextResponse.json({ error: 'User not found in database' }, { status: 404 });
    }

    return NextResponse.json({
      name: user.name,
      email: user.email,
      badgeNumber: user.badgeNumber,
      photo:user.photo,
      role:user.role
    });
  } catch (error) {
    console.error('Database error:', error); // Log the error for debugging
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

