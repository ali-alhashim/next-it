// src/app/api/devices/[serialNumber]/route.ts
import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const pathnameParts = url.pathname.split('/');
    const serialNumber = pathnameParts[pathnameParts.length - 1];

    const db = await connectDB();
    const device = await db.collection('devices').findOne({ serialNumber });

    if (!device) {
      return new Response(JSON.stringify({ error: 'Device not found' }), { status: 404 });
    }

    return new Response(JSON.stringify(device), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
