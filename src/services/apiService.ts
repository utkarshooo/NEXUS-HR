import {
  CurrentUser,
  Employee,
  LeaveRequest,
  PayrollEntry,
  OKRGoal,
  PolicyDocument,
  SystemNotification,
  AIChatMessage,
  WorkMode,
} from '../types';
import {
  ROLE_PRESETS,
  INITIAL_EMPLOYEES,
  INITIAL_LEAVE_REQUESTS,
  INITIAL_PAYROLL,
  INITIAL_OKRS,
  INITIAL_POLICIES,
  INITIAL_NOTIFICATIONS,
} from './mockData';

const STORAGE_KEYS = {
  CURRENT_USER: 'nexushr_current_user',
  EMPLOYEES: 'nexushr_employees',
  LEAVES: 'nexushr_leaves',
  PAYROLL: 'nexushr_payroll',
  OKRS: 'nexushr_okrs',
  NOTIFICATIONS: 'nexushr_notifications',
  CLOCK_STATE: 'nexushr_clock_state',
  CHAT_HISTORY: 'nexushr_chat_history',
  CONFIG: 'nexushr_config',
};

export interface AppConfig {
  backendMode: 'MOCK' | 'SPRING_BOOT';
  apiUrl: string;
  theme: 'dark' | 'light';
  autoAiRefresh: boolean;
}

