import React, { useState } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { AttritionSimulator } from './components/workforce-ai/AttritionSimulator';
import { PolicyCopilot } from './components/workforce-ai/PolicyCopilot';
import { PayslipModal } from './components/payroll/PayslipModal';
import { NineBoxGrid } from './components/performance/NineBoxGrid';
import { NexusHRService } from './services/apiService';
import { ROLE_PRESETS } from './services/mockData';
import { Employee, WorkMode } from './types';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('intelligence');
  const [currentUser, setCurrentUser] = useState(NexusHRService.getCurrentUser());
  const [employees, setEmployees] = useState<Employee[]>(NexusHRService.getEmployees());
  const [selectedSimEmpId, setSelectedSimEmpId] = useState('emp-004');
  const [payslipEmp, setPayslipEmp] = useState<Employee | null>(null);
  const [chatMessages, setChatMessages] = useState(NexusHRService.getChatHistory());
  const [isAiThinking, setIsAiThinking] = useState(false);

  const handleRoleChange = (roleKey: keyof typeof ROLE_PRESETS) => {
    const user = NexusHRService.setCurrentUser(roleKey);
    setCurrentUser(user);
  };

  const handleApplyRetentionPlan = (empId: string, hike: number, mode: WorkMode) => {
    NexusHRService.simulateRetentionIntervention(empId, {
      salaryIncreasePct: hike,
      workMode: mode,
      promotionTrack: true,
      mentorshipAssigned: true,
    });
    setEmployees(NexusHRService.getEmployees());
  };

  const handleSendMessage = async (query: string) => {
    setIsAiThinking(true);
    const reply = await NexusHRService.askPolicyCopilot(query);
    setChatMessages(NexusHRService.getChatHistory());
    setIsAiThinking(false);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#0A0E17] text-slate-100">
      <Header
        currentUser={currentUser}
        onRoleChange={handleRoleChange}
        onOpenCommandPalette={() => {}}
        onNavigateTab={setActiveTab}
        unreadCount={2}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          employeeCount={employees.length}
          pendingLeavesCount={1}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {activeTab === 'intelligence' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7">
                  <AttritionSimulator
                    employees={employees}
                    selectedEmployeeId={selectedSimEmpId}
                    onSelectEmployee={setSelectedSimEmpId}
                    onApplyPlan={handleApplyRetentionPlan}
                  />
                </div>
                <div className="lg:col-span-5">
                  <PolicyCopilot
                    messages={chatMessages}
                    onSendMessage={handleSendMessage}
                    isAiThinking={isAiThinking}
                  />
                </div>
              </div>

              <NineBoxGrid />
            </div>
          )}

          {activeTab === 'performance' && <NineBoxGrid />}
        </main>
      </div>

      <PayslipModal employee={payslipEmp} onClose={() => setPayslipEmp(null)} />
    </div>
  );
};
export default App;
