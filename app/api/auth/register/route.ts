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

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // TODO: Connect to database and create user
    // For now, create a demo session
    const demoToken = Buffer.from(email + ':' + Date.now()).toString('base64');
    
    const cookieStore = await cookies();
    cookieStore.set('auth_token', demoToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
    });

    return NextResponse.json(
      { message: 'Account created successfully', user: { username: email } },
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
