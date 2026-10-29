import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import {
  AcademicBranch,
  AcquisitionChannel,
  Ambassador,
  DashboardStats,
  DepartmentStat,
  ProjectInterest,
  Registration,
} from '@/types';

// Supabase client initialization (server-side only, privileged credentials protected)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
// Priority to server-only SUPABASE_SERVICE_ROLE_KEY, falling back to anon key if service role is absent
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

const DATA_DIR = path.join(process.cwd(), 'data');
const REGISTRATIONS_FILE = path.join(DATA_DIR, 'registrations.json');

// In-memory fallback cache for serverless environments (e.g. Vercel read-only filesystem)
let inMemoryRegistrations: Registration[] | null = null;

// Known Ambassadors Roster
export const AMBASSADORS_ROSTER: Ambassador[] = [
  {
    id: 'amb-1',
    code: 'ROHAN-BMS-2025',
    name: 'Rohan V.',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAENxIadnV7tPnt7NzE2rFwc3hJawYpdv-rhqLcM_wGpBoxsYjl3v19R4738KeFUtwGhzjs2pdIjZnmypTnoVxuj-gnn5OrzPz_eC_oVLj5W7ycLGHnYCHWjKU4-wDhED3w7FnwlWdOUs-E7r13ScmFpE3_y5T9A8lR7IQFxiELww7rIaCyqwn0tfRT-MuQHct5o1cemzSSaqxYJ_O9iKlnKIBifpub11zj3VD0DBUY',
    college: 'BMSIT',
    branch: 'CSE',
    year: '3rd Year',
    badge: 'Master Evangelist',
    shares: 112,
    verifiedRegs: 34,
    rank: 1,
  },
  {
    id: 'amb-2',
    code: 'SNEHA-PES-2025',
    name: 'Sneha K.',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDDJAuMrdCCefMZL190qQR2t6adJK4w9Jf9vJ-BXQEYXqCVUcsvNvgoG4pTcb5BtEMnoLtg0va90nNe6ZZYHczas3PR80UiPATZEEpE7naop5Q9Ur6GuMOWY7aGKTPI2vvjbT-sFUWj6KPoBY6WDTPcKYCI6sGI0Fgb1ZhjQqBy2GD2HAxGKYrmBlFegPRlCDQybVS6sVx5W-X0uhERMVSqJibVcyWGZ--r7VU7Z4YB',
    college: 'PESIT',
    branch: 'AI/ML',
    year: '2nd Year',
    badge: 'Campus Lead',
    shares: 89,
    verifiedRegs: 28,
    rank: 2,
  },
  {
    id: 'amb-3',
    code: 'CAMPUS-AI-829',
    name: 'Aarav S.',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCLS8S18jyCYP87q2V34i3y-2dFQRFY-B2xB_VjUoI9f9-_Mo4xtOEfWXtsFrxmdEqvVaQTIagrv0mqRoxtVEguIZoJygDvhDY2X166fUDZrKJHhWR_bwKF2Y6dFBYn3t8Rboaw2XNYqO5U33tUvZcDyvW5eTuvsnBknma8vO_UJhrhHC_2tIQt4YmTohSBDt0JVVZSSwaTEsSHDpeBsjd99PjggWvOuatlZ2mcshrH',
    college: 'RVCE',
    branch: 'ECE',
    year: '4th Year',
    badge: 'Rising Star',
    shares: 64,
    verifiedRegs: 19,
    rank: 3,
  },
  {
    id: 'amb-4',
    code: 'PRIYA-MSR-2025',
    name: 'Priya N.',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDDJAuMrdCCefMZL190qQR2t6adJK4w9Jf9vJ-BXQEYXqCVUcsvNvgoG4pTcb5BtEMnoLtg0va90nNe6ZZYHczas3PR80UiPATZEEpE7naop5Q9Ur6GuMOWY7aGKTPI2vvjbT-sFUWj6KPoBY6WDTPcKYCI6sGI0Fgb1ZhjQqBy2GD2HAxGKYrmBlFegPRlCDQybVS6sVx5W-X0uhERMVSqJibVcyWGZ--r7VU7Z4YB',
    college: 'MSRIT',
    branch: 'IT',
    year: '3rd Year',
    badge: 'Campus Pioneer',
    shares: 45,
    verifiedRegs: 11,
    rank: 4,
  },
];

