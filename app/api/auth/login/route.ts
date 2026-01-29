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
    let result;
    try {
      result = await sql`
        SELECT id, email, password_hash FROM admins WHERE email = ${email}
      `;
    } catch (dbError) {
      console.error('[v0] Database query error:', dbError);
      return NextResponse.json(
        { error: 'Database connection error. Please try again.' },
        { status: 500 }
      );
    }

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
    let passwordMatch = false;
    try {
      passwordMatch = await bcrypt.compare(password, user.password_hash);
    } catch (bcryptError) {
      console.error('[v0] Bcrypt error:', bcryptError);
      return NextResponse.json(
        { error: 'Password verification failed' },
        { status: 500 }
      );
    }

    if (!passwordMatch) {
      console.log('[v0] Password mismatch');
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    console.log('[v0] Password verified, creating JWT token');

    // Create JWT token
    let token;
    try {
      token = jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
    } catch (jwtError) {
      console.error('[v0] JWT creation error:', jwtError);
      return NextResponse.json(
        { error: 'Token creation failed' },
        { status: 500 }
      );
    }

    // Create response with successful login
    const response = NextResponse.json(
      { message: 'Login successful', user: { id: user.id, email: user.email } },
      { status: 200 }
    );

    // Set cookie on the response
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    console.log('[v0] Login successful for user:', user.id);
    return response;
    
  } catch (error) {
    console.error('[v0] Login Error', error);
    return NextResponse.json(
      { error: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
}
