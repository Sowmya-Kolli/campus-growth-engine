import { NextRequest, NextResponse } from 'next/server';
import { resetTestRegistrations } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const result = await resetTestRegistrations();
    return NextResponse.json(
      {
        success: true,
        message: `Successfully removed ${result.deletedCount} test registrations. ${result.remainingCount} genuine records remain safe.`,
        deletedCount: result.deletedCount,
        remainingCount: result.remainingCount,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error('API /api/test-data/reset error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to reset test registrations' },
      { status: 500 }
    );
  }
}
