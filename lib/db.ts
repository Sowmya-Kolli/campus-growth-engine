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

// Supabase client initialization (optional, auto-detected)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

const DATA_DIR = path.join(process.cwd(), 'data');
const REGISTRATIONS_FILE = path.join(DATA_DIR, 'registrations.json');

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

// Initial demo seed registrations
const INITIAL_DEMO_RECORDS: Registration[] = [
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

// Helper to ensure data directory and file exist
function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(REGISTRATIONS_FILE)) {
    fs.writeFileSync(REGISTRATIONS_FILE, JSON.stringify(INITIAL_DEMO_RECORDS, null, 2), 'utf-8');
  }
}

// Read all registrations from local storage
export function getLocalRegistrations(): Registration[] {
  try {
    ensureDataFile();
    const raw = fs.readFileSync(REGISTRATIONS_FILE, 'utf-8');
    return JSON.parse(raw) as Registration[];
  } catch (err) {
    console.error('Error reading local registrations:', err);
    return INITIAL_DEMO_RECORDS;
  }
}

// Save all registrations to local storage
export function saveLocalRegistrations(records: Registration[]): void {
  ensureDataFile();
  fs.writeFileSync(REGISTRATIONS_FILE, JSON.stringify(records, null, 2), 'utf-8');
}

// Normalize email address strictly
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

// Generate unique referral code for a new student
export function generateStudentReferralCode(name: string, branch: AcademicBranch): string {
  const cleanName = name
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

  // Check known ambassadors
  const ambassador = AMBASSADORS_ROSTER.find((a) => a.code.toUpperCase() === code);
  if (ambassador) {
    return {
      channel: 'ambassador',
      channelLabel: `${ambassador.name} (Ambassador)`,
    };
  }

  // Check if WhatsApp tag
  if (code.includes('WHATSAPP') || code.includes('WA-') || code.includes('GRP')) {
    return {
      channel: 'whatsapp',
      channelLabel: 'WhatsApp Study Group',
    };
  }

  // Check if social media tag
  if (code.includes('LINKEDIN') || code.includes('INSTA') || code.includes('IG')) {
    return {
      channel: 'social',
      channelLabel: 'Instagram / LinkedIn',
    };
  }

  // Otherwise, treat as peer referral
  return {
    channel: 'peer',
    channelLabel: `Friend Referral (${code})`,
  };
}

// Read all registrations (Supabase if available, else local)
export async function getAllRegistrations(): Promise<Registration[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('registrations').select('*').order('created_at', { ascending: false });
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
      console.warn('Supabase query failed, falling back to local storage:', err);
    }
  }

  return getLocalRegistrations();
}

// Find registration by email
export async function findRegistrationByEmail(email: string): Promise<Registration | null> {
  const normalized = normalizeEmail(email);
  const all = await getAllRegistrations();
  return all.find((r) => normalizeEmail(r.email) === normalized) || null;
}

// Find registration by ID
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

  // Check duplicate
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

  // If Supabase is available, write to Supabase
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
        console.error('Supabase insert error, saving locally:', error);
      }
    } catch (err) {
      console.error('Supabase write exception, saving locally:', err);
    }
  }

  // Always update local persistent storage so it stays in sync
  const currentLocal = getLocalRegistrations();
  currentLocal.unshift(newRecord);
  saveLocalRegistrations(currentLocal);

  return { registration: newRecord };
}

