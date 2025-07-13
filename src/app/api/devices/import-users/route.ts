import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { parse } from 'csv-parse/sync';
import { Document, PushOperator } from 'mongodb';

export const runtime = 'nodejs';

interface DeviceUser {
  badgeNumber: string;
  receivedDate: string;
  handoverDate: string;
  note: string;
  createdAt: Date;
}

interface Device extends Document {
  serialNumber: string;
  users: DeviceUser[];
}

export async function POST(req: NextRequest) {
  const contentType = req.headers.get('content-type') || '';
  if (!contentType.includes('multipart/form-data')) {
    return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
  }

  const formData = await req.formData();
  const file = formData.get('csv') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const text = new TextDecoder().decode(arrayBuffer);

  try {
    const db = await connectDB();
    const devicesCollection = db.collection<Device>('devices');

    const records = parse(text, {
      columns: true,
      skip_empty_lines: true,
    });

    // Include serialNumber temporarily for filtering, will remove before $push
    const deviceUsers = records.map((row: any) => ({
      serialNumber: row['serialNumber']?.trim(),
      badgeNumber: row['badgeNumber']?.trim(),
      receivedDate: row['receivedDate']?.trim(),
      handoverDate: row['handoverDate']?.trim(),
      note: row['note']?.trim(),
      createdAt: new Date(),
    }));

    let addedCount = 0;

    for (const user of deviceUsers) {
      if (!user.serialNumber || !user.badgeNumber) continue;

      // Check if user with this badgeNumber already exists in device
      const exists = await devicesCollection.findOne({
        serialNumber: user.serialNumber,
        "users.badgeNumber": user.badgeNumber,
      });
      if (exists) continue; // skip duplicates

      const { serialNumber, ...userData } = user;

      const result = await devicesCollection.updateOne(
        { serialNumber },
        {
          $push: {
            users: userData,
          } as unknown as PushOperator<Device>,
        }
      );

      if (result.modifiedCount > 0) {
        addedCount++;
      }
    }

    return NextResponse.json({ success: true, addedCount });
  } catch (err) {
    console.error('Import error:', err);
    return NextResponse.json({ error: 'Failed to import users' }, { status: 400 });
  }
}
