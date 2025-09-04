// middleware.ts
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // Admin route protection
    if (req.nextUrl.pathname.startsWith('/admin')) {
      const token = req.nextauth.token;
      if (token?.role !== 'admin') {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }
    
    // Account route protection
    if (req.nextUrl.pathname.startsWith('/account')) {
      const token = req.nextauth.token;
      if (!token) {
        return NextResponse.redirect(new URL('/login', req.url));
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    '/admin/:path*',
    '/account/:path*',
    '/checkout',
    '/api/orders',
    '/api/cart',
  ],
};