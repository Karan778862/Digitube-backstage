'use client';

import React from 'react';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { DashboardHeader } from '@/components/DashboardHeader';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#c8dbf9] via-[#dbeafe] to-[#e8eefa] dark:from-[#050811] dark:via-[#090e1f] dark:to-[#0e172e] text-slate-900 dark:text-slate-100 transition-colors relative overflow-x-hidden p-2 sm:p-4 md:p-6 lg:p-8 flex justify-center items-start">
      {/* Ambient background soft light blurs matching Astra reference */}
      <div className="fixed top-[-80px] left-[-80px] w-[550px] h-[550px] rounded-full bg-blue-500/20 dark:bg-blue-600/15 blur-[140px] pointer-events-none" />
      <div className="fixed bottom-[-80px] right-[-80px] w-[550px] h-[550px] rounded-full bg-indigo-500/20 dark:bg-indigo-600/15 blur-[140px] pointer-events-none" />
      <div className="fixed top-[30%] right-[15%] w-[450px] h-[450px] rounded-full bg-purple-400/18 dark:bg-purple-600/15 blur-[120px] pointer-events-none" />

      {/* Main Glass Canvas Card Frame with Astra Glowing Border & Rounded Rim */}
      <div className="w-full max-w-[1600px] bg-white/75 dark:bg-[#0c1220]/80 backdrop-blur-3xl border-2 border-blue-400/35 dark:border-blue-500/30 rounded-[32px] md:rounded-[40px] shadow-[0_0_60px_rgba(59,130,246,0.16),0_25px_60px_-15px_rgba(30,58,138,0.12)] overflow-hidden flex flex-col md:flex-row relative z-10 min-h-[92vh]">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <DashboardHeader />
          <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">{children}</main>
        </div>
      </div>
    </div>
  );
}
