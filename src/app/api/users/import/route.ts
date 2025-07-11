//src/app/api/users/import

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
    const users = records.map((row: any) => ({
      name: row['Name']?.trim(),
      badgeNumber: row['Badge Number']?.trim(),
      email: row['Email']?.trim(),
      role: row['Role']?.trim(),
    }));

    //insure the badge number not exist before insert if exist skip the line
     
    const usersToInsert = [];

    for (const user of users) {
      const exists = await db.collection('users').findOne({ badgeNumber: user.badgeNumber });
      if (!exists) {
        usersToInsert.push(user);
      }
    }

    if (usersToInsert.length > 0) {
      await db.collection('users').insertMany(usersToInsert);
    }

     
    return NextResponse.json({ success: true, count: users.length });

       }
       catch(err){
       console.error('CSV Parse Error:', err);
       return NextResponse.json({ error: 'Failed to parse CSV' }, { status: 400 });
    }


}