export class NexusHRService {
  private static load<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private static save<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }

  // Configuration
  static getConfig(): AppConfig {
    return this.load<AppConfig>(STORAGE_KEYS.CONFIG, {
      backendMode: 'MOCK',
      apiUrl: 'http://localhost:8080/api/v1',
      theme: 'dark',
      autoAiRefresh: true,
    });
  }

  static saveConfig(config: AppConfig): void {
    this.save(STORAGE_KEYS.CONFIG, config);
  }

  // Current User / Role Switcher
  static getCurrentUser(): CurrentUser {
    return this.load<CurrentUser>(STORAGE_KEYS.CURRENT_USER, ROLE_PRESETS.SUPER_ADMIN);
  }

  static setCurrentUser(roleKey: keyof typeof ROLE_PRESETS): CurrentUser {
    const user = ROLE_PRESETS[roleKey] || ROLE_PRESETS.SUPER_ADMIN;
    this.save(STORAGE_KEYS.CURRENT_USER, user);
    return user;
  }

  // Employees
  static getEmployees(): Employee[] {
    return this.load<Employee[]>(STORAGE_KEYS.EMPLOYEES, INITIAL_EMPLOYEES);
  }

  static getEmployeeById(id: string): Employee | undefined {
    return this.getEmployees().find((e) => e.id === id);
  }

  static saveEmployee(employee: Employee): void {
    const list = this.getEmployees();
    const index = list.findIndex((e) => e.id === employee.id);
    if (index >= 0) {
      list[index] = employee;
    } else {
      list.unshift(employee);
    }
    this.save(STORAGE_KEYS.EMPLOYEES, list);
  }

  // Attrition Simulation
  static simulateRetentionIntervention(
    employeeId: string,
    params: {
      salaryIncreasePct: number;
      workMode: WorkMode;
      promotionTrack: boolean;
      mentorshipAssigned: boolean;
    }
  ): { updatedScore: number; newLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'; delta: number } {
    const employees = this.getEmployees();
    const emp = employees.find((e) => e.id === employeeId);
    if (!emp) return { updatedScore: 50, newLevel: 'MEDIUM', delta: 0 };

    const initialScore = emp.flightRisk.score;
    let reduction = 0;

    // Compensation adjustment impact
    reduction += Math.min(params.salaryIncreasePct * 2.2, 35);
    // Work flexibility impact
    if (params.workMode === 'HYBRID' || params.workMode === 'REMOTE') reduction += 12;
    // Career growth impact
    if (params.promotionTrack) reduction += 18;
    // Mentorship impact
    if (params.mentorshipAssigned) reduction += 8;

    const newScore = Math.max(8, Math.round(initialScore - reduction));
    let newLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
    if (newScore > 70) newLevel = 'CRITICAL';
    else if (newScore > 50) newLevel = 'HIGH';
    else if (newScore > 25) newLevel = 'MEDIUM';

    // Update employee record
    emp.flightRisk.score = newScore;
    emp.flightRisk.level = newLevel;
    this.save(STORAGE_KEYS.EMPLOYEES, employees);

    return { updatedScore: newScore, newLevel, delta: initialScore - newScore };
  }

  // Leaves
  static getLeaves(): LeaveRequest[] {
    return this.load<LeaveRequest[]>(STORAGE_KEYS.LEAVES, INITIAL_LEAVE_REQUESTS);
  }

  static applyLeave(req: Omit<LeaveRequest, 'id' | 'appliedAt' | 'status'>): LeaveRequest {
    const leaves = this.getLeaves();
    const newLeave: LeaveRequest = {
      ...req,
      id: `leave-${Date.now().toString().slice(-6)}`,
      appliedAt: new Date().toISOString(),
      status: 'PENDING',
    };
    leaves.unshift(newLeave);
    this.save(STORAGE_KEYS.LEAVES, leaves);
    return newLeave;
  }

  static updateLeaveStatus(id: string, status: 'APPROVED' | 'REJECTED', approverName: string): void {
    const leaves = this.getLeaves();
    const item = leaves.find((l) => l.id === id);
    if (item) {
      item.status = status;
      item.approvedBy = approverName;
      this.save(STORAGE_KEYS.LEAVES, leaves);
    }
  }

  // Payroll
  static getPayroll(): PayrollEntry[] {
    return this.load<PayrollEntry[]>(STORAGE_KEYS.PAYROLL, INITIAL_PAYROLL);
  }

  static processBatchPayroll(month: number, year: number): { processedCount: number; totalDisbursed: number } {
    const employees = this.getEmployees();
    const currentPayroll = this.getPayroll();

    let totalDisbursed = 0;
    const newEntries: PayrollEntry[] = [];

    for (const emp of employees) {
      const monthlyBase = Math.round(emp.salary.baseAnnual / 12);
      const hra = Math.round(monthlyBase * 0.4);
      const special = Math.round(monthlyBase * 0.25);
      const gross = monthlyBase + hra + special;
      const pf = Math.round(monthlyBase * 0.12);
      const tax = Math.round(gross * 0.22);
      const insurance = 300;
      const totalDed = pf + tax + insurance;
      const net = gross - totalDed;

      totalDisbursed += net;

      newEntries.push({
        id: `pay-${year}-${month}-${emp.employeeCode}`,
        employeeId: emp.id,
        employeeName: `${emp.firstName} ${emp.lastName}`,
        employeeCode: emp.employeeCode,
        designation: emp.designation,
        department: emp.department,
        month,
        year,
        basicSalary: monthlyBase,
        hra,
        specialAllowance: special,
        bonus: 0,
        grossEarnings: gross,
        providentFund: pf,
        taxWithheld: tax,
        healthInsurance: insurance,
        totalDeductions: totalDed,
        netSalary: net,
        currency: emp.salary.currency,
        status: 'PAID',
        paidOn: new Date().toISOString().split('T')[0],
      });
    }

    this.save(STORAGE_KEYS.PAYROLL, newEntries);
    return { processedCount: newEntries.length, totalDisbursed };
  }

  // OKRs
  static getOKRs(): OKRGoal[] {
    return this.load<OKRGoal[]>(STORAGE_KEYS.OKRS, INITIAL_OKRS);
  }

  // Notifications
  static getNotifications(): SystemNotification[] {
    return this.load<SystemNotification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  }

  static markNotificationRead(id: string): void {
    const notifs = this.getNotifications();
    const item = notifs.find((n) => n.id === id);
    if (item) {
      item.read = true;
      this.save(STORAGE_KEYS.NOTIFICATIONS, notifs);
    }
  }

  // Clock State
  static getClockState(): { isClockedIn: boolean; clockInTime: string | null; workMode: WorkMode } {
    return this.load(STORAGE_KEYS.CLOCK_STATE, {
      isClockedIn: false,
      clockInTime: null,
      workMode: 'IN_OFFICE',
    });
  }

  static toggleClock(mode: WorkMode = 'IN_OFFICE'): { isClockedIn: boolean; clockInTime: string | null; workMode: WorkMode } {
    const current = this.getClockState();
    const updated = {
      isClockedIn: !current.isClockedIn,
      clockInTime: !current.isClockedIn ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null,
      workMode: mode,
    };
    this.save(STORAGE_KEYS.CLOCK_STATE, updated);
    return updated;
  }

  // AI Policy Assistant (RAG Pipeline Simulation)
  static getChatHistory(): AIChatMessage[] {
    return this.load<AIChatMessage[]>(STORAGE_KEYS.CHAT_HISTORY, [
      {
        id: 'msg-welcome',
        sender: 'assistant',
        timestamp: 'Just now',
        text: 'Hello! I am **Nexus Copilot**, your enterprise HR & workforce intelligence assistant powered by **Spring AI**. Ask me anything about internal handbooks, parental leaves, health insurance coverage, 401(k) vesting, or flight risk mitigation!',
        suggestedActions: [
          'What is our parental leave entitlement?',
          'How does the 4-year equity vesting work?',
          'What are the travel and internet reimbursements?',
          'How can I request medical insurance top-up?',
        ],
      },
    ]);
  }

  static async askPolicyCopilot(query: string): Promise<AIChatMessage> {
    const qLower = query.toLowerCase();
    let replyText = '';
    let citations: Array<{ docTitle: string; ref: string }> = [];

    if (qLower.includes('parental') || qLower.includes('maternity') || qLower.includes('paternity') || qLower.includes('baby')) {
      replyText = `Under the **Enterprise Parental & Family Bonding Leave Standard (v4.2)**:
- **Duration**: Up to **16 weeks of 100% fully paid leave**.
- **Eligibility**: All full-time employees upon completion of 90 days.
- **Flexibility**: Can be taken continuously or in up to two split blocks within the child's first 12 months.
- **Benefits Continuation**: Full health and equity vesting remain active throughout the leave period.`;
      citations = [{ docTitle: 'Enterprise Parental Leave Standard v4.2', ref: 'Section 4.3' }];
    } else if (qLower.includes('equity') || qLower.includes('stock') || qLower.includes('vest') || qLower.includes('rsu')) {
      replyText = `According to our **Equity Incentive Plan (2024–2028)**:
- **Vesting Schedule**: 4-year schedule with a standard **1-year cliff (25%)**.
- **Subsequent Vesting**: Monthly incremental vesting of **1/48th** of total granted shares.
- **Merit Refreshers**: Annual equity performance refreshes are reviewed each Q1 by the Compensation Committee.`;
      citations = [{ docTitle: 'Equity Incentive Plan 2024-2028', ref: 'Article IV: Vesting Schedules' }];
    } else if (qLower.includes('insurance') || qLower.includes('health') || qLower.includes('medical') || qLower.includes('dental')) {
      replyText = `NexusHR provides **Tier-1 Platinum Comprehensive Health Coverage**:
- **Premiums**: 100% employer-covered for employees; 85% covered for legal dependents.
- **Wellness Stipend**: **$1,200 annual credit** for gym, therapy, or home wellness equipment.
- **Preventative Care**: Fully covered with zero in-network co-pay.`;
      citations = [{ docTitle: 'Benefits Guide 2026', ref: 'PPO & HDHP Summary' }];
    } else if (qLower.includes('remote') || qLower.includes('internet') || qLower.includes('travel') || qLower.includes('equipment')) {
      replyText = `Under the **Workplace Operations & Ergonomics Standard (v5.1)**:
- **Workstation Grant**: $1,500 one-time reimbursement for ergonomic chairs, monitors, and desks.
- **Monthly Utility Stipend**: $75/month direct expense credit for high-speed fiber broadband.
- **Security Prerequisite**: SOC-2 compliant disk encryption and Nexus Guard VPN required for all remote nodes.`;
      citations = [{ docTitle: 'Workplace Handbook v5.1', ref: 'Article VII: Remote Operations' }];
    } else {
      replyText = `Based on NexusHR's indexed knowledge base:
I have cross-referenced your query regarding *" ${query} "* with our internal policy repositories, enterprise benefits handbook, and code of conduct.
- NexusHR promotes transparency, merit-based compensation, and supportive flexible workplace conditions.
- For specialized individual adjustments, you can also submit a direct HR request through the People Operations drawer.`;
      citations = [{ docTitle: 'NexusHR Global Employee Handbook', ref: 'General Policies 2026' }];
    }

    const newMsg: AIChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: replyText,
      citations,
      suggestedActions: [
        'Check my leave balance',
        'Review current month payslip',
        'Simulate flight risk intervention',
      ],
    };

    const history = this.getChatHistory();
    history.push({
      id: `msg-${Date.now() - 1}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: query,
    });
    history.push(newMsg);
    this.save(STORAGE_KEYS.CHAT_HISTORY, history);

    return newMsg;
  }

  // Reset to initial demo dataset
  static resetDemoData(): void {
    localStorage.removeItem(STORAGE_KEYS.EMPLOYEES);
    localStorage.removeItem(STORAGE_KEYS.LEAVES);
    localStorage.removeItem(STORAGE_KEYS.PAYROLL);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.CLOCK_STATE);
    localStorage.removeItem(STORAGE_KEYS.CHAT_HISTORY);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
}
