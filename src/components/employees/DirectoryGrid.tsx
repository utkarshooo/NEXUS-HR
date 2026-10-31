import React, { useState, useMemo } from 'react';
import { Employee } from '../../types';

interface DirectoryGridProps {
  employees: Employee[];
  onSelectEmployee: (employee: Employee) => void;
  onOpenAddModal: () => void;
}

export const DirectoryGrid: React.FC<DirectoryGridProps> = ({
  employees,
  onSelectEmployee,
  onOpenAddModal,
}) => {
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'org'>('grid');

  const filtered = useMemo(() => {
    return employees.filter((e) => {
      const matchSearch =
        e.firstName.toLowerCase().includes(search.toLowerCase()) ||
        e.lastName.toLowerCase().includes(search.toLowerCase()) ||
        e.designation.toLowerCase().includes(search.toLowerCase()) ||
        e.employeeCode.toLowerCase().includes(search.toLowerCase());
      const matchDept = department === 'ALL' || e.department === department;
      return matchSearch && matchDept;
    });
  }, [employees, search, department]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">Workforce Directory & Organizational Chart</h2>
          <p className="text-slate-400 text-xs mt-1">Explore reporting lines, talent competencies, and flight risk profiles.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="bg-slate-900 border border-slate-800 p-1 rounded-xl flex items-center space-x-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400'
              }`}
            >
              Directory Cards
            </button>
            <button
              onClick={() => setViewMode('org')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'org' ? 'bg-indigo-600 text-white' : 'text-slate-400'
              }`}
            >
              Org Hierarchy
            </button>
          </div>
          <button
            onClick={onOpenAddModal}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg transition"
          >
            <span>+ Add Employee</span>
          </button>
        </div>
      </div>

      <div className="rounded-2xl p-4 bg-[#161F30]/70 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <input
          type="text"
          placeholder="Search by name, role, or employee ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[240px] bg-transparent text-xs text-white placeholder-slate-500 outline-none"
        />
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-300 outline-none"
        >
          <option value="ALL">All Departments</option>
          <option value="Executive Leadership">Executive</option>
          <option value="Core Engineering">Engineering</option>
          <option value="Human Resources">Human Resources</option>
          <option value="Artificial Intelligence & Data">AI & Data</option>
          <option value="Product & UX">Product & UX</option>
          <option value="Enterprise Sales">Sales</option>
        </select>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((emp) => (
            <div
              key={emp.id}
              onClick={() => onSelectEmployee(emp)}
              className="rounded-2xl p-5 bg-[#161F30]/80 border border-slate-800 hover:border-indigo-500/50 hover:shadow-lg transition cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <img src={emp.avatar} alt={emp.firstName} className="w-12 h-12 rounded-2xl object-cover border-2 border-slate-700" />
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      emp.flightRisk.score > 60
                        ? 'bg-rose-500/20 text-rose-300'
                        : emp.flightRisk.score > 30
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    Risk: {emp.flightRisk.score}%
                  </span>
                </div>
                <div className="mt-3">
                  <h3 className="font-bold text-sm text-white">{emp.firstName} {emp.lastName}</h3>
                  <p className="text-xs text-indigo-300 font-medium">{emp.designation}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{emp.department}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap gap-1">
                  {emp.skills.slice(0, 3).map((sk, idx) => (
                    <span key={idx} className="text-[9px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>{emp.location.split(',')[0]}</span>
                <span className="font-mono text-slate-300 font-semibold">${(emp.salary.baseAnnual / 1000).toFixed(0)}k/yr</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 rounded-3xl border border-slate-800 bg-[#161F30]/80 text-center">
          <p className="text-sm font-bold text-white">Hierarchical Tree Visualizer</p>
          <p className="text-xs text-slate-400 mt-1">Multi-tier reporting tree loaded for all active departments.</p>
        </div>
      )}
    </div>
  );
};
