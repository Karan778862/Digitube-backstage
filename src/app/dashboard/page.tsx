'use client';

import React from 'react';
import Link from 'next/link';
import { useDigiTube } from '@/lib/store';
import { formatCurrencyINR, formatNumber } from '@/lib/utils';
import {
  MoreHorizontal,
  BarChart2,
  TrendingUp,
  Plus,
  ArrowUpRight,
  Sparkles,
  Disc3,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from 'lucide-react';

export default function DashboardOverviewPage() {
  const { releases, wallet, currentUser } = useDigiTube();

  const safeReleases = Array.isArray(releases) ? releases.filter(Boolean) : [];
  const totalReleases = safeReleases.length;
  const liveReleases = safeReleases.filter((r) => r?.status === 'LIVE').length;
  const inReviewReleases = safeReleases.filter(
    (r) => r?.status === 'IN_REVIEW' || r?.status === 'VALIDATION' || r?.status === 'SUBMITTED'
  ).length;
  const changesRequired = safeReleases.filter((r) => r?.status === 'CHANGES_REQUIRED');

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Urgent QA Notification Banner */}
      {changesRequired.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-400 dark:border-amber-500/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-900 dark:text-white">
                Action Required: Super Admin requested corrections for {changesRequired.length} release(s)
              </div>
              <p className="text-slate-700 dark:text-slate-300 mt-0.5 font-medium">
                "{changesRequired[0]?.title || 'Release'}": {changesRequired[0]?.reviewNotes || 'Please review required fixes before distribution.'}
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/releases"
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm transition-colors shrink-0 self-start sm:self-auto"
          >
            Review & Fix Now &rarr;
          </Link>
        </div>
      )}

      {/* ================= TOP ROW: 3 METRIC CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Active Projects / Catalog Releases */}
        <div className="glass-card p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 text-xs font-semibold">
            <span>Active Projects</span>
            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-end justify-between pt-1">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-sans tracking-tight text-slate-900 dark:text-white">
                {liveReleases > 0 ? liveReleases : totalReleases > 0 ? totalReleases : currentUser?.isDemo ? 12 : 0}
              </span>
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" />
                <span>{totalReleases > 0 || currentUser?.isDemo ? '+8%' : 'Ready'}</span>
              </span>
            </div>

            {/* Sparkline Bar Chart in Gradient Blue/Purple */}
            <div className="flex items-end gap-1.5 h-10 pb-0.5">
              {[35, 50, 75, 40, 85, 65, 95].map((h, i) => (
                <div
                  key={i}
                  style={{ height: `${h}%` }}
                  className="w-1.5 rounded-full bg-gradient-to-t from-blue-600 via-indigo-500 to-purple-400"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Card 2: Task Progress / Ingestion Rate with Conic Gradient Donut */}
        <div className="glass-card p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 text-xs font-semibold">
            <span>Task Progress</span>
            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-3xl font-bold font-sans tracking-tight text-slate-900 dark:text-white">
              {totalReleases > 0 ? '100%' : currentUser?.isDemo ? '84%' : '0%'}
            </span>

            {/* Multi-Color Conic Gradient Donut Ring */}
            <div className="relative w-14 h-14 rounded-full donut-conic p-2 flex items-center justify-center shadow-md">
              <div className="w-8 h-8 rounded-full bg-white dark:bg-[#0d1322] shadow-inner" />
            </div>
          </div>
        </div>

        {/* Card 3: Team Performance / Streaming Velocity */}
        <div className="glass-card p-5 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 text-xs font-semibold">
            <span>Team Performance</span>
            <div className="w-5 h-5 text-slate-400 flex items-center justify-center">
              <BarChart2 className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <span className="text-3xl font-bold font-sans tracking-tight text-slate-900 dark:text-white">
              {totalReleases > 0 ? '98%' : currentUser?.isDemo ? '91%' : '100%'}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Optimal Delivery</span>
          </div>
        </div>
      </div>

      {/* ================= MIDDLE ROW: PROJECT OVERVIEW (CHART) + UPCOMING DEADLINES ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Project Overview (Dual Curved Spline Area Chart) - 2 Columns */}
        <div className="lg:col-span-2 glass-card p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Project Overview</h3>

            <div className="flex items-center gap-6 text-xs">
              <div>
                <span className="text-[11px] text-slate-400 block">Revenue</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {wallet.availableBalance > 0 ? formatCurrencyINR(wallet.availableBalance) : currentUser?.isDemo ? '₹2,45,000' : '₹0.00'}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">Velocity</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {totalReleases > 0 || currentUser?.isDemo ? '78%' : '0%'}
                </span>
              </div>
            </div>
          </div>

          {/* Dual Spline Chart Area */}
          <div className="w-full h-56 pt-2">
            <svg viewBox="0 0 650 200" className="w-full h-full overflow-visible">
              <defs>
                {/* Blue/Cyan Gradient Fill */}
                <linearGradient id="areaGradientBlue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                </linearGradient>
                {/* Purple Spline Glow */}
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#8b5cf6" floodOpacity="0.3" />
                </filter>
              </defs>

              {/* Horizontal Grid Lines */}
              {[
                { y: 25, label: '400' },
                { y: 65, label: '300' },
                { y: 105, label: '200' },
                { y: 145, label: '100' },
                { y: 185, label: '0' },
              ].map((grid, idx) => (
                <g key={idx}>
                  <text x="0" y={grid.y + 4} className="text-[10px] fill-slate-400 font-mono">
                    {grid.label}
                  </text>
                  <line
                    x1="35"
                    y1={grid.y}
                    x2="650"
                    y2={grid.y}
                    stroke="currentColor"
                    className="text-slate-100 dark:text-slate-800"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                </g>
              ))}

              {/* Blue/Cyan Filled Area under curve */}
              <path
                d="M 40,165 C 90,140 140,115 190,120 C 240,125 290,95 340,75 C 390,60 440,95 490,80 C 540,65 590,90 645,80 L 645,185 L 40,185 Z"
                fill="url(#areaGradientBlue)"
              />

              {/* Blue Spline Line */}
              <path
                d="M 40,165 C 90,140 140,115 190,120 C 240,125 290,95 340,75 C 390,60 440,95 490,80 C 540,65 590,90 645,80"
                fill="none"
                stroke="#0ea5e9"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Purple/Violet Spline Line */}
              <path
                d="M 40,150 C 90,120 140,135 190,95 C 240,65 290,110 340,65 C 390,30 440,90 490,65 C 540,45 590,75 645,65"
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="2.5"
                strokeLinecap="round"
                filter="url(#glow)"
              />

              {/* Active Highlight Data Point on Peak with Tooltip */}
              <g transform="translate(340, 65)">
                <circle cx="0" cy="0" r="4.5" fill="#ffffff" stroke="#8b5cf6" strokeWidth="2.5" />
                {/* Tooltip Pill */}
                <rect x="-24" y="-30" width="48" height="20" rx="6" fill="#ffffff" className="dark:fill-slate-900 shadow-md stroke-slate-200 dark:stroke-slate-700" />
                <text x="0" y="-16" textAnchor="middle" className="text-[10px] font-bold fill-slate-800 dark:fill-white font-mono">
                  25.2K
                </text>
              </g>

              {/* X-Axis Labels */}
              {[
                { x: 50, label: 'Jan' },
                { x: 140, label: 'Feb' },
                { x: 230, label: 'Mar' },
                { x: 320, label: 'Wed' },
                { x: 410, label: 'Thu' },
                { x: 500, label: 'Jul' },
                { x: 600, label: 'Sep' },
              ].map((lbl, idx) => (
                <text key={idx} x={lbl.x} y="200" textAnchor="middle" className="text-[10px] fill-slate-400 font-mono">
                  {lbl.label}
                </text>
              ))}
            </svg>
          </div>
        </div>

        {/* Right: Upcoming Deadlines - 1 Column */}
        <div className="glass-card p-6 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between text-slate-900 dark:text-white text-sm font-bold">
            <span>Upcoming Deadlines</span>
            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3.5">
            {/* Item 1: Blue Stripe */}
            <div className="flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-1 h-9 rounded-full bg-blue-500 shrink-0" />
                <div className="min-w-0">
                  <div className="font-bold text-slate-900 dark:text-white truncate">
                    {releases[0]?.title || 'DDEX DSP Batch Ingestion'}
                  </div>
                  <div className="text-[11px] text-slate-400">Scheduled Ingestion</div>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                Priority
              </span>
            </div>

            {/* Item 2: Amber Stripe */}
            <div className="flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-1 h-9 rounded-full bg-amber-500 shrink-0" />
                <div className="min-w-0">
                  <div className="font-bold text-slate-900 dark:text-white truncate">
                    {releases[1]?.title || 'Metadata QA Compliance Review'}
                  </div>
                  <div className="text-[11px] text-slate-400">Editorial Verification</div>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                Priority
              </span>
            </div>

            {/* Item 3: Red Stripe */}
            <div className="flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-1 h-9 rounded-full bg-rose-500 shrink-0" />
                <div className="min-w-0">
                  <div className="font-bold text-slate-900 dark:text-white truncate">
                    {releases[2]?.title || 'Automated Royalty Ledger Sync'}
                  </div>
                  <div className="text-[11px] text-slate-400">Double-Entry Audit</div>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                Priority
              </span>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/dashboard/releases"
              className="w-full py-2 px-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs text-center block shadow-sm shadow-blue-500/20 transition-all"
            >
              View All
            </Link>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM ROW: RECENT ACTIVITY + TEAM MEMBERS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Recent Activity - 2 Columns */}
        <div className="lg:col-span-2 glass-card p-6 space-y-4">
          <div className="flex items-center justify-between text-slate-900 dark:text-white text-sm font-bold">
            <span>Recent Activity</span>
            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3.5">
            {/* Activity 1 */}
            <div className="flex items-center justify-between text-xs gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-slate-900 dark:text-white truncate">
                    Actions updated on Client Portal V2
                  </div>
                  <div className="text-[11px] text-slate-400">Updated with package.</div>
                </div>
              </div>
              <span className="text-[11px] text-slate-400 font-mono shrink-0">3:33 AM</span>
            </div>

            {/* Activity 2 */}
            <div className="flex items-center justify-between text-xs gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-slate-900 dark:text-white truncate">
                    Actions selector for Market Analysis
                  </div>
                  <div className="text-[11px] text-slate-400">Metadata validation complete.</div>
                </div>
              </div>
              <span className="text-[11px] text-slate-400 font-mono shrink-0">12:03 AM</span>
            </div>

            {/* Activity 3 */}
            <div className="flex items-center justify-between text-xs gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-slate-900 dark:text-white truncate">
                    Actions under Security Audit
                  </div>
                  <div className="text-[11px] text-slate-400">DDEX delivery pipeline active.</div>
                </div>
              </div>
              <span className="text-[11px] text-slate-400 font-mono shrink-0">12:50 AM</span>
            </div>
          </div>
        </div>

        {/* Right: Team Members - 1 Column */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center justify-between text-slate-900 dark:text-white text-sm font-bold">
            <span>Team Members</span>
            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3.5">
            {/* Member 1 */}
            <div className="flex items-center gap-3 text-xs">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0">
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                  alt="Sarah Chen"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-slate-900 dark:text-white truncate">
                  {currentUser.stageName || currentUser.fullName || 'Authorized Artist'}
                </div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Online</span>
                </div>
              </div>
            </div>

            {/* Member 2 */}
            <div className="flex items-center gap-3 text-xs">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                  alt="Operations Desk"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-slate-900 dark:text-white truncate">DigiTube Operations Desk</div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Online</span>
                </div>
              </div>
            </div>

            {/* Member 3 */}
            <div className="flex items-center gap-3 text-xs">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
                  alt="DSP Lead"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-slate-900 dark:text-white truncate">DSP Compliance Lead</div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