// Initial demo baseline records (clearly flagged with isDemo: true)
export const INITIAL_DEMO_RECORDS: Registration[] = [
  {
    id: 'reg-demo-1',
    ticketNumber: 'NX-94218',
    name: 'Divya Nanduri',
    email: 'divya.nanduri@bmsit.in',
    college: 'BMS College of Engineering',
    branch: 'CSE',
    branchLabel: 'Computer Science & Engineering',
    interest: 'Resume & Career Tools',
    codingLevel: 'Beginner',
    projectId: 'resume-ats-copilot',
    projectTitle: 'Smart ATS Resume Analyzer & Interview Copilot',
    referralCode: 'DIVYA-CSE-811',
    referredBy: 'ROHAN-BMS-2025',
    channel: 'ambassador',
    channelLabel: 'Rohan V. (Ambassador)',
    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    isDemo: true,
  },
  {
    id: 'reg-demo-2',
    ticketNumber: 'NX-94219',
    name: 'Karthik Pandian',
    email: 'karthik.pandian@pes.edu',
    college: 'PES University',
    branch: 'AIML',
    branchLabel: 'Artificial Intelligence & Data Science',
    interest: 'Chatbot',
    codingLevel: 'Intermediate',
    projectId: 'campus-faq-rag-bot',
    projectTitle: 'Campus FAQ & Exam Copilot with RAG',
    referralCode: 'KARTHIK-AI-902',
    referredBy: 'PES-WHATSAPP-GRP',
    channel: 'whatsapp',
    channelLabel: 'WhatsApp Group (PES CS-C)',
    createdAt: new Date(Date.now() - 7 * 60 * 1000).toISOString(),
    isDemo: true,
  },
  {
    id: 'reg-demo-3',
    ticketNumber: 'NX-94220',
    name: 'Tanvi Deshmukh',
    email: 'tanvi.d@rvce.edu.in',
    college: 'RV College of Engineering',
    branch: 'IT',
    branchLabel: 'Information Technology',
    interest: 'Study Assistant',
    codingLevel: 'Basic',
    projectId: 'study-assistant-audio-cards',
    projectTitle: 'Interactive Code Explainer & Audio Flashcards',
    referralCode: 'TANVI-IT-402',
    referredBy: null,
    channel: 'direct',
    channelLabel: 'Direct / College Portals',
    createdAt: new Date(Date.now() - 19 * 60 * 1000).toISOString(),
    isDemo: true,
  },
  {
    id: 'reg-demo-4',
    ticketNumber: 'NX-94221',
    name: 'Anirudh Menon',
    email: 'anirudh.menon@msrit.edu',
    college: 'Ramaiah Institute of Technology',
    branch: 'ECE',
    branchLabel: 'Electronics & Communication',
    interest: 'Data Dashboard',
    codingLevel: 'Beginner',
    projectId: 'placement-analytics-dashboard',
    projectTitle: 'Automated Placement Trend & Salary Intelligence',
    referralCode: 'ANIRUDH-ECE-719',
    referredBy: 'CAMPUS-AI-829',
    channel: 'ambassador',
    channelLabel: 'Aarav S. (Ambassador)',
    createdAt: new Date(Date.now() - 34 * 60 * 1000).toISOString(),
    isDemo: true,
  },
  {
    id: 'reg-demo-5',
    ticketNumber: 'NX-94222',
    name: 'Meera Krishnan',
    email: 'meera.k@vtu.ac.in',
    college: 'Visvesvaraya Technological University',
    branch: 'CSE',
    branchLabel: 'Computer Science & Engineering',
    interest: 'Resume & Career Tools',
    codingLevel: 'Intermediate',
    projectId: 'resume-ats-copilot',
    projectTitle: 'Smart ATS Resume Analyzer & Interview Copilot',
    referralCode: 'MEERA-CSE-330',
    referredBy: 'DIVYA-CSE-811',
    channel: 'peer',
    channelLabel: 'Peer Referral (Divya N.)',
    createdAt: new Date(Date.now() - 52 * 60 * 1000).toISOString(),
    isDemo: true,
  },
];

