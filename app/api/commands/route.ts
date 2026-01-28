import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';

export async function GET(request: NextRequest) {
  try {
    const authUser = await verifyAuth(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await sql`
      SELECT id, name, description, is_enabled, usage_count, last_used, created_at
      FROM commands
      ORDER BY name ASC
    `;

    return NextResponse.json({ commands: result.rows }, { status: 200 });
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
    const authUser = await verifyAuth(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { command_id, is_enabled } = await request.json();

    const result = await sql`
      UPDATE commands
      SET is_enabled = ${is_enabled}
      WHERE id = ${command_id}
      RETURNING *
    `;

    return NextResponse.json(
      { message: 'Command updated successfully', command: result.rows[0] },
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
