import React, { useState, useMemo } from 'react';
import { Employee, WorkMode } from '../../types';

interface AttritionSimulatorProps {
  employees: Employee[];
  selectedEmployeeId: string;
  onSelectEmployee: (id: string) => void;
  onApplyPlan: (empId: string, hike: number, mode: WorkMode) => void;
}

export const AttritionSimulator: React.FC<AttritionSimulatorProps> = ({
  employees,
  selectedEmployeeId,
  onSelectEmployee,
  onApplyPlan,
}) => {
  const [simHike, setSimHike] = useState(12);
  const [simMode, setSimMode] = useState<WorkMode>('HYBRID');
  const [simPromotion, setSimPromotion] = useState(true);
  const [simMentorship, setSimMentorship] = useState(true);

  const activeEmp = useMemo(() => {
    return employees.find((e) => e.id === selectedEmployeeId) || employees[0];
  }, [employees, selectedEmployeeId]);

  const outcome = useMemo(() => {
    if (!activeEmp) return { current: 50, simulated: 25, drop: 25 };
    const base = activeEmp.flightRisk.score;
    let reduction = simHike * 2.1 + (simPromotion ? 16 : 0) + (simMentorship ? 8 : 0);
    if (simMode === 'HYBRID' || simMode === 'REMOTE') reduction += 10;
    const finalScore = Math.max(8, Math.round(base - reduction));
    return {
      current: base,
      simulated: finalScore,
      drop: base - finalScore,
    };
  }, [activeEmp, simHike, simMode, simPromotion, simMentorship]);

  return (
    <div className="rounded-3xl p-6 lg:p-7 border border-slate-800 bg-[#161F30]/80 backdrop-blur-xl">
      <div className="flex items-center justify-between pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-base font-bold text-white">What-If Retention Simulator</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">Live Recalculation</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Test intervention levers to neutralize flight risks in real time.</p>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">Select Target Employee</label>
          <select
            value={selectedEmployeeId}
            onChange={(e) => onSelectEmployee(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-indigo-500"
          >
            {employees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.firstName} {e.lastName} – {e.designation} (Risk: {e.flightRisk.score}%)
              </option>
            ))}
          </select>
        </div>

        {activeEmp && (
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">Baseline Flight Risk</p>
              <p className={`text-2xl font-black mt-1 ${outcome.current > 60 ? 'text-rose-400' : 'text-amber-400'}`}>
                {outcome.current}%
              </p>
              <span className="text-[10px] uppercase font-bold text-slate-500">{activeEmp.flightRisk.level}</span>
            </div>

            <div className="text-slate-600 font-bold">→</div>

            <div className="text-right">
              <p className="text-xs text-slate-400">Simulated Outcome</p>
              <p className="text-2xl font-black mt-1 text-emerald-400">{outcome.simulated}%</p>
              <span className="text-[10px] uppercase font-bold text-emerald-400">
                ↓ {outcome.drop}% Reduction
              </span>
            </div>
          </div>
        )}

        <div className="space-y-4 pt-2">
          <div>
            <div className="flex justify-between text-xs font-medium mb-1">
              <span className="text-slate-300">Merit Compensation Hike</span>
              <span className="text-indigo-400 font-mono font-bold">+{simHike}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              step="1"
              value={simHike}
              onChange={(e) => setSimHike(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Workplace Modality</label>
              <select
                value={simMode}
                onChange={(e) => setSimMode(e.target.value as WorkMode)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white outline-none"
              >
                <option value="IN_OFFICE">In-Office</option>
                <option value="HYBRID">Hybrid</option>
                <option value="REMOTE">Remote</option>
              </select>
            </div>

            <div className="flex flex-col justify-end space-y-2">
              <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={simPromotion}
                  onChange={(e) => setSimPromotion(e.target.checked)}
                  className="rounded accent-indigo-500 w-4 h-4"
                />
                <span>Fast-Track Promotion</span>
              </label>

              <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={simMentorship}
                  onChange={(e) => setSimMentorship(e.target.checked)}
                  className="rounded accent-indigo-500 w-4 h-4"
                />
                <span>Assign Principal Mentor</span>
              </label>
            </div>
          </div>
        </div>

        <button
          onClick={() => onApplyPlan(activeEmp.id, simHike, simMode)}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-white font-bold text-xs uppercase tracking-wider hover:opacity-95 shadow-lg shadow-indigo-500/25 transition mt-3"
        >
          Deploy Retention Package to People Ops
        </button>
      </div>
    </div>
  );
};
