import { NextRequest, NextResponse } from 'next/server';
import { getDashboardStats } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const includeDemo = searchParams.get('demo') !== 'false';

    const stats = await getDashboardStats(includeDemo);

    return NextResponse.json(stats, { status: 200 });
  } catch (err: any) {
    console.error('API /api/stats error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to fetch dashboard statistics.' },
      { status: 500 }
    );
  }
}
