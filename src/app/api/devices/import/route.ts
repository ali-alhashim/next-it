//src/app/api/devices/import

import { NextRequest , NextResponse} from "next/server";
import { connectDB } from '@/lib/mongodb';
import { parse } from 'csv-parse/sync';

export const runtime = 'nodejs'; // ensure edge functions don’t interfere

export async function POST(req: NextRequest) {

     const contentType = req.headers.get('content-type') || '';

     if (!contentType.includes('multipart/form-data')) 
        {
          return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
        }


    const formData = await req.formData();
    const file = formData.get('csv') as File;

    if(!file) 
    {
     return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }


    const arrayBuffer = await file.arrayBuffer();
    const text = new TextDecoder().decode(arrayBuffer);

    try{
         const db = await connectDB();

           const records = parse(text, {
                                  columns: true,
                                  skip_empty_lines: true,
                                 });

                                   // Validate and map fields
    const devices = records.map((row: any) => ({
      serialNumber: row['serialNumber']?.trim(),
      category: row['category']?.trim(),
      model: row['model']?.trim(),
      description: row['description']?.trim(),
      manufacture: row['manufacture']?.trim(),
      status: row['status']?.trim(),
      createdAt: new Date(),
    }));

    //insure the serialNumber not exist before insert if exist skip the line
     
    const devicesToInsert = [];

    for (const device of devices) {
      const exists = await db.collection('devices').findOne({ serialNumber: device.serialNumber });
      if (!exists) {
        devicesToInsert.push(device);
      }
    }

    if (devicesToInsert.length > 0) {
      await db.collection('devices').insertMany(devicesToInsert);
    }

     
    return NextResponse.json({ success: true, count: devices.length });

       }
       catch(err){
       console.error('CSV Parse Error:', err);
       return NextResponse.json({ error: 'Failed to parse CSV' }, { status: 400 });
    }


}