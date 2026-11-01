'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useDigiTube } from '@/lib/store';
import { formatCurrencyINR, formatCompactNumber, formatDate } from '@/lib/utils';
import {
  ShieldAlert,
  ClipboardCheck,
  Send,
  Receipt,
  CheckCircle,
  Users,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Server,
  Activity,
  Layers,
} from 'lucide-react';

export default function AdminOverviewPage() {
  const { releases: contextReleases, payouts, statements, staff, auditLogs } = useDigiTube();
  const [syncedReleases, setSyncedReleases] = useState<any[]>(contextReleases || []);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/releases?all=true', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        let list = Array.isArray(data?.releases) ? data.releases.filter(Boolean) : [];
        try {
          const local = JSON.parse(localStorage.getItem('digitube_all_submitted_releases') || '[]');
          if (Array.isArray(local) && local.length > 0) {
            const map = new Map(list.filter((r: any) => r && r.id).map((r: any) => [r.id, r]));
            for (const item of local) {
              if (item && item.id && !map.has(item.id)) {
                list.unshift(item);
                map.set(item.id, item);
              }
            }
          }
        } catch {}
        if (list.length > 0) setSyncedReleases(list.filter(Boolean));
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [contextReleases]);

  const activeReleases = (syncedReleases.length > 0 ? syncedReleases : contextReleases || []).filter(Boolean);

  const pendingReview = activeReleases.filter(
    (r) =>
      r &&
      (r.status === 'IN_REVIEW' ||
        r.status === 'SUBMITTED' ||
        r.status === 'VALIDATION' ||
        r.status === 'CHANGES_REQUIRED')
  ).length;

  const safePayouts = Array.isArray(payouts) ? payouts.filter(Boolean) : [];
  const pendingPayouts = safePayouts.filter((p) => p && p.status === 'PENDING_REVIEW');
  const pendingPayoutsTotal = pendingPayouts.reduce((acc, p) => acc + (p.amount || 0), 0);

  const safeStatements = Array.isArray(statements) ? statements.filter(Boolean) : [];
  const totalGrossReconciled = safeStatements.reduce((acc, s) => acc + (s.totalGrossInr || 0), 0);
  const totalDigiTubeCommission = safeStatements.reduce((acc, s) => acc + (s.digiTubeCommissionInr || 0), 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-amber-50 via-white to-white dark:from-amber-950/40 dark:via-slate-900 dark:to-slate-900 border border-amber-300 dark:border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30 text-xs font-semibold">
            <Server className="w-3.5 h-3.5" />
            <span>Platform Operations Hub (Section 07 Blueprint)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
            DigiTube Network Super Admin
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl">
            Oversee music release quality compliance, partner API delivery queues, financial statement reconciliations, and payout authorizations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/review"
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all"
          >
            <ClipboardCheck className="w-4 h-4" />
            <span>Review Queue ({pendingReview})</span>
          </Link>

          <Link
            href="/admin/payouts"
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Authorize Payouts</span>
          </Link>
        </div>
      </div>

      {/* 4 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pending QA Queue */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-amber-600 dark:text-amber-400 font-semibold uppercase tracking-wider">
            <span>Pending QA Review</span>
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{pendingReview} Releases</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Audio & Metadata verification</span>
            <Link href="/admin/review" className="text-amber-600 dark:text-amber-400 hover:underline font-semibold">
              Inspect &rarr;
            </Link>
          </div>
        </div>

        {/* Live Releases */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider">
            Live in DSP Stores
          </span>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {activeReleases.filter((r: any) => r.status === 'LIVE').length} Releases
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Synchronized with Spotify, Apple, JioSaavn</p>
        </div>

        {/* Pending Payout Queue */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider">
            Pending Bank Payouts
          </span>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {formatCurrencyINR(pendingPayoutsTotal)}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>{pendingPayouts.length} withdrawal requests</span>
            <Link href="/admin/payouts" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Approve &rarr;
            </Link>
          </div>
        </div>

        {/* Total Platform Commission */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
            DigiTube 15% Retained
          </span>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {formatCurrencyINR(totalDigiTubeCommission)}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">From ₹1,57,300 gross statement volume</p>
        </div>
      </div>

      {/* Quick Ops Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/admin/review"
          className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500 shadow-sm transition-all space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-200 dark:border-amber-500/30 group-hover:scale-105 transition-transform">
            <ClipboardCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors">
            Quality Review & Metadata Audit
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Inspect pending audio masters, copyright clearances, ISRC allocation, and approve releases for automated delivery.
          </p>
          <div className="text-xs text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1 pt-1">
            <span>Open Queue</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          href="/admin/distribution"
          className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 shadow-sm transition-all space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-500/30 group-hover:scale-105 transition-transform">
            <Send className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
            DSP Distribution Partner Gateway
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Monitor DigiTube DDEX Grid job queues, view XML ingestion logs, and retry failed per-store transmissions.
          </p>
          <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1 pt-1">
            <span>Inspect Gateway</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          href="/admin/finance"
          className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-500 shadow-sm transition-all space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-500/30 group-hover:scale-105 transition-transform">
            <Receipt className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors">
            Royalty Ingestion & Accounting Ledger
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Import monthly provider statement files, execute double-entry ledger calculations, and publish reconciled artist statements.
          </p>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 pt-1">
            <span>Upload Statement</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      {/* Recent Audit Trail Logs */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Live System Audit Activity</h3>
          </div>
          <Link href="/admin/audit" className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline">
            View Full Audit Trail &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
              <tr>
                <th className="py-2.5 px-3 font-semibold">Timestamp</th>
                <th className="py-2.5 px-3 font-semibold">Actor</th>
                <th className="py-2.5 px-3 font-semibold">Action</th>
                <th className="py-2.5 px-3 font-semibold">Target Resource</th>
                <th className="py-2.5 px-3 font-semibold">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {auditLogs.slice(0, 5).map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-mono text-slate-500 dark:text-slate-400 text-[11px]">
                    {formatDate(log.timestamp)}
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">{log.actorName}</td>
                  <td className="py-3 px-3">
                    <span className="font-mono text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-amber-700 dark:text-amber-300 border border-slate-200 dark:border-slate-700">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-700 dark:text-slate-300 text-[11px]">{log.resource}</td>
                  <td className="py-3 px-3 text-slate-500 dark:text-slate-400 text-[11px] truncate max-w-xs">{log.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
