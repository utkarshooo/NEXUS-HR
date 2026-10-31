export type UserRole = 'SUPER_ADMIN' | 'HR_DIRECTOR' | 'TEAM_LEAD' | 'EMPLOYEE';

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  designation: string;
  department: string;
  employeeCode: string;
}

export type EmploymentStatus = 'ACTIVE' | 'ON_LEAVE' | 'PROBATION' | 'TERMINATED';
export type EmploymentType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERN';
export type WorkMode = 'IN_OFFICE' | 'HYBRID' | 'REMOTE';
export type FlightRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface FlightRiskFactor {
  factor: string;
  impact: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' | 'SEVERE';
  weight: number; // 0 - 100
  detail: string;
}

export interface LeaveBalances {
  annual: number;
  annualTotal: number;
  sick: number;
  sickTotal: number;
  casual: number;
  casualTotal: number;
  parental: number;
  parentalTotal: number;
}

export interface Employee {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  phone: string;
  department: string;
  departmentId: string;
  designation: string;
  managerId: string | null;
  managerName: string | null;
  dateOfJoining: string;
  employmentType: EmploymentType;
  workMode: WorkMode;
  location: string;
  status: EmploymentStatus;
  salary: {
    baseAnnual: number;
    currency: string;
    lastHikeDate: string;
    lastHikePercentage: number;
  };
  performance: {
    rating: number; // 1 to 5
    lastReviewDate: string;
    potentialNineBox: 'High' | 'Medium' | 'Low';
    performanceNineBox: 'High' | 'Medium' | 'Low';
    categoryNineBox: string; // e.g., 'Star / High Potential'
  };
  flightRisk: {
    score: number; // 0 to 100
    level: FlightRiskLevel;
    factors: FlightRiskFactor[];
    aiRetentionRecommendation: string;
  };
  leaveBalances: LeaveBalances;
  skills: string[];
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  durationHours: number;
  status: 'PRESENT' | 'LATE' | 'HALF_DAY' | 'ABSENT' | 'ON_LEAVE';
  workMode: WorkMode;
  ipAddress: string;
  deviceInfo: string;
}

export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
export type LeaveType = 'ANNUAL' | 'SICK' | 'CASUAL' | 'PARENTAL' | 'UNPAID';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar: string;
  department: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  appliedAt: string;
  approvedBy?: string;
  rejectionReason?: string;
}

export interface PayrollEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  designation: string;
  department: string;
  month: number; // 1 - 12
  year: number;
  basicSalary: number;
  hra: number;
  specialAllowance: number;
  bonus: number;
  grossEarnings: number;
  providentFund: number;
  taxWithheld: number;
  healthInsurance: number;
  totalDeductions: number;
  netSalary: number;
  currency: string;
  status: 'DRAFT' | 'PROCESSED' | 'PAID' | 'FAILED';
  paidOn?: string;
}

export interface KeyResult {
  id: string;
  title: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  progress: number;
}

export interface OKRGoal {
  id: string;
  employeeId: string;
  title: string;
  category: 'COMPANY' | 'DEPARTMENT' | 'INDIVIDUAL';
  quarter: string; // e.g., 'Q4 2026'
  progress: number; // 0 - 100
  status: 'ON_TRACK' | 'AT_RISK' | 'BEHIND' | 'COMPLETED';
  keyResults: KeyResult[];
}

export interface PolicyDocument {
  id: string;
  title: string;
  category: string;
  version: string;
  lastUpdated: string;
  citationRef: string;
  snippet: string;
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  citations?: Array<{ docTitle: string; ref: string }>;
  suggestedActions?: string[];
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: 'AI_INSIGHT' | 'APPROVAL' | 'PAYROLL' | 'SECURITY';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}
