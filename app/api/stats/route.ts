import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';

export async function GET(request: NextRequest) {
  try {
    const authUser = await verifyAuth(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get total users
    const usersResult = await sql`SELECT COUNT(*) as count FROM bot_users`;
    const totalUsers = parseInt(usersResult.rows[0].count as string);

    // Get banned users
    const bannedResult = await sql`
      SELECT COUNT(*) as count FROM bot_users WHERE is_banned = true
    `;
    const bannedUsers = parseInt(bannedResult.rows[0].count as string);

    // Get total commands
    const commandsResult = await sql`SELECT COUNT(*) as count FROM commands`;
    const totalCommands = parseInt(commandsResult.rows[0].count as string);

    // Get enabled commands
    const enabledResult = await sql`
      SELECT COUNT(*) as count FROM commands WHERE is_enabled = true
    `;
    const enabledCommands = parseInt(enabledResult.rows[0].count as string);

    // Get command usage (top 5)
    const usageResult = await sql`
      SELECT name, usage_count FROM commands
      ORDER BY usage_count DESC
      LIMIT 5
    `;

    // Get activity (last 7 days)
    const activityResult = await sql`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as count
      FROM command_logs
      WHERE created_at >= NOW() - INTERVAL '7 days'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `;

    return NextResponse.json(
      {
        users: {
          total: totalUsers,
          banned: bannedUsers,
          active: totalUsers - bannedUsers,
        },
        commands: {
          total: totalCommands,
          enabled: enabledCommands,
          disabled: totalCommands - enabledCommands,
        },
        topCommands: usageResult.rows,
        activity: activityResult.rows,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Stats Error]', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
