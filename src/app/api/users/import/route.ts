//src/app/api/users/import

import { NextRequest , NextResponse} from "next/server";
import { connectDB } from '@/lib/mongodb';


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
       }
       catch(err){
    

    }


}