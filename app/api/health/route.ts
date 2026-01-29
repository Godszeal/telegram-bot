import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    // Test database connection
    const result = await sql`SELECT 1`;
    
    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString(),
    }, { status: 200 });
  } catch (error) {
    console.error('[Health Check Error]', error);
    return NextResponse.json({
      status: 'unhealthy',
      database: 'disconnected',
      error: String(error),
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
