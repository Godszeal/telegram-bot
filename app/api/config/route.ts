import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Check if authenticated
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Return mock config for now
    return NextResponse.json(
      {
        bot_token: 'YOUR_BOT_TOKEN_HERE',
        bot_prefix: '/',
        bot_name: 'MyBot',
        updated_at: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Config GET Error]', error);
    return NextResponse.json(
      { error: 'Failed to fetch config' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authUser = await verifyAuth(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { bot_token, bot_prefix, bot_name, admin_id } = await request.json();

    // Check if config exists
    const existing = await sql`
      SELECT id FROM bot_config LIMIT 1
    `;

    let result;
    if (existing.rows.length > 0) {
      result = await sql`
        UPDATE bot_config
        SET bot_token = ${bot_token},
            bot_prefix = ${bot_prefix},
            bot_name = ${bot_name},
            admin_id = ${admin_id},
            updated_at = NOW()
        RETURNING *
      `;
    } else {
      result = await sql`
        INSERT INTO bot_config (bot_token, bot_prefix, bot_name, admin_id, created_at, updated_at)
        VALUES (${bot_token}, ${bot_prefix}, ${bot_name}, ${admin_id}, NOW(), NOW())
        RETURNING *
      `;
    }

    return NextResponse.json(
      { message: 'Config updated successfully', config: result.rows[0] },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Config POST Error]', error);
    return NextResponse.json(
      { error: 'Failed to update config' },
      { status: 500 }
    );
  }
}
