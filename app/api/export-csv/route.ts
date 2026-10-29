import { NextRequest, NextResponse } from 'next/server';
import { getAllRegistrations } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    // Default to false: export strictly genuine student registrations unless ?demo=true is explicitly passed
    const includeDemo = searchParams.get('demo') === 'true';
    const excludeTest = searchParams.get('excludeTest') === 'true';

    let records = await getAllRegistrations();
    if (!includeDemo) {
      records = records.filter((r) => !r.isDemo);
    }
    if (excludeTest) {
      const { isTestRegistration } = await import('@/lib/db');
      records = records.filter((r) => !isTestRegistration(r));
    }

    const { isTestRegistration } = await import('@/lib/db');

    const headers = [
      'Ticket Number',
      'Name',
      'Email',
      'College',
      'Branch',
      'Interest',
      'Coding Level',
      'Project Blueprint',
      'Referral Code',
      'Referred By',
      'Acquisition Channel',
      'Registered At',
      'Status / Audit',
    ];

    const escapeCsv = (str: string | undefined | null) => {
      if (!str) return '""';
      const clean = String(str).replace(/"/g, '""');
      return `"${clean}"`;
    };

    const rows = records.map((r) => {
      let statusLabel = 'Genuine';
      if (r.isDemo) {
        statusLabel = 'Simulated Demo';
      } else if (isTestRegistration(r)) {
        statusLabel = 'Test Record';
      }

      return [
        escapeCsv(r.ticketNumber),
        escapeCsv(r.name),
        escapeCsv(r.email),
        escapeCsv(r.college),
        escapeCsv(r.branchLabel || r.branch),
        escapeCsv(r.interest),
        escapeCsv(r.codingLevel),
        escapeCsv(r.projectTitle),
        escapeCsv(r.referralCode),
        escapeCsv(r.referredBy || 'None (Direct)'),
        escapeCsv(r.channelLabel || r.channel),
        escapeCsv(r.createdAt),
        escapeCsv(statusLabel),
      ];
    });

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="campus_growth_engine_registrations_${Date.now()}.csv"`,
      },
    });
  } catch (err: any) {
    console.error('API /api/export-csv error:', err);
    return NextResponse.json({ error: 'Failed to generate CSV export.' }, { status: 500 });
  }
}
