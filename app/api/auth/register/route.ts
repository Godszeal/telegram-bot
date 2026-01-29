import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM admin_users WHERE username = ${email}
    `;

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with a placeholder user_id
    const result = await sql`
      INSERT INTO admin_users (user_id, username, password_hash, created_at)
      VALUES (${Date.now()}, ${email}, ${hashedPassword}, NOW())
      RETURNING id, username
    `;

    return NextResponse.json(
      { message: 'Account created successfully', user: { id: result.rows[0].id, username: result.rows[0].username } },
      { status: 201 }
    );
  } catch (error) {
    console.error('[Register Error]', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}
