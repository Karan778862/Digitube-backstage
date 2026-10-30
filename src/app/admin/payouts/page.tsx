'use client';

import React, { useState } from 'react';
import { useDigiTube } from '@/lib/store';
import { formatCurrencyINR, formatDate } from '@/lib/utils';
import { StatusBadge } from '@/components/StatusBadge';
import {
  CheckCircle,
  XCircle,
  Clock,
  ShieldCheck,
  Building,
  AlertTriangle,
  Send,
  Sparkles,
} from 'lucide-react';

export default function AdminPayoutsPage() {
  const { payouts, approvePayout, rejectPayout } = useDigiTube();

  const [settlementNotice, setSettlementNotice] = useState<string | null>(null);

  const pendingPayouts = payouts.filter((p) => p.status === 'PENDING_REVIEW');
  const pastPayouts = payouts.filter((p) => p.status !== 'PENDING_REVIEW');

  const handleApprove = (payoutId: string, amount: number) => {
    const txnRef = `CMS202610${Math.floor(10000000 + Math.random() * 90000000)}`;
    approvePayout(payoutId, txnRef);
    setSettlementNotice(`Approved payout for ${formatCurrencyINR(amount)}. Settled with Bank Ref ${txnRef}.`);
    setTimeout(() => setSettlementNotice(null), 5000);
  };

  const handleReject = (payoutId: string) => {
    const reason = prompt('Enter rejection reason (Funds will be reversed to artist available balance):');
    if (reason) {
      rejectPayout(payoutId, reason);
      setSettlementNotice(`Rejected payout. Reserved balance reversed back to artist wallet.`);
      setTimeout(() => setSettlementNotice(null), 5000);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
          <CheckCircle className="w-4 h-4" />
          <span>Finance Review & Banking Settlement Desk (Section 13 Blueprint)</span>
        </div>
        <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
          Artist Payout Authorizations
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Review withdrawal requests, verify KYC & tax identification, and execute banking transfers without duplicate risk.
        </p>
      </div>

      {settlementNotice && (
        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 text-blue-900 dark:text-blue-300 text-xs flex items-center gap-3 shadow-sm">
          <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
          <span className="font-medium">{settlementNotice}</span>
        </div>
      )}

      {/* Pending Payout Requests Queue */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Pending Withdrawal Approvals ({pendingPayouts.length})</h3>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Atomic reservation locked</span>
        </div>

        {pendingPayouts.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No withdrawal requests pending finance approval.
          </div>
        ) : (
          <div className="space-y-4">
            {pendingPayouts.map((p) => (
              <div
                key={p.id}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-950 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800/60">
                      {p.payoutNumber}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">Requested: {formatDate(p.requestDate)}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {p.artistName} • <span className="text-blue-600 dark:text-blue-400 font-mono">{formatCurrencyINR(p.amount)}</span>
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Payment Method: <strong className="text-slate-700 dark:text-slate-300">{p.paymentMethod}</strong> • Destination: {p.destinationAccountMasked}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end md:self-auto">
                  <button
                    onClick={() => handleReject(p.id)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-semibold transition-colors border border-slate-200 dark:border-slate-700"
                  >
                    Reject & Reverse
                  </button>

                  <button
                    onClick={() => handleApprove(p.id, p.amount)}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm hover:shadow flex items-center gap-1.5 transition-all"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Authorize & Settle</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Historical Settled Payouts */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Settled Payouts & Transaction Ledger</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Historical banking transfer confirmations</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
              <tr>
                <th className="py-3 px-4 font-semibold">Payout ID</th>
                <th className="py-3 px-4 font-semibold">Artist</th>
                <th className="py-3 px-4 font-semibold">Method</th>
                <th className="py-3 px-4 font-semibold">Bank Txn Ref</th>
                <th className="py-3 px-4 font-semibold text-right">Amount</th>
                <th className="py-3 px-4 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {pastPayouts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">{p.payoutNumber}</td>
                  <td className="py-3.5 px-4 text-slate-700 dark:text-slate-200">{p.artistName}</td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">{p.paymentMethod}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-500 dark:text-slate-400 text-[11px]">
                    {p.transactionRef}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                    {formatCurrencyINR(p.amount)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <StatusBadge status={p.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
