'use client';

import React, { useState } from 'react';
import { useDigiTube } from '@/lib/store';
import { formatCurrencyINR, formatNumber } from '@/lib/utils';
import {
  Receipt,
  Upload,
  CheckCircle2,
  FileSpreadsheet,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  DollarSign,
} from 'lucide-react';
import { RoyaltyStatementPeriod, RoyaltyLineDetail } from '@/lib/types';

export default function AdminFinancePage() {
  const { statements, royaltyLines, importRoyaltyStatement } = useDigiTube();

  const [importing, setImporting] = useState(false);
  const [successBatch, setSuccessBatch] = useState<string | null>(null);

  // Simulated New Statement Batch to Ingest
  const handleSimulateStatementImport = () => {
    setImporting(true);

    const newBatchCode = `STMT-2026-OCT`;
    const newStmt: RoyaltyStatementPeriod = {
      id: `stmt_${Date.now()}`,
      batchCode: newBatchCode,
      period: 'October 2026 (Preliminary)',
      provider: 'DigiTube Distribution Grid',
      totalGrossInr: 64200,
      digiTubeCommissionInr: 9630, // 15%
      netArtistShareInr: 54570, // 85%
      totalStreams: 1580000,
      status: 'PUBLISHED',
      lineItemsCount: 156,
    };

    const newLines: RoyaltyLineDetail[] = [
      {
        id: `rl_${Date.now()}_1`,
        statementId: newStmt.id,
        releaseTitle: 'Kesariya Lofi Sunset',
        trackTitle: 'Kesariya Lofi Sunset',
        isrc: 'INDGT2600101',
        store: 'spotify',
        country: 'IN',
        streamCount: 750000,
        grossInr: 30000,
        commissionInr: 4500,
        netInr: 25500,
        month: 'Oct 2026',
      },
      {
        id: `rl_${Date.now()}_2`,
        statementId: newStmt.id,
        releaseTitle: 'Kesariya Lofi Sunset',
        trackTitle: 'Kesariya Lofi Sunset',
        isrc: 'INDGT2600101',
        store: 'jiosaavn',
        country: 'IN',
        streamCount: 420000,
        grossInr: 16800,
        commissionInr: 2520,
        netInr: 14280,
        month: 'Oct 2026',
      },
      {
        id: `rl_${Date.now()}_3`,
        statementId: newStmt.id,
        releaseTitle: 'Mumbai Monsoon Diaries',
        trackTitle: 'Baarish Ka Pehla Khat',
        isrc: 'INDGT2600045',
        store: 'apple_music',
        country: 'US',
        streamCount: 210000,
        grossInr: 17400,
        commissionInr: 2610,
        netInr: 14790,
        month: 'Oct 2026',
      },
    ];

    setTimeout(() => {
      importRoyaltyStatement(newStmt, newLines);
      setImporting(false);
      setSuccessBatch(newBatchCode);
      setTimeout(() => setSuccessBatch(null), 6000);
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
            <Receipt className="w-4 h-4" />
            <span>Accounting & Ledger Pipeline (Section 12 Blueprint)</span>
          </div>
          <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
            Royalty Ingestion & Ledger Engine
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Automated double-entry reconciliation: deduplicate statement batches, apply 15% DigiTube commission cut, and post balances to artist wallets.
          </p>
        </div>

        <button
          onClick={handleSimulateStatementImport}
          disabled={importing}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm hover:shadow flex items-center gap-2 self-start sm:self-auto transition-all disabled:opacity-50"
        >
          <Upload className={`w-4 h-4 ${importing ? 'animate-bounce' : ''}`} />
          <span>{importing ? 'Reconciling Ledger...' : 'Ingest Monthly Statement'}</span>
        </button>
      </div>

      {successBatch && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-3 animate-slide-up shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div>
            <strong className="font-semibold text-emerald-900 dark:text-emerald-200">Batch {successBatch} Ingested & Posted:</strong> Reconciled 156 statement line items. Deducted 15% DigiTube commission and credited net ₹54,570 directly to artist wallet accounts!
          </div>
        </div>
      )}

      {/* Arithmetic Pipeline Visualizer (Section 12) */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Section 12 Arithmetic Model (Double-Entry Reversal Safe)</h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-slate-500 dark:text-slate-400 text-[11px]">Source Statements:</span>
            <div className="text-lg font-bold text-slate-900 dark:text-white">100% Gross DSP Revenue</div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Raw sound-recording earnings from DSP feeds</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-slate-500 dark:text-slate-400 text-[11px]">Platform Deductions:</span>
            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">- 15% DigiTube Cut</div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Fixed contract rate, non-retroactive</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-slate-500 dark:text-slate-400 text-[11px]">Artist Contracted Share:</span>
            <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">= 85% Distributable</div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Allocated to collaborator splits</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-slate-500 dark:text-slate-400 text-[11px]">Wallet Availability:</span>
            <div className="text-lg font-bold text-slate-900 dark:text-white">Immediate Credit</div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Published to verified payee wallets</p>
          </div>
        </div>
      </div>

      {/* Statement Batches Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Imported Statement Batches</h3>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            {statements.length} Batches in Ledger
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
              <tr>
                <th className="py-3 px-4 font-semibold">Batch Code</th>
                <th className="py-3 px-4 font-semibold">Period Month</th>
                <th className="py-3 px-4 font-semibold">Distribution Hub</th>
                <th className="py-3 px-4 font-semibold text-right">Units / Streams</th>
                <th className="py-3 px-4 font-semibold text-right">Gross Ingested</th>
                <th className="py-3 px-4 font-semibold text-right">DigiTube (15%)</th>
                <th className="py-3 px-4 font-semibold text-right">Artist Net (85%)</th>
                <th className="py-3 px-4 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {statements.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">{s.batchCode}</td>
                  <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">{s.period}</td>
                  <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 font-mono text-[11px]">{s.provider}</td>
                  <td className="py-3.5 px-4 text-right font-mono text-slate-700 dark:text-slate-200">
                    {formatNumber(s.totalStreams)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-slate-700 dark:text-slate-300">
                    {formatCurrencyINR(s.totalGrossInr)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-blue-600 dark:text-blue-400">
                    {formatCurrencyINR(s.digiTubeCommissionInr)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {formatCurrencyINR(s.netArtistShareInr)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 font-semibold">
                      {s.status}
                    </span>
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
