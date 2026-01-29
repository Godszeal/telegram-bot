import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';

export async function GET(request: NextRequest) {
  try {
    const authUser = await verifyAuth(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const usersResult = await sql`
      SELECT COUNT(*) as total FROM users WHERE admin_id = ${authUser.id}
    `;

    const activeResult = await sql`
      SELECT COUNT(*) as active FROM users 
      WHERE admin_id = ${authUser.id} 
      AND created_at >= NOW() - INTERVAL '1 day'
    `;

    const commandsResult = await sql`
      SELECT SUM(usage_count) as total FROM commands WHERE admin_id = ${authUser.id}
    `;

    const topCommandResult = await sql`
      SELECT command_name FROM commands 
      WHERE admin_id = ${authUser.id}
      ORDER BY usage_count DESC
      LIMIT 1
    `;

    return NextResponse.json({
      total_users: parseInt(usersResult.rows[0]?.total || 0),
      active_users_today: parseInt(activeResult.rows[0]?.active || 0),
      total_commands_executed: parseInt(commandsResult.rows[0]?.total || 0),
      most_used_command: topCommandResult.rows[0]?.command_name || 'N/A',
      avg_response_time: 125,
    });
  } catch (error) {
    console.error('[Analytics Error]', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