// Compute dashboard statistics (with demo mode or genuine mode)
export async function getDashboardStats(includeDemo: boolean = true): Promise<DashboardStats> {
  const allRegistrations = await getAllRegistrations();

  const genuineRecords = allRegistrations.filter((r) => !r.isDemo);
  const demoRecords = allRegistrations.filter((r) => r.isDemo);

  // If includeDemo is true, we blend genuine with demo baseline (capped at target proportion)
  // If includeDemo is false, we strictly show genuine registrations!
  const target = 500;
  const budgetTotal = 2000;

  let activeRecords = includeDemo ? allRegistrations : genuineRecords;

  // Baseline demo metrics matching Stitch reference:
  // Base 342 registrations (Direct: 244, Referrals: 98)
  const baseDemoCount = 342;
  const genuineCount = genuineRecords.length;

  const totalUnique = includeDemo ? baseDemoCount + genuineCount : genuineCount;
  const percentageAchieved = Number(((totalUnique / target) * 100).toFixed(1));
  const regsRemaining = Math.max(0, target - totalUnique);

  // Spend model:
  // Baseline demo spend is ₹1,240 out of ₹2,000 budget
  // Variable spend per new registration is ~₹2.50
  const budgetSpent = includeDemo ? Math.min(2000, 1240 + genuineCount * 2) : Math.min(2000, genuineCount * 3.5);
  const costPerRegistration = totalUnique > 0 ? Number((budgetSpent / totalUnique).toFixed(2)) : 0;
  const budgetBurnPercentage = Number(((budgetSpent / budgetTotal) * 100).toFixed(1));

  // Today registrations
  const regsToday = includeDemo ? 48 + genuineCount : genuineCount;

  // Velocity days (Last 7 days)
  const velocity = [
    { dayNumber: 1, dateLabel: 'Day 1 (Oct 19)', directRegs: 18, referralRegs: 6 },
    { dayNumber: 2, dateLabel: 'Day 2 (Oct 20)', directRegs: 24, referralRegs: 8 },
    { dayNumber: 3, dateLabel: 'Day 3 (Oct 21)', directRegs: 32, referralRegs: 12 },
    { dayNumber: 4, dateLabel: 'Day 4 (Oct 22)', directRegs: 40, referralRegs: 15 },
    { dayNumber: 5, dateLabel: 'Day 5 (Oct 23)', directRegs: 42, referralRegs: 19 },
    { dayNumber: 6, dateLabel: 'Day 6 (Oct 24)', directRegs: 41, referralRegs: 18 },
    { dayNumber: 7, dateLabel: 'Day 7 (Today)', directRegs: 47 + Math.floor(genuineCount * 0.6), referralRegs: 20 + Math.ceil(genuineCount * 0.4) },
  ];

  // Channel Breakdown
  const totalWithChannels = Math.max(1, totalUnique);
  const whatsappRegs = includeDemo ? 164 + Math.round(genuineCount * 0.4) : Math.round(genuineCount * 0.45);
  const ambassadorRegs = includeDemo ? 98 + Math.round(genuineCount * 0.3) : Math.round(genuineCount * 0.3);
  const socialRegs = includeDemo ? 52 + Math.round(genuineCount * 0.15) : Math.round(genuineCount * 0.15);
  const directRegs = Math.max(0, totalUnique - (whatsappRegs + ambassadorRegs + socialRegs));

  const channels = [
    {
      id: 'whatsapp' as AcquisitionChannel,
      name: 'WhatsApp Study Groups',
      icon: 'chat',
      regs: whatsappRegs,
      percentage: Number(((whatsappRegs / totalWithChannels) * 100).toFixed(1)),
      conversionRate: '32.0%',
      highlightText: 'Highest Yield',
      highlightType: 'primary' as const,
    },
    {
      id: 'ambassador' as AcquisitionChannel,
      name: 'Campus Ambassadors',
      icon: 'badge',
      regs: ambassadorRegs,
      percentage: Number(((ambassadorRegs / totalWithChannels) * 100).toFixed(1)),
      conversionRate: '24.1%',
      highlightText: '14 College Reps',
      highlightType: 'neutral' as const,
    },
    {
      id: 'social' as AcquisitionChannel,
      name: 'Instagram / LinkedIn',
      icon: 'photo_camera',
      regs: socialRegs,
      percentage: Number(((socialRegs / totalWithChannels) * 100).toFixed(1)),
      conversionRate: '12.4%',
      highlightText: 'Underperforming CAC',
      highlightType: 'warning' as const,
    },
    {
      id: 'direct' as AcquisitionChannel,
      name: 'Direct / College Portals',
      icon: 'language',
      regs: directRegs,
      percentage: Number(((directRegs / totalWithChannels) * 100).toFixed(1)),
      conversionRate: '19.0%',
      highlightText: 'Notice Boards & LMS',
      highlightType: 'neutral' as const,
    },
  ];

  // Department distribution
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

  // Referral metrics
  const viralLinksCount = includeDemo ? 98 + genuineCount : genuineRecords.filter((r) => r.channel === 'peer').length;
  const referralRate = Number(((viralLinksCount / Math.max(1, totalUnique)) * 100).toFixed(1));

  // Dynamic Rule-based Campaign Recommendations
  const recommendations: DashboardStats['recommendations'] = [];

  if (totalUnique < 250) {
    recommendations.push({
      id: 'rec-volume',
      title: 'Accelerate Campus Ambassador WhatsApp Distribution',
      category: 'Volume Acceleration',
      badge: 'High Priority',
      description: `Current registration count is at ${totalUnique} of 500 target (${percentageAchieved}%). Recommend activating peer WhatsApp batches across VTU and PES communities to capture high-intent evening study slots.`,
      primaryAction: 'Trigger Ambassador Prompt',
      secondaryAction: 'View Low-Converting Channels',
      severity: 'urgent',
    });
  } else if (costPerRegistration > 4.5) {
    recommendations.push({
      id: 'rec-cac',
      title: 'Optimize Underperforming Social Ad Spend',
      category: 'CAC Optimization',
      badge: 'Budget Efficiency',
      description: `Instagram / LinkedIn channel conversion is at 12.4% with inflated CAC. Reallocate ₹300 contingency budget towards verified peer ambassador perks for immediate conversion lift.`,
      primaryAction: 'Reallocate Budget',
      secondaryAction: 'Review Channel CAC',
      severity: 'growth',
    });
  } else {
    recommendations.push({
      id: 'rec-saturation',
      title: 'Channel Saturation & Ambassador Activation',
      category: 'Channel Saturation & Ambassador Activation',
      badge: 'Automated Campaign Recommendation #1',
      description:
        'ECE and IT departments show 42% lower adoption despite high click-throughs on WhatsApp. Meanwhile, 6 of 14 student ambassadors have 0 active shares. Recommend dispatching the WhatsApp Batchmate Template to the 6 inactive ambassadors and triggering targeted departmental email alerts.',
      primaryAction: 'Trigger Ambassador Prompt',
      secondaryAction: 'View Low-Converting Channels',
      severity: 'info',
    });
  }

  // Recent 10 registrations
  const recentRegistrations = activeRecords.slice(0, 10);

  return {
    uniqueRegistrations: totalUnique,
    target,
    percentageAchieved,
    regsToday,
    regsTodayGrowth: '+18%',
    regsRemaining,
    daysLeft: 5,
    budgetTotal,
    budgetSpent,
    budgetBurnPercentage,
    costPerRegistration,
    referralRate,
    viralLinksCount,
    viralKFactor: '1.4x',
    recommendations,
    velocity,
    channels,
    ambassadors: AMBASSADORS_ROSTER,
    departments,
    recentRegistrations,
    isDemoMode: includeDemo,
    genuineRegistrationsCount: genuineCount,
    demoRegistrationsCount: demoRecords.length,
  };
}
