import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const publicRoutes = ['/login', '/register', '/'];
const apiAuthRoutes = ['/api/auth/login', '/api/auth/register', '/api/auth/check', '/api/auth/logout'];

export function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('auth_token')?.value;

    // Allow public routes
    if (publicRoutes.includes(pathname)) {
      return NextResponse.next();
    }

    // Allow auth API routes
    if (apiAuthRoutes.includes(pathname)) {
      return NextResponse.next();
    }

    // Protect dashboard routes - check token
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/api/')) {
      if (!token) {
        if (pathname.startsWith('/api/')) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.redirect(new URL('/login', request.url));
      }

      try {
        jwt.verify(token, JWT_SECRET);
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
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
