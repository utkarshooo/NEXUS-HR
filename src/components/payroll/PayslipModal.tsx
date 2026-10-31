import React from 'react';
import { Employee } from '../../types';

interface PayslipModalProps {
  employee: Employee | null;
  onClose: () => void;
}

export const PayslipModal: React.FC<PayslipModalProps> = ({ employee, onClose }) => {
  if (!employee) return null;

  const monthlyGross = Math.round(employee.salary.baseAnnual / 12);
  const basic = Math.round(monthlyGross * 0.55);
  const hra = Math.round(monthlyGross * 0.25);
  const special = Math.round(monthlyGross * 0.20);
  const tax = Math.round(monthlyGross * 0.20);
  const pf = Math.round(monthlyGross * 0.08);
  const net = monthlyGross - (tax + pf);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#111827] border border-slate-700 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
        >
          ✕
        </button>

        <div className="border-b border-slate-800 pb-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-white">NexusHR Enterprise Technologies</h2>
              <p className="text-xs text-slate-400">100 Enterprise Way, Suite 400, San Francisco, CA</p>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded bg-indigo-500/20 text-indigo-300">
              OCTOBER 2026
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 py-4 border-b border-slate-800 text-xs">
          <div>
            <span className="text-slate-400">Employee Name:</span>
            <p className="font-bold text-white text-sm">{employee.firstName} {employee.lastName}</p>
            <p className="text-slate-400 font-mono text-[10px]">{employee.employeeCode}</p>
          </div>
          <div className="text-right">
            <span className="text-slate-400">Designation & Dept:</span>
            <p className="font-bold text-white">{employee.designation}</p>
            <p className="text-slate-400 text-[10px]">{employee.department}</p>
          </div>
        </div>

        <div className="py-4 space-y-2 text-xs">
          <div className="flex justify-between py-1 border-b border-slate-800/60">
            <span className="text-slate-300">Monthly Basic Salary</span>
            <span className="font-mono text-white">${basic.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-800/60">
            <span className="text-slate-300">House Rent Allowance (HRA)</span>
            <span className="font-mono text-white">${hra.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-800/60">
            <span className="text-slate-300">Special Executive Allowance</span>
            <span className="font-mono text-white">${special.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-800/60 text-rose-300">
            <span>Tax Withheld (Federal & State)</span>
            <span className="font-mono">-${tax.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-800/60 text-rose-300">
            <span>Provident Fund & 401(k)</span>
            <span className="font-mono">-${pf.toLocaleString()}</span>
          </div>
        </div>

        <div className="pt-4 flex items-center justify-between border-t border-slate-800">
          <div>
            <span className="text-xs text-slate-400">Net Take-Home Pay</span>
            <p className="text-2xl font-black text-emerald-400 font-mono">${net.toLocaleString()}</p>
          </div>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
          >
            Print Stub / Save PDF
          </button>
        </div>
      </div>
    </div>
  );
};
