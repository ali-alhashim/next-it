//src/app/api/devices/new/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from '@/lib/mongodb';   

export async function POST(req: NextRequest) {

     const formData = await req.formData();

     const serialNumber = formData.get('serialNumber') as string;
     const category = formData.get('category') as string;
     const model = formData.get('model') as string;
     const description = formData.get('description') as string;
     const manufacture = formData.get('manufacture') as string;
     const invoiceNumber = formData.get('invoiceNumber') as string;
     const supplier = formData.get('supplier') as string;
     const status = formData.get('status') as string;

     // ✅ Validate inputs
  if (!serialNumber || !category) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const db = await connectDB();

  //check there is no serial Number exist !
  const existing = await db.collection('devices').findOne({ serialNumber });
  if (existing) {
    return NextResponse.json({ error: 'Serial Number already exists' }, { status: 409 });
  }

  await db.collection('devices').insertOne({
    serialNumber,
    category,
    model,
    description,
    manufacture,
    invoiceNumber,
    supplier,
    status,
    createdAt: new Date(),
  });

   return NextResponse.json({ message: 'Device created successfully' });
}