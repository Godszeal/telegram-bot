import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Check if authenticated
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Return mock stats for now
    return NextResponse.json(
      {
        totalUsers: 42,
        bannedUsers: 3,
        totalCommands: 8,
        enabledCommands: 7,
        activeUsers: 15,
        commandsExecuted: 234,
      },
      { status: 200 }
    );

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
