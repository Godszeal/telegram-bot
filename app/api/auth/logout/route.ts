import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('auth_token');

    return NextResponse.json(
      { message: 'Logout successful' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Logout Error]', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}
