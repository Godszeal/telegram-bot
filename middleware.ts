import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const publicRoutes = ['/login', '/register', '/', '/api/auth/login', '/api/auth/register'];

export function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('auth_token')?.value;

    console.log('[v0] Middleware check for:', pathname, 'Token:', !!token);

    // Allow public routes and auth endpoints
    if (publicRoutes.includes(pathname)) {
      console.log('[v0] Public route, allowing access');
      return NextResponse.next();
    }

    // For dashboard and protected API routes
    if (pathname.startsWith('/dashboard') || (pathname.startsWith('/api/') && !publicRoutes.includes(pathname))) {
      if (!token) {
        console.log('[v0] No token found, redirecting to login');
        if (pathname.startsWith('/api/')) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.redirect(new URL('/login', request.url));
      }

      // Verify token
      try {
        jwt.verify(token, JWT_SECRET);
        console.log('[v0] Token verified, allowing access');
        return NextResponse.next();
      } catch (error) {
        console.error('[v0] Token verification failed:', error);
        if (pathname.startsWith('/api/')) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error('[v0] Middleware error:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.well-known).*)',
  ],
};
