export type AcademicBranch = 'CSE' | 'IT' | 'AIML' | 'ECE' | 'OTHER';

export type ProjectInterest = 'Chatbot' | 'Resume & Career Tools' | 'Study Assistant' | 'Data Dashboard';

export type CodingLevel = 'Beginner' | 'Basic' | 'Intermediate';

export type AcquisitionChannel = 'whatsapp' | 'ambassador' | 'social' | 'direct' | 'peer';

export interface Milestone {
  timeframe: string;
  milestoneNumber: number;
  title: string;
  desc: string;
}

export interface ProjectBlueprint {
  id: string;
  interest: ProjectInterest;
  title: string;
  category: string;
  feasibility: string;
  desc: string;
  detailedDesc: string;
  targetBranches: AcademicBranch[];
  difficulty: 'Beginner' | 'Intermediate' | 'All Levels';
  techStack: string[];
  milestones: Milestone[];
  portfolioImpact: string;
}

export interface Registration {
  id: string;
  ticketNumber: string;
  name: string;
  email: string;
  college: string;
  branch: AcademicBranch;
  branchLabel: string;
  interest: ProjectInterest;
  codingLevel: CodingLevel;
  projectId: string;
  projectTitle: string;
  referralCode: string;
  referredBy?: string | null;
  channel: AcquisitionChannel;
  channelLabel: string;
  createdAt: string;
  isDemo?: boolean;
}

export interface Ambassador {
  id: string;
  code: string;
  name: string;
  avatarUrl: string;
  college: string;
  branch: string;
  year: string;
  badge: string;
  shares: number;
  verifiedRegs: number;
  rank: number;
}

export interface ChannelStats {
  id: AcquisitionChannel;
  name: string;
  icon: string;
  regs: number;
  percentage: number;
  conversionRate: string;
  highlightText: string;
  highlightType: 'success' | 'warning' | 'neutral' | 'primary';
}

export interface DepartmentStat {
  branchKey: AcademicBranch;
  name: string;
  percentage: number;
  studentsCount: number;
  colorClass: string;
  tag?: string;
}

export interface VelocityDay {
  dayNumber: number;
  dateLabel: string;
  directRegs: number;
  referralRegs: number;
}

export interface CampaignRecommendation {
  id: string;
  title: string;
  category: string;
  badge: string;
  description: string;
  primaryAction: string;
  secondaryAction: string;
  severity: 'urgent' | 'growth' | 'info';
}

export interface DashboardStats {
  uniqueRegistrations: number;
  target: number;
  percentageAchieved: number;
  regsToday: number;
  regsTodayGrowth: string;
  regsRemaining: number;
  daysLeft: number;
  budgetTotal: number;
  budgetSpent: number;
  budgetBurnPercentage: number;
  costPerRegistration: number;
  referralRate: number;
  viralLinksCount: number;
  viralKFactor: string;
  recommendations: CampaignRecommendation[];
  velocity: VelocityDay[];
  channels: ChannelStats[];
  ambassadors: Ambassador[];
  departments: DepartmentStat[];
  recentRegistrations: Registration[];
  isDemoMode: boolean;
  genuineRegistrationsCount: number;
  demoRegistrationsCount: number;
}
