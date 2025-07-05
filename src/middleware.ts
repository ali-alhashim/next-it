// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const isProtected = req.nextUrl.pathname.startsWith('/main');

  if (!token && isProtected) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

// Apply middleware only to protected paths
export const config = {
  matcher: ['/main/:path*'],
};
