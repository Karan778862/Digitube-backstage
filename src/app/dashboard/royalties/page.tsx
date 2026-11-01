'use client';

import React, { useState } from 'react';
import { useDigiTube } from '@/lib/store';
import { formatCurrencyINR, formatNumber } from '@/lib/utils';
import { Download } from 'lucide-react';

export default function RoyaltiesPage() {
  const { statements, royaltyLines } = useDigiTube();
  const [selectedStatementId, setSelectedStatementId] = useState<string>(statements[0]?.id || 'stmt_001');

  const selectedStatement = statements.find((s) => s.id === selectedStatementId) || statements[0];
  const filteredLines = royaltyLines.filter((l) => l.statementId === selectedStatement?.id);

  const handleDownloadStatementCSV = () => {
    if (!selectedStatement) return;

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Statement Batch,Month,Release Title,Track Title,ISRC,Store,Country,Streams,Gross Revenue (INR),DigiTube Commission 15% (INR),Net Artist Share (INR)\n' +
      filteredLines
        .map(
          (l) =>
            `"${selectedStatement.batchCode}","${l.month}","${l.releaseTitle}","${l.trackTitle}","${l.isrc}","${l.store}","${l.country}",${l.streamCount},${l.grossInr},${l.commissionInr},${l.netInr}`
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DigiTube_Statement_${selectedStatement.batchCode}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">Royalty Statements & Accounting Ledger</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Reconciled monthly source statements from partner distribution hubs. Built on immutable double-entry principles.
          </p>
        </div>

        {selectedStatement && (
          <button
            onClick={handleDownloadStatementCSV}
            className="btn-primary px-4 py-2 text-xs flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Download className="w-4 h-4" />
            <span>Download CSV Statement</span>
          </button>
        )}
      </div>

      {/* Blueprint Arithmetic Card (Section 12) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-executive p-5 space-y-1.5 shadow-xs">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
            Reconciled Gross Revenue
          </span>
          <div className="text-2xl font-display font-bold tabular-nums text-slate-900 dark:text-white">
            {formatCurrencyINR(selectedStatement?.totalGrossInr || 0)}
          </div>
          <p className="text-[11px] text-slate-400">
            Total sound recording earnings reported across DSPs
          </p>
        </div>

        <div className="card-executive p-5 space-y-1.5 shadow-xs">
          <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider">
            DigiTube Commission (15%)
          </span>
          <div className="text-2xl font-display font-bold tabular-nums text-blue-600 dark:text-blue-400">
            {formatCurrencyINR(selectedStatement?.digiTubeCommissionInr || 0)}
          </div>
          <p className="text-[11px] text-slate-400">
            Standard distribution contract fee v1.4
          </p>
        </div>

        <div className="card-executive p-5 space-y-1.5 shadow-xs border-emerald-500/30 dark:border-emerald-500/30">
          <span className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold uppercase tracking-wider">
            Net Artist Share (85%)
          </span>
          <div className="text-2xl font-display font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
            {formatCurrencyINR(selectedStatement?.netArtistShareInr || 0)}
          </div>
          <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
            Credited directly to available withdrawal balance
          </p>
        </div>
      </div>

      {/* Statement Period Tabs */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
        {statements.map((stmt) => (
          <button
            key={stmt.id}
            onClick={() => setSelectedStatementId(stmt.id)}
            className={`p-3 rounded-xl border text-left shrink-0 transition-all ${
              selectedStatement?.id === stmt.id
                ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-600 dark:border-blue-500 shadow-sm'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white">{stmt.period}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {stmt.batchCode}
              </span>
            </div>
            <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold mt-1">
              Net: {formatCurrencyINR(stmt.netArtistShareInr)}
            </div>
          </button>
        ))}
      </div>

      {/* Statement Line-Items Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Statement Line Items & DSP Reconciliation</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Granular breakdown mapping each ISRC, store, territory, and share calculation
            </p>
          </div>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 font-bold">
            Reconciled
          </span>
        </div>

        <div className="overflow-x-auto">
          {filteredLines.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No royalty statements recorded yet. Monthly statements will appear here after stores report stream revenues.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
                <tr>
                  <th className="py-2.5 px-3 font-bold">Track & ISRC</th>
                  <th className="py-2.5 px-3 font-bold">Store</th>
                  <th className="py-2.5 px-3 font-bold text-center">Country</th>
                  <th className="py-2.5 px-3 font-bold text-right">Streams</th>
                  <th className="py-2.5 px-3 font-bold text-right">Gross</th>
                  <th className="py-2.5 px-3 font-bold text-right">DigiTube (15%)</th>
                  <th className="py-2.5 px-3 font-bold text-right">Net Share (85%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
                {filteredLines.map((line) => (
                  <tr key={line.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900 dark:text-white">{line.trackTitle}</div>
                      <div className="text-[10px] font-mono text-slate-400">ISRC: {line.isrc}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-700 dark:text-slate-300 uppercase font-semibold text-[11px]">
                      {(line.store || '').replace('_', ' ')}
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-slate-500">
                      {line.country}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-700 dark:text-slate-200">
                      {formatNumber(line.streamCount)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-700 dark:text-slate-300">
                      {formatCurrencyINR(line.grossInr)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-rose-600 dark:text-rose-400">
                      - {formatCurrencyINR(line.commissionInr)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCurrencyINR(line.netInr)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
