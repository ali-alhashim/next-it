import { seedAdminUser } from '@/lib/seedAdmin';

export async function GET() {
  await seedAdminUser();
  return new Response('Seeding complete', { status: 200 });
}