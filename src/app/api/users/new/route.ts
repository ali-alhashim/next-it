//src/app/api/users/new/route.ts
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { mkdirSync, existsSync } from 'fs';


import { connectDB } from '@/lib/mongodb';   
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  // ✅ Auth check
  // get current user and check his role if admin ok he can create user if not return 

  // ✅ Parse form data
  const formData = await req.formData();
  const name = formData.get('name') as string;
  const badgeNumber = formData.get('badgeNumber') as string;
  const email = formData.get('email') as string;
  const role = formData.get('role') as string;
  const password = formData.get('password') as string;
  const photoFile = formData.get('photo') as File | null;

  // ✅ Validate inputs
  if (!name || !badgeNumber || !email || !role || !password) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  let photoPath = '';

  // ✅ Handle photo upload
  if (photoFile) {
    const bytes = await photoFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadsDir = path.join(process.cwd(), 'uploads');

    // Create uploads folder if not exists
    if (!existsSync(uploadsDir)) {
      mkdirSync(uploadsDir);
    }

    const fileName = `${Date.now()}-${photoFile.name}`;
    const filePath = path.join(uploadsDir, fileName);
    await fs.writeFile(filePath, buffer);

    photoPath = `/uploads/${fileName}`;
  }

  // ✅ Save user to DB
  const db = await connectDB();
  const existing = await db.collection('users').findOne({ badgeNumber });
  if (existing) {
    return NextResponse.json({ error: 'Badge number already exists' }, { status: 409 });
  }

  await db.collection('users').insertOne({
    name,
    badgeNumber,
    email,
    role,
    password: hashedPassword,
    photo: photoPath,
    createdAt: new Date(),
  });

  return NextResponse.json({ message: 'User created successfully' });
}
