import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Verify token
    jwt.verify(token, JWT_SECRET);

    return NextResponse.json({ authenticated: true }, { status: 200 });
  } catch (error) {
    console.error('[Auth Check Error]', error);
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
