import React from 'react';

interface ExecutiveMetricsProps {
  totalEmployees: number;
  criticalRiskCount: number;
  monthlyBurn: number;
  onExecutePayroll: () => void;
  onAddEmployee: () => void;
}

export const ExecutiveMetrics: React.FC<ExecutiveMetricsProps> = ({
  totalEmployees,
  criticalRiskCount,
  monthlyBurn,
  onExecutePayroll,
  onAddEmployee,
}) => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">Executive HR & Workforce Overview</h2>
          <p className="text-slate-400 text-xs mt-1">Real-time organizational telemetry, retention health & compensation distribution.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={onExecutePayroll}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg transition"
          >
            <span>Run Batch Payroll</span>
          </button>
          <button
            onClick={onAddEmployee}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition"
          >
            <span>Add Personnel</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#161F30]/80 border border-slate-800">
          <span className="text-xs text-slate-400">Total Active Employees</span>
          <p className="text-3xl font-extrabold text-white mt-2">{totalEmployees}</p>
          <p className="text-xs text-emerald-400 mt-2 font-medium">98.2% operational capacity</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#161F30]/80 border border-slate-800">
          <span className="text-xs text-slate-400">Voluntary Attrition (QTD)</span>
          <p className="text-3xl font-extrabold text-emerald-400 mt-2">2.4%</p>
          <p className="text-xs text-slate-400 mt-2">Target benchmark: &lt; 5.0%</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#161F30]/80 border border-slate-800">
          <span className="text-xs text-slate-400">High Flight Risk Nodes</span>
          <p className="text-3xl font-extrabold text-rose-400 mt-2">{criticalRiskCount}</p>
          <p className="text-xs text-rose-300 mt-2 font-medium">Requires retention intervention</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#161F30]/80 border border-slate-800">
          <span className="text-xs text-slate-400">Monthly Payroll Spend</span>
          <p className="text-3xl font-extrabold text-indigo-400 mt-2">${monthlyBurn.toLocaleString()}</p>
          <p className="text-xs text-slate-400 mt-2">Automated batch reconciliation</p>
        </div>
      </div>
    </div>
  );
};
