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
      SELECT bot_token, bot_prefix, bot_name, admin_id, updated_at
      FROM bot_config
      LIMIT 1
    `;

    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          bot_token: '',
          bot_prefix: '/',
          bot_name: 'MyBot',
          admin_id: '',
        },
        { status: 200 }
      );
    }

    return NextResponse.json(result.rows[0], { status: 200 });
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
