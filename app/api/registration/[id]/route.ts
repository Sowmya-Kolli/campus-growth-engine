import { NextRequest, NextResponse } from 'next/server';
import { findRegistrationById, getAllRegistrations } from '@/lib/db';
import { getRecommendedBlueprint } from '@/lib/blueprints';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const registration = await findRegistrationById(id);

    if (!registration) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }

    const blueprint = getRecommendedBlueprint(
      registration.branch,
      registration.interest,
      registration.codingLevel
    );

    // Count how many people registered using this student's referral code
    const all = await getAllRegistrations();
    const studentReferrals = all.filter(
      (r) => r.referredBy?.toUpperCase() === registration.referralCode?.toUpperCase()
    );

    return NextResponse.json({
      registration,
      blueprint,
      referralStats: {
        totalReferred: studentReferrals.length,
        referrals: studentReferrals,
      },
    });
  } catch (err: any) {
    console.error('API /api/registration/[id] error:', err);
    return NextResponse.json({ error: 'Failed to fetch registration' }, { status: 500 });
  }
}
