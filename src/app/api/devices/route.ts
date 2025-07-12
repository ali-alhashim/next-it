//src/app/api/devices



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
    const devicesCol = db.collection('devices');

    // Build search filter (case-insensitive)
    const filter = search
      ? {
          $or: [
            { serialNumber: { $regex: search, $options: 'i' } },
            { category: { $regex: search, $options: 'i' } },
            { badgeNumber: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const total = await devicesCol.countDocuments(filter);

    const devices = await devicesCol
      .find(filter)
      .sort({ [sortField]: sortOrder })
      .skip(page * pageSize)
      .limit(pageSize)
      .project({ password: 0 }) // exclude password
      .toArray();

    // Add `id` field 
    const cleanDevices = devices.map((device) => ({
      id: device._id.toString(),
      serialNumber: device.serialNumber,
      category: device.category,
    }));

    return NextResponse.json({ devices: cleanDevices, total });
  } catch (error) {
    console.error('[API] Failed to fetch devices:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

