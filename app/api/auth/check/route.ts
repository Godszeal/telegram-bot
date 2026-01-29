import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Basic token check without jwt verification for now
    return NextResponse.json({ authenticated: true }, { status: 200 });
  } catch (error) {
    console.error('[Auth Check Error]', error);
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
