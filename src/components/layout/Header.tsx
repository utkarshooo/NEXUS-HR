import React, { useState } from 'react';
import { CurrentUser, WorkMode } from '../../types';
import { ROLE_PRESETS } from '../../services/mockData';

interface HeaderProps {
  currentUser: CurrentUser;
  onRoleChange: (role: keyof typeof ROLE_PRESETS) => void;
  onOpenCommandPalette: () => void;
  onNavigateTab: (tab: string) => void;
  unreadCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onRoleChange,
  onOpenCommandPalette,
}) => {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<string | null>(null);
  const [workMode, setWorkMode] = useState<WorkMode>('IN_OFFICE');

  const handleToggleClock = () => {
    if (!isClockedIn) {
      setIsClockedIn(true);
      setClockInTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } else {
      setIsClockedIn(false);
      setClockInTime(null);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#0E1424]/90 backdrop-blur-xl px-4 lg:px-8 py-3.5 flex items-center justify-between">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-3 cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2a4 4 0 0 1 4 4v1a4 4 0 0 1 4 4 4 4 0 0 1-2 3.46A4 4 0 0 1 20 18a4 4 0 0 1-4 4h-2a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM8 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2H6a4 4 0 0 1-4-4 4 4 0 0 1 2-3.54A4 4 0 0 1 2 11a4 4 0 0 1 4-4V6a4 4 0 0 1 4-4z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">NexusHR</span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">v2.4 Enterprise</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Workforce Intelligence & AI HCM Platform</p>
          </div>
        </div>

        <div className="hidden xl:flex items-center space-x-4 pl-6 border-l border-slate-800/80 text-xs">
          <div className="flex items-center space-x-1.5 text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-800/40">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-mono font-medium">Spring AI: Online (42ms)</span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenCommandPalette}
          className="hidden md:flex items-center space-x-3 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 px-3.5 py-1.5 rounded-lg text-xs text-slate-400 transition"
        >
          <span>Search actions or employees...</span>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px] text-slate-300">⌘K</kbd>
        </button>

        <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-xl p-1 shadow-inner">
          <select
            value={workMode}
            onChange={(e) => setWorkMode(e.target.value as WorkMode)}
            className="bg-transparent text-xs text-slate-300 px-2 py-1 outline-none font-medium cursor-pointer"
          >
            <option value="IN_OFFICE" className="bg-slate-900">🏢 In-Office</option>
            <option value="HYBRID" className="bg-slate-900">💻 Hybrid</option>
            <option value="REMOTE" className="bg-slate-900">🌍 Remote</option>
          </select>
          <button
            onClick={handleToggleClock}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              isClockedIn
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
            }`}
          >
            <span>{isClockedIn ? `Clock Out (${clockInTime})` : 'Clock In'}</span>
          </button>
        </div>

        <div className="relative flex items-center bg-slate-900/90 border border-slate-800 rounded-xl p-1">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-8 h-8 rounded-lg object-cover border border-indigo-500/40"
          />
          <div className="ml-2 mr-3 text-left hidden sm:block">
            <p className="text-xs font-bold text-slate-200 leading-tight">{currentUser.name}</p>
            <p className="text-[10px] text-indigo-300 font-mono uppercase">{currentUser.role.replace('_', ' ')}</p>
          </div>
          <select
            value={currentUser.role}
            onChange={(e) => onRoleChange(e.target.value as keyof typeof ROLE_PRESETS)}
            className="bg-transparent text-xs text-slate-300 py-1 pr-2 outline-none cursor-pointer font-medium"
          >
            <option value="SUPER_ADMIN" className="bg-slate-900">👑 Super Admin</option>
            <option value="HR_DIRECTOR" className="bg-slate-900">👔 HR Director</option>
            <option value="TEAM_LEAD" className="bg-slate-900">💻 Team Lead</option>
            <option value="EMPLOYEE" className="bg-slate-900">👤 Employee</option>
          </select>
        </div>
      </div>
    </header>
  );
};
