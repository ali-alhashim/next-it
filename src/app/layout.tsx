// src/app/layout.tsx

import { seedAdminUser } from '@/lib/seedAdmin';


export default async function RootLayout({ children }: { children: React.ReactNode }) {
  await seedAdminUser();

  return (
    <html lang="en">
      <body>
        {children}
        </body>
    </html>
  );
}
