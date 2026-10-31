import React from 'react';

export const NineBoxGrid: React.FC = () => {
  return (
    <div className="rounded-3xl p-6 border border-slate-800 bg-[#161F30]/80 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-white">9-Box Talent Calibration Matrix</h3>
          <p className="text-xs text-slate-400">Vertical: Leadership Potential | Horizontal: Performance Delivery</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {/* ROW 1 */}
        <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800/40 min-h-[110px]">
          <span className="text-[10px] font-bold text-amber-300 uppercase">Enigma / Rough Diamond</span>
          <div className="mt-2 text-xs text-slate-400">High Potential, Low Delivery</div>
        </div>
        <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-800/40 min-h-[110px]">
          <span className="text-[10px] font-bold text-indigo-300 uppercase">Future Leader</span>
          <div className="mt-2 text-xs text-slate-300">David Kim (Lead UX)</div>
        </div>
        <div className="p-4 rounded-2xl bg-emerald-950/40 border-2 border-emerald-500/50 shadow-lg shadow-emerald-500/20 min-h-[110px]">
          <span className="text-[10px] font-bold text-emerald-300 uppercase">Star / Strategic Asset</span>
          <div className="mt-2 space-y-1">
            <p className="text-xs font-bold text-white">Elena Rostova, Priya Sharma</p>
            <p className="text-[10px] text-emerald-400 font-medium">Eligible for equity booster</p>
          </div>
        </div>

        {/* ROW 2 */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 min-h-[110px]">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Dilemma</span>
          <div className="mt-2 text-xs text-slate-500">Requires targeted coaching</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 min-h-[110px]">
          <span className="text-[10px] font-bold text-slate-300 uppercase">Core Player</span>
          <div className="mt-2 text-xs text-slate-300">Alex Rivera (Senior Eng)</div>
        </div>
        <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-800/30 min-h-[110px]">
          <span className="text-[10px] font-bold text-indigo-300 uppercase">High Performer</span>
          <div className="mt-2 text-xs text-slate-300">Marcus Vance, Sophia Chen</div>
        </div>

        {/* ROW 3 */}
        <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-900/30 min-h-[110px]">
          <span className="text-[10px] font-bold text-rose-400 uppercase">Risk / Underperformer</span>
          <div className="mt-2 text-xs text-slate-500">Zero active personnel</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 min-h-[110px]">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Effective Specialist</span>
          <div className="mt-2 text-xs text-slate-400">Lucas Dubois (Sales)</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 min-h-[110px]">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Trusted Professional</span>
          <div className="mt-2 text-xs text-slate-400">Consistent technical execution</div>
        </div>
      </div>
    </div>
  );
};
