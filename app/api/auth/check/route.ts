import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    console.log('[v0] Auth check - Token present:', !!token);

    if (!token) {
      console.log('[v0] No auth token found');
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Verify token
    try {
      jwt.verify(token, JWT_SECRET);
      console.log('[v0] Token verified successfully');
      return NextResponse.json({ authenticated: true }, { status: 200 });
    } catch (verifyError) {
      console.error('[v0] Token verification failed:', verifyError);
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
  } catch (error) {
    console.error('[v0] Auth check error:', error);
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
