'use client';

import React, { useState } from 'react';
import { useDigiTube } from '@/lib/store';
import { formatNumber, formatCompactNumber, formatCurrencyINR } from '@/lib/utils';
import {
  BarChart3,
  TrendingUp,
  Globe2,
  Calendar,
  Download,
  Filter,
  Disc,
  Play,
  ArrowUpRight,
  Info,
} from 'lucide-react';

export default function AnalyticsPage() {
  const { releases } = useDigiTube();
  const [timeRange, setTimeRange] = useState<'30D' | '90D' | '1Y' | 'ALL'>('30D');

  // Country demographic data
  const topCountries = [
    { code: 'IN', name: 'India', streams: 2980000, percentage: 77.4, flag: '🇮🇳' },
    { code: 'US', name: 'United States', streams: 420000, percentage: 10.9, flag: '🇺🇸' },
    { code: 'AE', name: 'United Arab Emirates', streams: 230000, percentage: 5.9, flag: '🇦🇪' },
    { code: 'GB', name: 'United Kingdom', streams: 130000, percentage: 3.4, flag: '🇬🇧' },
    { code: 'CA', name: 'Canada', streams: 90500, percentage: 2.4, flag: '🇨🇦' },
  ];

  // Song performance data
  const songPerformance = [
    {
      title: 'Kesariya Lofi Sunset',
      isrc: 'INDGT2600101',
      streams: 2150000,
      playlistAdds: 14200,
      saves: 48900,
      estimatedRev: 75250,
      trend: '+28.4%',
    },
    {
      title: 'Baarish Ka Pehla Khat',
      isrc: 'INDGT2600045',
      streams: 890000,
      playlistAdds: 8100,
      saves: 19400,
      estimatedRev: 31150,
      trend: '+14.2%',
    },
    {
      title: 'Marine Drive Echoes',
      isrc: 'INDGT2600046',
      streams: 560000,
      playlistAdds: 4300,
      saves: 11200,
      estimatedRev: 19600,
      trend: '+8.1%',
    },
    {
      title: 'Midnight in Delhi (Synthwave)',
      isrc: 'INDGT2600120',
      streams: 250500,
      playlistAdds: 2900,
      saves: 6800,
      estimatedRev: 8768,
      trend: 'New',
    },
  ];

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Track Title,ISRC,Streams,Playlist Adds,Saves,Estimated Revenue (INR)\n' +
      songPerformance
        .map((s) => `"${s.title}",${s.isrc},${s.streams},${s.playlistAdds},${s.saves},${s.estimatedRev}`)
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DigiTube_Analytics_Report_${timeRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
            Streaming Analytics & Reports
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time listener engagement, playlist additions, and verified geographical performance across 150+ stores.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Time range pills */}
          <div className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-1 flex items-center text-xs">
            {(['30D', '90D', '1Y', 'ALL'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  timeRange === r
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCSV}
            className="btn-secondary px-3.5 py-1.5 text-xs flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Provisional vs Confirmed Banner Notice (Section 13) */}
      <div className="p-3.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/50 text-xs text-slate-700 dark:text-slate-300 flex items-center gap-3 shadow-xs">
        <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
        <div>
          <strong className="text-blue-700 dark:text-blue-400 font-semibold">Provisional Analytics Notice:</strong> Streaming numbers shown are daily provider estimates. Official accounting balances are derived strictly through reconciled monthly royalty statements in the Royalties Ledger.
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-executive p-5 space-y-2 shadow-xs">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Total Stream Count</span>
          <div className="text-2xl font-display font-bold tabular-nums text-slate-900 dark:text-white">
            {releases.length === 0 ? '0' : '3,850,500'}
          </div>
          <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
            {releases.length === 0 ? 'No active streams yet' : '+22.4% vs previous 30 days'}
          </span>
        </div>

        <div className="card-executive p-5 space-y-2 shadow-xs">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Unique Listeners</span>
          <div className="text-2xl font-display font-bold tabular-nums text-slate-900 dark:text-white">
            {releases.length === 0 ? '0' : '1,120,400'}
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            {releases.length === 0 ? 'Awaiting store listeners' : '68% Repeat Listener Rate'}
          </span>
        </div>

        <div className="card-executive p-5 space-y-2 shadow-xs">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Editorial & User Playlists</span>
          <div className="text-2xl font-display font-bold tabular-nums text-slate-900 dark:text-white">
            {releases.length === 0 ? '0 Adds' : '25,200 Adds'}
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            {releases.length === 0 ? 'Submit releases for playlist pitching' : 'Featured on 4 Spotify Editorial'}
          </span>
        </div>

        <div className="card-executive p-5 space-y-2 shadow-xs">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Provisional Revenue</span>
          <div className="text-2xl font-display font-bold tabular-nums text-blue-600 dark:text-blue-400">
            {releases.length === 0 ? '₹0' : '₹1,34,768'}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Estimated before statement settlement</span>
        </div>
      </div>

      {/* Track by Track Breakdown Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Song Performance Breakdown</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Track-level streams, saves, playlist adds, and estimated royalty generation</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          {releases.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No track streaming activity recorded yet. Performance metrics will appear here once your releases are live on stores.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
                <tr>
                  <th className="py-3 px-4 font-semibold">Song Title & ISRC</th>
                  <th className="py-3 px-4 font-semibold text-right">Streams</th>
                  <th className="py-3 px-4 font-semibold text-right">Playlist Adds</th>
                  <th className="py-3 px-4 font-semibold text-right">User Saves</th>
                  <th className="py-3 px-4 font-semibold text-right">Estimated Earnings</th>
                  <th className="py-3 px-4 font-semibold text-right">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {songPerformance.map((song, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">{song.title}</div>
                      <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400">ISRC: {song.isrc}</div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-700 dark:text-slate-200">
                      {formatNumber(song.streams)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-600 dark:text-slate-300">
                      {formatNumber(song.playlistAdds)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-600 dark:text-slate-300">
                      {formatNumber(song.saves)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrencyINR(song.estimatedRev)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span
                        className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold ${
                          song.trend === 'New'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                        }`}
                      >
                        {song.trend}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Geographical Territory Share */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Globe2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Top Listener Territories</h3>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">150+ Territories Active</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {topCountries.map((c) => (
            <div key={c.code} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xl">{c.flag}</span>
                <span className="text-[10px] font-mono text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-950/80 px-1.5 py-0.5 rounded font-semibold">
                  {c.code}
                </span>
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-white text-xs">{c.name}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">{formatNumber(c.streams)} streams</div>
              </div>
              <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: `${c.percentage}%` }} />
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 text-right">{c.percentage}% share</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
