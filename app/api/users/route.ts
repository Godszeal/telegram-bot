import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Check if authenticated
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Return mock users data
    const mockUsers = [
      { id: 1, user_id: '123456', username: 'user1', is_banned: false, created_at: new Date() },
      { id: 2, user_id: '123457', username: 'user2', is_banned: false, created_at: new Date() },
      { id: 3, user_id: '123458', username: 'user3', is_banned: true, created_at: new Date() },
    ];

    return NextResponse.json(
      {
        users: mockUsers,
        pagination: {
          page: 1,
          limit: 20,
          total: 3,
          pages: 1,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Users GET Error]', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { user_id, is_banned } = await request.json();

    // Mock update response
    return NextResponse.json(
      { message: 'User updated successfully', user: { user_id, is_banned } },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Users PUT Error]', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}
