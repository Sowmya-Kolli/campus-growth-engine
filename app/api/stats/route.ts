import { NextRequest, NextResponse } from 'next/server';
import { getDashboardStats } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    // Default to false: genuine verified registrations only, unless explicitly requested via ?demo=true
    const includeDemo = searchParams.get('demo') === 'true';
    const excludeTest = searchParams.get('excludeTest') === 'true';

    const stats = await getDashboardStats(includeDemo, excludeTest);

    return NextResponse.json(stats, { status: 200 });
  } catch (err: any) {
    console.error('API /api/stats error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to fetch dashboard statistics.' },
      { status: 500 }
    );
  }
}
