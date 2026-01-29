import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Return mock commands
    const mockCommands = [
      { id: 1, name: '/start', description: 'Start the bot', is_enabled: true, usage_count: 50, last_used: new Date() },
      { id: 2, name: '/help', description: 'Show help', is_enabled: true, usage_count: 30, last_used: new Date() },
      { id: 3, name: '/admin', description: 'Admin panel', is_enabled: false, usage_count: 5, last_used: new Date() },
    ];

    return NextResponse.json({ commands: mockCommands }, { status: 200 });
  } catch (error) {
    console.error('[Commands GET Error]', error);
    return NextResponse.json(
      { error: 'Failed to fetch commands' },
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

    const { command_id, is_enabled } = await request.json();

    // Mock update response
    return NextResponse.json(
      { message: 'Command updated successfully', command: { id: command_id, is_enabled } },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Commands PUT Error]', error);
    return NextResponse.json(
      { error: 'Failed to update command' },
      { status: 500 }
    );
  }
}
