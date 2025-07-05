// src/lib/seedAdmin.ts
import { connectDB } from './mongodb'; 
import bcrypt from 'bcryptjs';

export async function seedAdminUser() {
  const db = await connectDB();
  const users = db.collection('users');

  const existing = await users.findOne({ badgeNumber: '0000' });

  if (!existing) {
    const hashedPassword = await bcrypt.hash('admin', 10);
    await users.insertOne({
      badgeNumber: '0000',
      name: 'Administrator',
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date(),
    });
    console.log('[Seed] Admin user created');
  } else {
    console.log('[Seed] Admin already exists');
  }
}
