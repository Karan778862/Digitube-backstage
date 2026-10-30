'use client';

import React, { useState } from 'react';
import { useDigiTube } from '@/lib/store';
import { formatDate } from '@/lib/utils';
import {
  History,
  Search,
  Filter,
  ShieldCheck,
  Server,
  Lock,
  ArrowRight,
  Eye,
  X,
} from 'lucide-react';
import { SystemAuditItem } from '@/lib/types';

export default function AdminAuditPage() {
  const { auditLogs } = useDigiTube();

  const [search, setSearch] = useState('');
  const [selectedLog, setSelectedLog] = useState<SystemAuditItem | null>(null);

  const filteredLogs = auditLogs.filter(
    (l) =>
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.resource.toLowerCase().includes(search.toLowerCase()) ||
      l.actorName.toLowerCase().includes(search.toLowerCase()) ||
      l.ipAddress.includes(search)
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">
          <History className="w-4 h-4" />
          <span>Immutable Audit Ledger (Section 07 & 19 Blueprint)</span>
        </div>
        <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
          System Activity & Compliance Audit Logs
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Chronological record capturing actor identity, timestamp, IP address, reason, and before/after changes for all operations.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Filter by actor, action (e.g. RELEASE_APPROVED, PAYOUT_SETTLED), or IP address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 shadow-sm"
        />
      </div>

      {/* Audit Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Immutable Event Trail</h3>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            {filteredLogs.length} Events Captured
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
              <tr>
                <th className="py-3 px-4 font-semibold">Timestamp</th>
                <th className="py-3 px-4 font-semibold">Actor & Role</th>
                <th className="py-3 px-4 font-semibold">Action Triggered</th>
                <th className="py-3 px-4 font-semibold">Target Entity / Resource</th>
                <th className="py-3 px-4 font-semibold">IP Address</th>
                <th className="py-3 px-4 font-semibold text-right">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  onClick={() => setSelectedLog(log)}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4 font-mono text-slate-500 dark:text-slate-400 text-[11px]">
                    {formatDate(log.timestamp)}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 dark:text-white">{log.actorName}</div>
                    <div className="text-[10px] text-amber-700 dark:text-amber-400 font-mono">{log.actorRole}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-mono text-[10px] bg-slate-100 dark:bg-slate-800 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 font-semibold">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-700 dark:text-slate-300 text-[11px]">{log.resource}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-500 dark:text-slate-500 text-[11px]">{log.ipAddress}</td>
                  <td className="py-3.5 px-4 text-right text-slate-600 dark:text-slate-400 text-[11px] max-w-xs truncate">
                    {log.reason || 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AUDIT DETAIL MODAL */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <History className="w-5 h-5 text-amber-500" />
                <span>Audit Event Details: {selectedLog.id}</span>
              </h3>
              <button onClick={() => setSelectedLog(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Actor:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{selectedLog.actorName}</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Role:</span>
                  <span className="font-mono text-amber-700 dark:text-amber-400 font-semibold">{selectedLog.actorRole}</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px]">IP Address:</span>
                  <span className="font-mono text-slate-700 dark:text-white">{selectedLog.ipAddress}</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Timestamp:</span>
                  <span className="font-mono text-slate-700 dark:text-white">{selectedLog.timestamp}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Action & Target:</span>
                <div className="font-mono p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 text-blue-700 dark:text-blue-400 border border-slate-200 dark:border-slate-800">
                  {selectedLog.action} &rarr; {selectedLog.resource}
                </div>
              </div>

              <div>
                <span className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Documented Administrative Rationale:</span>
                <p className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 leading-relaxed">
                  {selectedLog.reason || 'Standard operational event.'}
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
