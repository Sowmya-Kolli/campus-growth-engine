import { generateGrowthCopilotRecommendations } from '../lib/copilot.ts';
import { DashboardStats } from '../types/index.ts';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    process.exit(1);
  }
}

console.log('🧪 Starting Campus Growth Copilot Test Suite...\n');

// Mock Genuine dataset with 4 registrations
const mockGenuineStats: DashboardStats = {
  uniqueRegistrations: 4,
  target: 500,
  percentageAchieved: 0.8,
  regsToday: 4,
  regsTodayGrowth: 'Not enough data',
  regsRemaining: 496,
  daysLeft: 5,
  budgetTotal: 2000,
  budgetSpent: 'Spend unrecorded',
  budgetBurnPercentage: '0% burn',
  costPerRegistration: 'Not enough data',
  referralRate: 25.0,
  viralLinksCount: 1,
  viralKFactor: 'Not enough data',
  recommendations: [],
  velocity: [],
  channels: [
    { id: 'whatsapp', name: 'WhatsApp', icon: 'chat', regs: 1, percentage: 25, conversionRate: 'Not enough data', highlightText: '1 verified', highlightType: 'primary' },
    { id: 'ambassador', name: 'Ambassador', icon: 'badge', regs: 2, percentage: 50, conversionRate: 'Not enough data', highlightText: '14 Reps', highlightType: 'neutral' },
    { id: 'social', name: 'Social', icon: 'photo_camera', regs: 0, percentage: 0, conversionRate: 'Not enough data', highlightText: 'Awaiting', highlightType: 'warning' },
    { id: 'direct', name: 'Direct', icon: 'language', regs: 1, percentage: 25, conversionRate: 'Not enough data', highlightText: 'Direct', highlightType: 'neutral' },
  ],
  ambassadors: [
    { id: 'a1', code: 'ROHAN', name: 'Rohan', avatarUrl: '', college: 'BMSIT', branch: 'CSE', year: '3rd', badge: 'Lead', shares: 10, verifiedRegs: 2, rank: 1 },
    { id: 'a2', code: 'SNEHA', name: 'Sneha', avatarUrl: '', college: 'PESIT', branch: 'AIML', year: '2nd', badge: 'Lead', shares: 5, verifiedRegs: 0, rank: 2 },
  ],
  departments: [
    { branchKey: 'CSE', name: 'Computer Science & Engineering', percentage: 75, studentsCount: 3, colorClass: 'bg-primary' },
    { branchKey: 'AIML', name: 'Artificial Intelligence & Data Science', percentage: 25, studentsCount: 1, colorClass: 'bg-secondary' },
    { branchKey: 'IT', name: 'Information Technology', percentage: 0, studentsCount: 0, colorClass: 'bg-primary-container', tag: 'Awaiting RSVPs' },
    { branchKey: 'ECE', name: 'Electronics & Communication', percentage: 0, studentsCount: 0, colorClass: 'bg-outline', tag: 'Awaiting RSVPs' },
    { branchKey: 'OTHER', name: 'Mechanical & Civil', percentage: 0, studentsCount: 0, colorClass: 'bg-surface' },
  ],
  recentRegistrations: [],
  isDemoMode: false,
  genuineRegistrationsCount: 4,
  demoRegistrationsCount: 0,
  testRegistrationsCount: 0,
};

// ---------------------------------------------------------------------------
// TEST 1: Genuine Mode Recommendations
// ---------------------------------------------------------------------------
console.log('Test 1: Evaluating Genuine Mode (< 10 registrations)...');
const genuineRecs = generateGrowthCopilotRecommendations(mockGenuineStats, false);

assert(genuineRecs.length >= 2, 'Should generate at least 2 genuine recommendations');
assert(genuineRecs.every((r) => r.isSimulated === false), 'All genuine recommendations must have isSimulated === false');

// Verify cold-start baseline recommendation
const seedRec = genuineRecs[0];
console.log('  Top Recommendation:', seedRec.title);
console.log('  Category:', seedRec.category);
console.log('  Planning Target:', seedRec.planningTarget);
console.log('  Missing Data Note:', seedRec.missingDataNote);

assert(seedRec.observedProblem.includes('4 student registrations'), 'Must observe genuine count of 4');
assert(seedRec.planningTarget.includes('(Planning Target — not a forecast)'), 'Target must be explicitly marked as planning target, not forecast');
assert(Boolean(seedRec.missingDataNote && seedRec.missingDataNote.includes('Not enough data')), 'Must explain missing data when dataset is small');
assert(seedRec.outreachMessage.includes('{SHARE_URL}'), 'Must have copyable message with placeholder');
assert(Boolean(seedRec.successCriterion), 'Must have measurable success criterion');
console.log('  ✅ Test 1 Passed\n');

// ---------------------------------------------------------------------------
// TEST 2: Department Gap Identification in Genuine Mode
// ---------------------------------------------------------------------------
console.log('Test 2: Department Gap Detection...');
const deptRec = genuineRecs.find((r) => r.category.includes('Department'));
assert(Boolean(deptRec), 'Must detect zero/low registration departments (IT or ECE)');
console.log('  Detected Gap:', deptRec?.observedProblem);
console.log('  Proposed Action:', deptRec?.recommendedAction);
assert(deptRec!.observedProblem.includes('0 registrations') || deptRec!.observedProblem.includes('0%'), 'Must mention zero registrations');
console.log('  ✅ Test 2 Passed\n');

// ---------------------------------------------------------------------------
// TEST 3: Demo Mode Recommendations
// ---------------------------------------------------------------------------
console.log('Test 3: Evaluating Demo Mode...');
const demoRecs = generateGrowthCopilotRecommendations(mockGenuineStats, true);
assert(demoRecs.length >= 3, 'Demo mode should produce at least 3 recommendations');
assert(demoRecs.every((r) => r.isSimulated === true), 'All demo recommendations must have isSimulated === true');
assert(demoRecs[0].badge.includes('Simulated'), 'Demo badge must clearly indicate simulation');
console.log('  Demo Rec 1:', demoRecs[0].title);
console.log('  Demo Rec 1 Target:', demoRecs[0].planningTarget);
console.log('  ✅ Test 3 Passed\n');

// ---------------------------------------------------------------------------
// TEST 4: Completeness of Copilot Contract
// ---------------------------------------------------------------------------
console.log('Test 4: Schema Completeness across all recommendations...');
for (const r of [...genuineRecs, ...demoRecs]) {
  assert(Boolean(r.id), 'Missing id');
  assert(Boolean(r.title), 'Missing title');
  assert(Boolean(r.observedProblem), 'Missing observedProblem');
  assert(Boolean(r.recommendedAction), 'Missing recommendedAction');
  assert(Boolean(r.planningTarget), 'Missing planningTarget');
  assert(Boolean(r.rationale), 'Missing rationale');
  assert(Boolean(r.successCriterion), 'Missing successCriterion');
  assert(Boolean(r.outreachMessage), 'Missing outreachMessage');
}
console.log('  ✅ All recommendations adhere to complete Copilot contract!\n');

console.log('🎉 ALL CAMPUS GROWTH COPILOT TESTS PASSED SUCCESSFULLY!');
