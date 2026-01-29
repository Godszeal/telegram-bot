import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    console.log('[v0] Login attempt for:', email);

    if (!email || !password) {
      console.log('[v0] Missing email or password');
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user
    const result = await sql`
      SELECT id, email, password_hash FROM admins WHERE email = ${email}
    `;

    console.log('[v0] Query result rows:', result.rows.length);

    if (result.rows.length === 0) {
      console.log('[v0] User not found:', email);
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const user = result.rows[0] as any;
    console.log('[v0] User found, verifying password');

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      console.log('[v0] Password mismatch');
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    console.log('[v0] Password verified, creating JWT token');

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    console.log('[v0] Login successful for user:', user.id);

    return NextResponse.json(
      { message: 'Login successful', user: { id: user.id, email: user.email } },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Login Error', error);
    return NextResponse.json(
      { error: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
}