// Helper to ensure data directory and file exist with serverless safety
function ensureDataFile() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(REGISTRATIONS_FILE)) {
      fs.writeFileSync(REGISTRATIONS_FILE, JSON.stringify(INITIAL_DEMO_RECORDS, null, 2), 'utf-8');
    }
  } catch (err: any) {
    // On serverless platforms like Vercel, the local filesystem is read-only
    console.warn('Filesystem is read-only (Serverless environment). Using in-memory store:', err.message);
  }
}

// Read all registrations from storage with serverless fallback
export function getLocalRegistrations(): Registration[] {
  if (inMemoryRegistrations) {
    return inMemoryRegistrations;
  }

  try {
    ensureDataFile();
    if (fs.existsSync(REGISTRATIONS_FILE)) {
      const raw = fs.readFileSync(REGISTRATIONS_FILE, 'utf-8');
      inMemoryRegistrations = JSON.parse(raw) as Registration[];
      return inMemoryRegistrations;
    }
  } catch (err) {
    console.warn('Local file read warning, using in-memory baseline:', err);
  }

  inMemoryRegistrations = [...INITIAL_DEMO_RECORDS];
  return inMemoryRegistrations;
}

// Save all registrations with serverless safety
export function saveLocalRegistrations(records: Registration[]): void {
  inMemoryRegistrations = records;
  try {
    ensureDataFile();
    fs.writeFileSync(REGISTRATIONS_FILE, JSON.stringify(records, null, 2), 'utf-8');
  } catch (err: any) {
    console.warn('Local filesystem write failed (expected on Vercel serverless). In-memory cache updated:', err.message);
  }
}

// Normalize email address strictly
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

// Generate unique referral code for a student
export function generateStudentReferralCode(name: string, branch: AcademicBranch): string {
  const cleanName =
    name
      .trim()
      .split(' ')[0]
      .replace(/[^a-zA-Z]/g, '')
      .toUpperCase() || 'STUDENT';
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  return `${cleanName}-${branch}-${randomSuffix}`;
}

// Generate unique ticket number
export function generateTicketNumber(): string {
  const num = Math.floor(10000 + Math.random() * 90000);
  return `NX-${num}`;
}

// Resolve channel from referral code
export function resolveAcquisitionChannel(referralCode?: string | null): {
  channel: AcquisitionChannel;
  channelLabel: string;
} {
  if (!referralCode || !referralCode.trim()) {
    return {
      channel: 'direct',
      channelLabel: 'Direct / College Portals',
    };
  }

  const code = referralCode.trim().toUpperCase();

  const ambassador = AMBASSADORS_ROSTER.find((a) => a.code.toUpperCase() === code);
  if (ambassador) {
    return {
      channel: 'ambassador',
      channelLabel: `${ambassador.name} (Ambassador)`,
    };
  }

  if (code.includes('WHATSAPP') || code.includes('WA-') || code.includes('GRP')) {
    return {
      channel: 'whatsapp',
      channelLabel: 'WhatsApp Study Group',
    };
  }

  if (code.includes('LINKEDIN') || code.includes('INSTA') || code.includes('IG')) {
    return {
      channel: 'social',
      channelLabel: 'Instagram / LinkedIn',
    };
  }

  return {
    channel: 'peer',
    channelLabel: `Friend Referral (${code})`,
  };
}

// Read all registrations (Supabase if available, else local storage)
export async function getAllRegistrations(): Promise<Registration[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((row) => ({
          id: row.id,
          ticketNumber: row.ticket_number || row.id,
          name: row.name,
          email: row.email,
          college: row.college,
          branch: row.branch,
          branchLabel: row.branch_label,
          interest: row.interest,
          codingLevel: row.coding_level,
          projectId: row.project_id,
          projectTitle: row.project_title,
          referralCode: row.referral_code,
          referredBy: row.referred_by,
          channel: row.channel,
          channelLabel: row.channel_label,
          createdAt: row.created_at,
          isDemo: Boolean(row.is_demo),
        }));
      }
    } catch (err) {
      console.warn('Supabase query failed, falling back to local store:', err);
    }
  }

  return getLocalRegistrations();
}

