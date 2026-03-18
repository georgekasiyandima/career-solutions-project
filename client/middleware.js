import { NextResponse } from 'next/server';

export function middleware(request) {
  // Admin routes protection will be handled client-side
  // This middleware can be extended for server-side auth checks if needed
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/profile',
  ],
};

