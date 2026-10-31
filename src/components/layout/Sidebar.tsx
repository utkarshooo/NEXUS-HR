import React from 'react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  employeeCount: number;
  pendingLeavesCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  employeeCount,
  pendingLeavesCount,
}) => {
  return (
    <aside className="w-64 shrink-0 bg-[#0C1220]/95 border-r border-slate-800/80 p-4 flex flex-col justify-between hidden md:flex">
      <div className="space-y-6">
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">Core Intelligence</p>
          <nav className="space-y-1">
            <button
              onClick={() => onTabChange('intelligence')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'intelligence'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <span className="flex-1 text-left">Workforce AI Hub</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/20 text-white uppercase font-mono">AI</span>
            </button>

            <button
              onClick={() => onTabChange('dashboard')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'dashboard'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <span className="flex-1 text-left">Executive Overview</span>
            </button>
          </nav>
        </div>

        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">People Operations</p>
          <nav className="space-y-1">
            <button
              onClick={() => onTabChange('employees')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'employees'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <span className="flex-1 text-left">Directory & Org Chart</span>
              <span className="text-[10px] text-slate-500 font-mono">{employeeCount}</span>
            </button>

            <button
              onClick={() => onTabChange('attendance')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'attendance'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <span className="flex-1 text-left">Attendance & Leaves</span>
              {pendingLeavesCount > 0 && <span className="w-2 h-2 rounded-full bg-amber-400"></span>}
            </button>

            <button
              onClick={() => onTabChange('payroll')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'payroll'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <span className="flex-1 text-left">Payroll & Compensation</span>
            </button>

            <button
              onClick={() => onTabChange('performance')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'performance'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <span className="flex-1 text-left">Performance & OKRs</span>
            </button>
          </nav>
        </div>

        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">Governance</p>
          <nav className="space-y-1">
            <button
              onClick={() => onTabChange('settings')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'settings'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <span className="flex-1 text-left">Security & Settings</span>
            </button>
          </nav>
        </div>
      </div>

      <div className="p-3.5 rounded-2xl bg-gradient-to-b from-indigo-950/60 to-slate-900 border border-indigo-500/30">
        <div className="flex items-center space-x-2 text-indigo-300">
          <span className="text-xs font-bold tracking-tight">Enterprise Architecture</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
          Zero-dependency standalone preview + clean production TypeScript frontend bundle.
        </p>
        <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
          <span>Java 21 / Spring AI</span>
          <span className="text-emerald-400 font-semibold">100% Synced</span>
        </div>
      </div>
    </aside>
  );
};