// Find registration by normalized email
export async function findRegistrationByEmail(email: string): Promise<Registration | null> {
  const normalized = normalizeEmail(email);
  const all = await getAllRegistrations();
  return all.find((r) => normalizeEmail(r.email) === normalized) || null;
}

// Find registration by ID or ticket
export async function findRegistrationById(id: string): Promise<Registration | null> {
  const all = await getAllRegistrations();
  return all.find((r) => r.id === id || r.ticketNumber === id) || null;
}

// Create new registration with duplicate prevention and referral attribution
export async function createRegistration(params: {
  name: string;
  email: string;
  college: string;
  branch: AcademicBranch;
  branchLabel: string;
  interest: ProjectInterest;
  codingLevel: string;
  projectId: string;
  projectTitle: string;
  referralCode?: string | null;
}): Promise<{ registration?: Registration; error?: string; isDuplicate?: boolean }> {
  const normalizedEmail = normalizeEmail(params.email);

  if (!params.name.trim()) {
    return { error: 'Full name is required' };
  }
  if (!normalizedEmail || !normalizedEmail.includes('@') || !normalizedEmail.includes('.')) {
    return { error: 'Please enter a valid email address' };
  }
  if (!params.college.trim()) {
    return { error: 'College / University name is required' };
  }

  // Duplicate email check
  const existing = await findRegistrationByEmail(normalizedEmail);
  if (existing) {
    return {
      error: `The email "${normalizedEmail}" is already registered for this Saturday's AI workshop. Check your blueprint below!`,
      isDuplicate: true,
      registration: existing,
    };
  }

  const studentReferralCode = generateStudentReferralCode(params.name, params.branch);
  const ticketNumber = generateTicketNumber();
  const attribution = resolveAcquisitionChannel(params.referralCode);

  const newRecord: Registration = {
    id: `reg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    ticketNumber,
    name: params.name.trim(),
    email: normalizedEmail,
    college: params.college.trim(),
    branch: params.branch,
    branchLabel: params.branchLabel,
    interest: params.interest,
    codingLevel: params.codingLevel as any,
    projectId: params.projectId,
    projectTitle: params.projectTitle,
    referralCode: studentReferralCode,
    referredBy: params.referralCode?.trim() || null,
    channel: attribution.channel,
    channelLabel: attribution.channelLabel,
    createdAt: new Date().toISOString(),
    isDemo: false,
  };

  // If Supabase is connected, write to Supabase
  if (supabase) {
    try {
      const { error } = await supabase.from('registrations').insert({
        id: newRecord.id,
        ticket_number: newRecord.ticketNumber,
        name: newRecord.name,
        email: newRecord.email,
        college: newRecord.college,
        branch: newRecord.branch,
        branch_label: newRecord.branchLabel,
        interest: newRecord.interest,
        coding_level: newRecord.codingLevel,
        project_id: newRecord.projectId,
        project_title: newRecord.projectTitle,
        referral_code: newRecord.referralCode,
        referred_by: newRecord.referredBy,
        channel: newRecord.channel,
        channel_label: newRecord.channelLabel,
        is_demo: false,
      });

      if (error) {
        console.error('Supabase insert error, persisting locally:', error);
      }
    } catch (err) {
      console.error('Supabase write exception, persisting locally:', err);
    }
  }

  // Update local memory / file storage
  const currentLocal = getLocalRegistrations();
  currentLocal.unshift(newRecord);
  saveLocalRegistrations(currentLocal);

  return { registration: newRecord };
}

// Check if a registration is a test / audit record
export function isTestRegistration(r: Registration): boolean {
  if (r.isTest === true) return true;
  const name = (r.name || '').toLowerCase();
  const email = (r.email || '').toLowerCase();
  return (
    name.includes('audit candidate') ||
    name.includes('test user') ||
    name.includes('test candidate') ||
    email.startsWith('audit.') ||
    email.startsWith('test.') ||
    email.includes('test.student') ||
    email === 'audit.student.1793262218@college.edu' ||
    email === 'aarav.sharma@vtu.ac.in' ||
    email === 'ravi.kumar@rvce.edu.in'
  );
}

// Safely reset / purge test registrations while preserving all genuine registrations
export async function resetTestRegistrations(): Promise<{ deletedCount: number; remainingCount: number }> {
  const all = await getAllRegistrations();
  const testRecords = all.filter((r) => !r.isDemo && isTestRegistration(r));
  const preservedRecords = all.filter((r) => r.isDemo || !isTestRegistration(r));

  if (supabase && testRecords.length > 0) {
    try {
      const testIds = testRecords.map((r) => r.id);
      await supabase.from('registrations').delete().in('id', testIds);
    } catch (err) {
      console.error('Failed to delete test records from Supabase:', err);
    }
  }

  saveLocalRegistrations(preservedRecords);
  return { deletedCount: testRecords.length, remainingCount: preservedRecords.length };
}

// Compute dashboard statistics (strictly distinguishing genuine records from demo baseline)
export async function getDashboardStats(
  includeDemo: boolean = false,
  excludeTest: boolean = false
): Promise<DashboardStats> {
  const allRegistrations = await getAllRegistrations();

  // Attach isTest attribute to all records
  const annotatedRecords = allRegistrations.map((r) => ({
    ...r,
    isTest: isTestRegistration(r),
  }));

  const allGenuineRecords = annotatedRecords.filter((r) => !r.isDemo);
  const testRegistrationsCount = allGenuineRecords.filter((r) => isTestRegistration(r)).length;

  const genuineRecords = excludeTest
    ? allGenuineRecords.filter((r) => !isTestRegistration(r))
    : allGenuineRecords;

  const demoRecords = annotatedRecords.filter((r) => r.isDemo);

  const target = 500;
  const budgetTotal = 2000;

  // -------------------------------------------------------------------------
  // 1. GENUINE REGISTRATIONS MODE (Default, strictly real data)
  // -------------------------------------------------------------------------
  if (!includeDemo) {
    const genuineCount = genuineRecords.length;
    const percentageAchieved = Number(((genuineCount / target) * 100).toFixed(1));
    const regsRemaining = Math.max(0, target - genuineCount);

    // Filter genuine records created in the last 24h
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const regsToday = genuineRecords.filter((r) => new Date(r.createdAt) >= oneDayAgo).length;

    // Day-over-day growth: only compute if previous baseline exists
    const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
    const regsYesterday = genuineRecords.filter(
      (r) => new Date(r.createdAt) >= twoDaysAgo && new Date(r.createdAt) < oneDayAgo
    ).length;

    const regsTodayGrowth =
      regsYesterday > 0
        ? `${(((regsToday - regsYesterday) / regsYesterday) * 100).toFixed(0)}%`
        : 'Not enough data';

    // Budget: real spend is not yet connected to a payment gateway
    const budgetSpent = 'Spend unrecorded';
    const budgetBurnPercentage = '0% burn';
    const costPerRegistration = 'Not enough data';

    // Referral metrics
    const viralLinksCount = genuineRecords.filter((r) => r.channel === 'peer').length;
    const referralRate =
      genuineCount > 0 ? Number(((viralLinksCount / genuineCount) * 100).toFixed(1)) : 0;
    const directCount = genuineRecords.filter((r) => r.channel === 'direct').length;
    const viralKFactor =
      directCount > 0 && viralLinksCount > 0
        ? `${(viralLinksCount / directCount).toFixed(2)}x`
        : 'Not enough data';

    // Channel breakdown strictly derived from genuine records
    const channelCounts: Record<AcquisitionChannel, number> = {
      whatsapp: genuineRecords.filter((r) => r.channel === 'whatsapp').length,
      ambassador: genuineRecords.filter((r) => r.channel === 'ambassador').length,
      social: genuineRecords.filter((r) => r.channel === 'social').length,
      direct: genuineRecords.filter((r) => r.channel === 'direct').length,
      peer: genuineRecords.filter((r) => r.channel === 'peer').length,
    };

    const channels = [
      {
        id: 'whatsapp' as AcquisitionChannel,
        name: 'WhatsApp Study Groups',
        icon: 'chat',
        regs: channelCounts.whatsapp,
        percentage: genuineCount > 0 ? Number(((channelCounts.whatsapp / genuineCount) * 100).toFixed(1)) : 0,
        conversionRate: 'Not enough data',
        highlightText: channelCounts.whatsapp > 0 ? `${channelCounts.whatsapp} verified` : 'Awaiting links',
        highlightType: 'primary' as const,
      },
      {
        id: 'ambassador' as AcquisitionChannel,
        name: 'Campus Ambassadors',
        icon: 'badge',
        regs: channelCounts.ambassador,
        percentage: genuineCount > 0 ? Number(((channelCounts.ambassador / genuineCount) * 100).toFixed(1)) : 0,
        conversionRate: 'Not enough data',
        highlightText: `${AMBASSADORS_ROSTER.length} College Reps`,
        highlightType: 'neutral' as const,
      },
      {
        id: 'social' as AcquisitionChannel,
        name: 'Instagram / LinkedIn',
        icon: 'photo_camera',
        regs: channelCounts.social,
        percentage: genuineCount > 0 ? Number(((channelCounts.social / genuineCount) * 100).toFixed(1)) : 0,
        conversionRate: 'Not enough data',
        highlightText: channelCounts.social > 0 ? `${channelCounts.social} verified` : 'Awaiting traffic',
        highlightType: 'warning' as const,
      },
      {
        id: 'direct' as AcquisitionChannel,
        name: 'Direct / Peer Referrals',
        icon: 'language',
        regs: channelCounts.direct + channelCounts.peer,
        percentage:
          genuineCount > 0
            ? Number((((channelCounts.direct + channelCounts.peer) / genuineCount) * 100).toFixed(1))
            : 0,
        conversionRate: 'Not enough data',
        highlightText: 'Notice Boards & Student Links',
        highlightType: 'neutral' as const,
      },
    ];

    // Department penetration from genuine records
    const deptCount = (branch: AcademicBranch) =>
      genuineRecords.filter((r) => r.branch === branch).length;

    const departments: DepartmentStat[] = [
      {
        branchKey: 'CSE',
        name: 'Computer Science & Engineering',
        percentage: genuineCount > 0 ? Number(((deptCount('CSE') / genuineCount) * 100).toFixed(1)) : 0,
        studentsCount: deptCount('CSE'),
        colorClass: 'bg-primary',
      },
      {
        branchKey: 'AIML',
        name: 'Artificial Intelligence & Data Science',
        percentage: genuineCount > 0 ? Number(((deptCount('AIML') / genuineCount) * 100).toFixed(1)) : 0,
        studentsCount: deptCount('AIML'),
        colorClass: 'bg-secondary-container',
      },
      {
        branchKey: 'IT',
        name: 'Information Technology',
        percentage: genuineCount > 0 ? Number(((deptCount('IT') / genuineCount) * 100).toFixed(1)) : 0,
        studentsCount: deptCount('IT'),
        colorClass: 'bg-primary-container',
      },
      {
        branchKey: 'ECE',
        name: 'Electronics & Communication (ECE)',
        percentage: genuineCount > 0 ? Number(((deptCount('ECE') / genuineCount) * 100).toFixed(1)) : 0,
        studentsCount: deptCount('ECE'),
        colorClass: 'bg-outline',
        tag: deptCount('ECE') === 0 ? 'Awaiting RSVPs' : undefined,
      },
      {
        branchKey: 'OTHER',
        name: 'Mechanical, Civil & Allied',
        percentage: genuineCount > 0 ? Number(((deptCount('OTHER') / genuineCount) * 100).toFixed(1)) : 0,
        studentsCount: deptCount('OTHER'),
        colorClass: 'bg-surface-container-highest',
      },
    ];

    // Real-time ambassador ranking based strictly on genuine verified referrals
    const liveAmbassadors = AMBASSADORS_ROSTER.map((amb) => {
      const genuineAmbRegs = genuineRecords.filter(
        (r) => r.referredBy?.toUpperCase() === amb.code.toUpperCase()
      ).length;
      return {
        ...amb,
        verifiedRegs: genuineAmbRegs,
      };
    }).sort((a, b) => b.verifiedRegs - a.verifiedRegs).map((amb, idx) => ({
      ...amb,
      rank: idx + 1,
    }));

    // 7-Day Velocity strictly derived from genuine registration timestamps
    const now = Date.now();
    const velocity = Array.from({ length: 7 }, (_, i) => {
      const dayStart = new Date(now - (6 - i) * 24 * 60 * 60 * 1000);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(now - (5 - i) * 24 * 60 * 60 * 1000);
      dayEnd.setHours(0, 0, 0, 0);

      const dayRegs = genuineRecords.filter((r) => {
        const d = new Date(r.createdAt);
        return d >= dayStart && d < (i === 6 ? new Date(now + 60000) : dayEnd);
      });
      const referrals = dayRegs.filter((r) => r.channel === 'peer' || r.channel === 'ambassador').length;
      const direct = dayRegs.length - referrals;
      const dayDate = new Date(now - (6 - i) * 24 * 60 * 60 * 1000);
      const monthStr = dayDate.toLocaleString('en-US', { month: 'short' });
      const dayNum = dayDate.getDate();
      const dateLabel = i === 6 ? 'Day 7 (Today)' : `Day ${i + 1} (${monthStr} ${dayNum})`;
      return {
        dayNumber: i + 1,
        dateLabel,
        directRegs: direct,
        referralRegs: referrals,
      };
    });

    // Rule-based campaign recommendations
    const recommendations = [
      {
        id: 'rec-live',
        title: 'Launch Peer Referral Challenge Across Active Departments',
        category: 'Acquisition Acceleration',
        badge: 'Rule-Based Action',
        description: `Currently ${genuineCount} of ${target} unique registrations achieved (${percentageAchieved}%). Recommend distributing the smart project card to student WhatsApp class reps to initiate peer study squad multipliers.`,
        primaryAction: 'Trigger Ambassador Prompt',
        secondaryAction: 'View Low-Converting Channels',
        severity: 'urgent' as const,
      },
    ];

    return {
      uniqueRegistrations: genuineCount,
      target,
      percentageAchieved,
      regsToday,
      regsTodayGrowth,
      regsRemaining,
      daysLeft: 5,
      budgetTotal,
      budgetSpent,
      budgetBurnPercentage,
      costPerRegistration,
      referralRate,
      viralLinksCount,
      viralKFactor,
      recommendations,
      velocity,
      channels,
      ambassadors: liveAmbassadors,
      departments,
      recentRegistrations: genuineRecords,
      isDemoMode: false,
      genuineRegistrationsCount: allGenuineRecords.length,
      demoRegistrationsCount: demoRecords.length,
      testRegistrationsCount,
    };
  }


  // -------------------------------------------------------------------------
  // 2. SIMULATED DEMO BASELINE PROTOTYPE (Matching Stitch Dashboard reference)
  // -------------------------------------------------------------------------
  const baseDemoCount = 342;
  const genuineCount = genuineRecords.length;
  const totalUnique = baseDemoCount + genuineCount;
  const percentageAchieved = Number(((totalUnique / target) * 100).toFixed(1));
  const regsRemaining = Math.max(0, target - totalUnique);

  const budgetSpent = Math.min(2000, 1240 + genuineCount * 2);
  const costPerRegistration = Number((budgetSpent / totalUnique).toFixed(2));
  const budgetBurnPercentage = Number(((budgetSpent / budgetTotal) * 100).toFixed(1));
  const regsToday = 48 + genuineCount;

  const velocity = [
    { dayNumber: 1, dateLabel: 'Day 1 (Oct 19)', directRegs: 18, referralRegs: 6 },
    { dayNumber: 2, dateLabel: 'Day 2 (Oct 20)', directRegs: 24, referralRegs: 8 },
    { dayNumber: 3, dateLabel: 'Day 3 (Oct 21)', directRegs: 32, referralRegs: 12 },
    { dayNumber: 4, dateLabel: 'Day 4 (Oct 22)', directRegs: 40, referralRegs: 15 },
    { dayNumber: 5, dateLabel: 'Day 5 (Oct 23)', directRegs: 42, referralRegs: 19 },
    { dayNumber: 6, dateLabel: 'Day 6 (Oct 24)', directRegs: 41, referralRegs: 18 },
    {
      dayNumber: 7,
      dateLabel: 'Day 7 (Today)',
      directRegs: 47 + Math.floor(genuineCount * 0.6),
      referralRegs: 20 + Math.ceil(genuineCount * 0.4),
    },
  ];

  const channels = [
    {
      id: 'whatsapp' as AcquisitionChannel,
      name: 'WhatsApp Study Groups',
      icon: 'chat',
      regs: 164 + Math.round(genuineCount * 0.4),
      percentage: 47.9,
      conversionRate: '32.0% (Simulated)',
      highlightText: 'Highest Yield',
      highlightType: 'primary' as const,
    },
    {
      id: 'ambassador' as AcquisitionChannel,
      name: 'Campus Ambassadors',
      icon: 'badge',
      regs: 98 + Math.round(genuineCount * 0.3),
      percentage: 28.6,
      conversionRate: '24.1% (Simulated)',
      highlightText: '14 College Reps',
      highlightType: 'neutral' as const,
    },
    {
      id: 'social' as AcquisitionChannel,
      name: 'Instagram / LinkedIn',
      icon: 'photo_camera',
      regs: 52 + Math.round(genuineCount * 0.15),
      percentage: 15.2,
      conversionRate: '12.4% (Simulated)',
      highlightText: 'Underperforming CAC',
      highlightType: 'warning' as const,
    },
    {
      id: 'direct' as AcquisitionChannel,
      name: 'Direct / College Portals',
      icon: 'language',
      regs: 28 + Math.round(genuineCount * 0.15),
      percentage: 8.3,
      conversionRate: '19.0% (Simulated)',
      highlightText: 'Notice Boards & LMS',
      highlightType: 'neutral' as const,
    },
  ];

  const departments: DepartmentStat[] = [
    {
      branchKey: 'CSE',
      name: 'Computer Science & Engineering',
      percentage: 44,
      studentsCount: Math.round(totalUnique * 0.44),
      colorClass: 'bg-primary',
    },
    {
      branchKey: 'AIML',
      name: 'Artificial Intelligence & Data Science',
      percentage: 26,
      studentsCount: Math.round(totalUnique * 0.26),
      colorClass: 'bg-secondary-container',
    },
    {
      branchKey: 'IT',
      name: 'Information Technology',
      percentage: 15,
      studentsCount: Math.round(totalUnique * 0.15),
      colorClass: 'bg-primary-container',
    },
    {
      branchKey: 'ECE',
      name: 'Electronics & Communication (ECE)',
      percentage: 11,
      studentsCount: Math.round(totalUnique * 0.11),
      colorClass: 'bg-outline',
      tag: 'Low',
    },
    {
      branchKey: 'OTHER',
      name: 'Mechanical, Civil & Allied',
      percentage: 4,
      studentsCount: Math.round(totalUnique * 0.04),
      colorClass: 'bg-surface-container-highest',
    },
  ];

  const recommendations = [
    {
      id: 'rec-saturation',
      title: 'Channel Saturation & Ambassador Activation',
      category: 'Channel Saturation & Ambassador Activation',
      badge: 'Automated Campaign Recommendation #1',
      description:
        'ECE and IT departments show 42% lower adoption despite high click-throughs on WhatsApp. Meanwhile, 6 of 14 student ambassadors have 0 active shares. Recommend dispatching the WhatsApp Batchmate Template to the 6 inactive ambassadors and triggering targeted departmental email alerts.',
      primaryAction: 'Trigger Ambassador Prompt',
      secondaryAction: 'View Low-Converting Channels',
      severity: 'info' as const,
    },
  ];

  return {
    uniqueRegistrations: totalUnique,
    target,
    percentageAchieved,
    regsToday,
    regsTodayGrowth: '+18% (Simulated Baseline)',
    regsRemaining,
    daysLeft: 5,
    budgetTotal,
    budgetSpent,
    budgetBurnPercentage,
    costPerRegistration: `₹${costPerRegistration}`,
    referralRate: 28.6,
    viralLinksCount: 98 + genuineCount,
    viralKFactor: '1.4x (Simulated)',
    recommendations,
    velocity,
    channels,
    ambassadors: AMBASSADORS_ROSTER,
    departments,
    recentRegistrations: allRegistrations.slice(0, 10),
    isDemoMode: true,
    genuineRegistrationsCount: genuineCount,
    demoRegistrationsCount: demoRecords.length,
    testRegistrationsCount: allGenuineRecords.filter((r) => isTestRegistration(r)).length,
  };
}
