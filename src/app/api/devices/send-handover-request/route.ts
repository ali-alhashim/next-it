//src/app/api/devices/send-handover-request/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { serialNumber, badgeNumber, handoverDate, note } = body;

    if (!serialNumber || !badgeNumber || !handoverDate) {
      return NextResponse.json(
        { message: 'Missing required fields: serialNumber, badgeNumber, handoverDate' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
     const db = await connectDB();
     const devicesCollection = db.collection('devices');

    // Update the specific user's handoverDate and note inside the users array for the device with serialNumber
    const result = await devicesCollection.updateOne(
      {
        serialNumber,
        'users.badgeNumber': badgeNumber,
         'users.handoverDate': { $in: [null, '','NULL'] }, // match handoverDate either null or empty string
      },
      {
        $set: {
          'users.$.handoverDate': new Date(handoverDate),
          ...(note !== undefined && { 'users.$.note': note }),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: 'Device or user not found, or handover already completed.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Handover request processed successfully' });
  } catch (error) {
    console.error('Error in send-handover-request:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
