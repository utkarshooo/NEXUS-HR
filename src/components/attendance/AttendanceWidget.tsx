import React from 'react';
import { LeaveBalances, LeaveRequest } from '../../types';

interface AttendanceWidgetProps {
  balances: LeaveBalances;
  requests: LeaveRequest[];
  onOpenLeaveModal: () => void;
  onApproveLeave: (id: string) => void;
  onRejectLeave: (id: string) => void;
}

export const AttendanceWidget: React.FC<AttendanceWidgetProps> = ({
  balances,
  requests,
  onOpenLeaveModal,
  onApproveLeave,
  onRejectLeave,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">Attendance & Leave Management</h2>
          <p className="text-slate-400 text-xs mt-1">Geofenced daily punch logging, leave quotas, and approval queues.</p>
        </div>
        <button
          onClick={onOpenLeaveModal}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg transition"
        >
          + Request Time Off
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#161F30]/80 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Annual Vacation Leave</p>
            <p className="text-2xl font-black text-white mt-1">{balances.annual} Days</p>
            <p className="text-[10px] text-slate-500 mt-1">Out of {balances.annualTotal} days</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
            {Math.round((balances.annual / balances.annualTotal) * 100)}%
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#161F30]/80 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Sick & Medical Leave</p>
            <p className="text-2xl font-black text-white mt-1">{balances.sick} Days</p>
            <p className="text-[10px] text-slate-500 mt-1">Out of {balances.sickTotal} days</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
            {Math.round((balances.sick / balances.sickTotal) * 100)}%
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#161F30]/80 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Paid Parental Leave</p>
            <p className="text-2xl font-black text-white mt-1">{balances.parental} Days</p>
            <p className="text-[10px] text-cyan-400 mt-1">100% Fully Paid</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">
            100%
          </div>
        </div>
      </div>

      <div className="p-6 rounded-3xl border border-slate-800 bg-[#161F30]/80">
        <h3 className="text-base font-bold text-white mb-4">Enterprise Leave Applications</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800 font-semibold">
                <th className="py-3 px-4">Applicant</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Dates</th>
                <th className="py-3 px-4">Days</th>
                <th className="py-3 px-4">Reason</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {requests.map((l) => (
                <tr key={l.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-200">
                    <div className="flex items-center space-x-2">
                      <img src={l.employeeAvatar} className="w-6 h-6 rounded-full object-cover" />
                      <span>{l.employeeName}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono">{l.leaveType}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">{l.startDate} → {l.endDate}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-300">{l.days} days</td>
                  <td className="py-3.5 px-4 text-slate-400 max-w-xs truncate">{l.reason}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      l.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {l.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {l.status === 'PENDING' ? (
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => onApproveLeave(l.id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-xs font-semibold"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => onRejectLeave(l.id)}
                          className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-xs font-semibold"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-500">Processed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
