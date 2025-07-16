// lib/init.ts
let seeded = false;

import { seedAdminUser } from './seedAdmin';

export async function ensureSeeded() {
  if (!seeded) {
    await seedAdminUser(); // runs only once per runtime
    seeded = true;
  }
}
