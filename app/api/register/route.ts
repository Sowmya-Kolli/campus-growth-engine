import { NextRequest, NextResponse } from 'next/server';
import { createRegistration } from '@/lib/db';
import { getRecommendedBlueprint } from '@/lib/blueprints';
import { AcademicBranch, ProjectInterest } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, college, branch, interest, codingLevel, referralCode } = body;

    if (!name || !email || !college || !branch) {
      return NextResponse.json(
        { error: 'Please provide full name, college email, college name, and academic branch.' },
        { status: 400 }
      );
    }

    const branchMap: Record<string, string> = {
      CSE: 'Computer Science & Engineering',
      IT: 'Information Technology',
      AIML: 'Artificial Intelligence & Data Science',
      ECE: 'Electronics & Communication',
      OTHER: 'Other Specialization',
    };

    const branchKey = (branch as AcademicBranch) || 'CSE';
    const interestKey = (interest as ProjectInterest) || 'Resume & Career Tools';
    const codingKey = codingLevel || 'Beginner';

    const blueprint = getRecommendedBlueprint(branchKey, interestKey, codingKey);

    const result = await createRegistration({
      name,
      email,
      college,
      branch: branchKey,
      branchLabel: branchMap[branchKey] || 'Engineering',
      interest: interestKey,
      codingLevel: codingKey,
      projectId: blueprint.id,
      projectTitle: blueprint.title,
      referralCode: referralCode || null,
    });

    if (result.isDuplicate) {
      return NextResponse.json(
        {
          error: result.error,
          isDuplicate: true,
          registration: result.registration,
          blueprint,
        },
        { status: 409 }
      );
    }

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Registration confirmed successfully!',
        registration: result.registration,
        blueprint,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('API /api/register error:', err);
    return NextResponse.json(
      { error: err?.message || 'An unexpected error occurred while processing registration.' },
      { status: 500 }
    );
  }
}
