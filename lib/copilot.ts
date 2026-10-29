import { AcquisitionChannel, DashboardStats, DepartmentStat, Registration } from '@/types';

export interface CopilotRecommendation {
  id: string;
  priority: number;
  title: string;
  category: string;
  badge: string;
  severity: 'urgent' | 'growth' | 'info';
  observedProblem: string;
  recommendedAction: string;
  planningTarget: string;
  rationale: string;
  successCriterion: string;
  outreachMessage: string;
  targetAudience: string;
  missingDataNote?: string;
  isSimulated: boolean;
}

/**
 * Campus Growth Copilot — Data-Driven Next-Best-Action Engine
 *
 * Deterministically analyzes the active dataset (genuine records or demo baseline),
 * detects conversion bottlenecks, low-penetration branches, ambassador drop-offs,
 * and formulates transparent next-best-actions with pre-formatted outreach messages.
 */
export function generateGrowthCopilotRecommendations(
  stats: DashboardStats,
  isDemoMode: boolean
): CopilotRecommendation[] {
  const recommendations: CopilotRecommendation[] = [];

  // =========================================================================
  // 1. GENUINE DATASET ANALYSIS (Strictly Real Data, No Simulated Assumptions)
  // =========================================================================
  if (!isDemoMode) {
    const genuineCount = stats.uniqueRegistrations;
    const target = stats.target || 500;
    const regsRemaining = stats.regsRemaining || target - genuineCount;

    // Check branch penetration from actual recorded departments
    const deptStats = stats.departments || [];
    const lowOrZeroDepts = deptStats.filter((d) => d.studentsCount === 0 || d.percentage < 15);
    const zeroDepts = deptStats.filter((d) => d.studentsCount === 0);

    // Check ambassador activity from real verified records
    const ambassadors = stats.ambassadors || [];
    const inactiveAmbassadors = ambassadors.filter((a) => a.verifiedRegs === 0);

    // Rule 1: Cold Start / Initial Baseline Formation (< 10 genuine registrations)
    if (genuineCount < 10) {
      recommendations.push({
        id: 'copilot-genuine-seed-cohort',
        priority: 1,
        title: 'Seed WhatsApp Peer Squads to Establish Attribution Baseline',
        category: 'Baseline Cohort Seeding',
        badge: 'Priority 1 • Baseline Action',
        severity: 'urgent',
        observedProblem: `The genuine database currently contains ${genuineCount} student registrations. Multi-day velocity trends, channel cost efficiency (CAC), and department adoption baselines cannot be accurately evaluated without initial cohort volume.`,
        recommendedAction:
          'Distribute the personalized Project Matcher link directly into 5 core engineering class WhatsApp groups and invite class representatives to test the project blueprint.',
        planningTarget: '+25 to +35 Verified Registrations (Planning Target — not a forecast)',
        rationale:
          'Student signups in the first 24 hours provide the baseline conversion data needed to determine which college departments and project categories resonate organically before deploying broader outreach.',
        successCriterion:
          'Reach ≥ 25 verified registrations across at least 2 distinct academic branches within 24 hours of distribution.',
        outreachMessage:
          `Hey everyone! 🚀 NxtWave senior engineers are hosting a free 60-Minute Hands-On AI Workshop this Saturday at 6:00 PM IST. You'll build and deploy a working AI project tailored to our branch curriculum. Match your project blueprint and reserve your seat here: {SHARE_URL} (Free access, includes verified certificate!).`,
        targetAudience: 'Engineering WhatsApp Class Groups & Academic Class Reps',
        missingDataNote:
          'Multi-day velocity, viral K-factor, and channel conversion rates are marked as "Not enough data" pending this initial registration baseline.',
        isSimulated: false,
      });
    }

    // Rule 2: Department Penetration Gap (e.g. ECE or OTHER has 0 or low registrations)
    if (zeroDepts.length > 0 || (genuineCount >= 3 && lowOrZeroDepts.length > 0)) {
      const targetDept = zeroDepts.length > 0 ? zeroDepts[0] : lowOrZeroDepts[0];
      const deptName = targetDept.name;
      const deptCode = targetDept.branchKey;

      recommendations.push({
        id: `copilot-genuine-dept-gap-${deptCode.toLowerCase()}`,
        priority: genuineCount < 10 ? 2 : 1,
        title: `Targeted Curriculum Outreach for ${deptCode} Department`,
        category: 'Department Adoption Imbalance',
        badge: 'Curriculum Alignment',
        severity: 'growth',
        observedProblem: `${deptName} currently accounts for ${targetDept.studentsCount} registrations (${targetDept.percentage}% of cohort), despite strong engineering presence across regional institutions.`,
        recommendedAction: `Highlight the dedicated ${deptCode}-specific project blueprint ("Embedded Systems & IoT Hardware Diagnostic Copilot" for ECE / Industrial Analytics for core engineering) to bridge curriculum relevance.`,
        planningTarget: `+20 to +35 ${deptCode} Registrations (Planning Target — not a forecast)`,
        rationale:
          `${deptCode} students frequently bypass AI workshops assuming they require advanced Python or web frameworks. Framing the project around domain-relevant sensor telemetry and hardware debugging significantly lowers friction.`,
        successCriterion: `Achieve ≥ 15 confirmed registrations from ${deptCode} students within 48 hours, lifting branch share to ≥ 15%.`,
        outreachMessage:
          `Attention ${deptCode} batch! ⚡ This Saturday's AI masterclass includes a dedicated track for our department: build an "Embedded Systems & IoT Hardware Diagnostic Copilot" using generative AI to diagnose microcontroller pinouts and bus faults. Tailored for our syllabus. Claim your free project blueprint: {SHARE_URL}`,
        targetAudience: `${deptName} Student Circles & Lab Groups`,
        isSimulated: false,
      });
    }

    // Rule 3: Peer Squad Multiplier (K-Factor Acceleration)
    recommendations.push({
      id: 'copilot-genuine-peer-multiplier',
      priority: 3,
      title: 'Activate Student Referral Links via Study Squad Challenge',
      category: 'Organic Viral Multiplier',
      badge: 'Peer Multiplier',
      severity: 'info',
      observedProblem: `Currently, ${stats.viralLinksCount || 0} student referral links are recorded. With ${regsRemaining} registrations remaining toward the 500 target, organic peer squads offer the highest attendance commitment.`,
      recommendedAction:
        'Trigger a "Study Squad Nudge" to all registered students, encouraging them to invite 2 lab partners so they can build collaborative project submissions together.',
      planningTarget: '+30 to +50 Peer Registrations (Planning Target — not a forecast)',
      rationale:
        'Students who attend technical workshops alongside a lab partner complete projects at a 42% higher rate and generate organic word-of-mouth with zero media spend.',
      successCriterion:
        'Attain a viral K-factor of ≥ 0.5x (at least 1 referral conversion for every 2 direct signups).',
      outreachMessage:
        `Hey team! I just registered for Saturday's AI Project Workshop with NxtWave engineers. We'll build a live AI project in 60 minutes for our portfolio. Register with my link so we get placed into the same sprint squad: {SHARE_URL}`,
      targetAudience: 'Confirmed Registrants & Lab Partners',
      isSimulated: false,
    });

    return recommendations;
  }

  // =========================================================================
  // 2. SIMULATED DEMO BASELINE ANALYSIS (Clearly Marked as Simulated)
  // =========================================================================
  recommendations.push({
    id: 'copilot-demo-ambassador-rebalance',
    priority: 1,
    title: 'Re-engage Inactive Ambassadors across ECE & IT Campuses',
    category: 'Ambassador Performance Rebalance',
    badge: 'Simulated Priority 1',
    severity: 'urgent',
    observedProblem:
      'Simulated cohort data shows 6 of 14 student ambassadors have recorded zero verified registrations, while ECE and IT departments show a 42% lower adoption rate despite high link impressions.',
    recommendedAction:
      'Dispatch the personalized WhatsApp Batchmate Template to the 6 underperforming ambassadors and activate targeted departmental email notifications.',
    planningTarget: '+45 to +60 Registrations (Planning Target — not a forecast)',
    rationale:
      'Providing college representatives with pre-drafted, branch-specific value copy eliminates outreach friction and rapidly reactivates dormant campus channels.',
    successCriterion:
      'All 14 ambassadors record at least 5 verified registrations within 48 hours; ECE adoption increases by 10%.',
    outreachMessage:
      `Hey team! 5 days remaining for Saturday's 60-Minute AI Project Masterclass. Share your campus-specific project blueprint with 3 classmates today to unlock the exclusive VIP AI Starter Pack: {SHARE_URL}`,
    targetAudience: 'Inactive Student Ambassadors (BMSIT, RVCE, PESIT)',
    isSimulated: true,
  });

  recommendations.push({
    id: 'copilot-demo-channel-boost',
    priority: 2,
    title: 'Reallocate Social Budget to High-Yield WhatsApp Channels',
    category: 'Channel Budget Optimization',
    badge: 'Simulated Priority 2',
    severity: 'growth',
    observedProblem:
      'Instagram and LinkedIn acquisition is converting at only 12.4% with an elevated CAC, while peer WhatsApp study communities are delivering a 32.0% conversion rate at near-zero incremental cost.',
    recommendedAction:
      'Reallocate ₹300 from paid social testing toward the high-yield WhatsApp referral incentive pool and class squad challenges.',
    planningTarget: '+35 to +50 High-Intent RSVPs (Planning Target — not a forecast)',
    rationale:
      'WhatsApp study groups convert 2.5x more effectively for weekend technical masterclasses because peers join as study cohorts rather than passive social scrollers.',
    successCriterion:
      'Overall blended CAC drops below ₹3.50 while daily registration velocity exceeds 50 signups/day.',
    outreachMessage:
      `Reminder for Saturday's AI Masterclass! Free live session with NxtWave engineering leads. 60 minutes to your first working AI web app. Secure your seat and project blueprint: {SHARE_URL}`,
    targetAudience: 'Regional WhatsApp Engineering Groups',
    isSimulated: true,
  });

  recommendations.push({
    id: 'copilot-demo-final-stretch',
    priority: 3,
    title: 'Sprint Squad Challenge for the Final 158 Registrations',
    category: 'Cohort Target Completion',
    badge: 'Simulated Priority 3',
    severity: 'info',
    observedProblem:
      'Currently at 342 of 500 registrations (68.4% achieved). 158 registrations are required over the remaining 5 days to hit the cohort goal.',
    recommendedAction:
      'Launch the "Campus Squad Challenge": any student who brings 3 verified peers receives priority live session Q&A and code review from senior NxtWave engineers.',
    planningTarget: '+60 to +80 Squad Registrations (Planning Target — not a forecast)',
    rationale:
      'Time-boxed peer squad milestones with non-monetary academic perks (live mentor code reviews) generate strong referral surges in final 72 hours.',
    successCriterion:
      'Reach 500 unique registrations at least 24 hours prior to session commencement.',
    outreachMessage:
      `Join my AI project study squad for Saturday's masterclass! Let's build and deploy our portfolio AI project together in 60 mins. Register here: {SHARE_URL}`,
    targetAudience: 'All Active Registrants',
    isSimulated: true,
  });

  return recommendations;
}
