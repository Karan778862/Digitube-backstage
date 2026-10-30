'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { DashboardHeader } from '@/components/DashboardHeader';
import { useDigiTube } from '@/lib/store';
import { Lock, RefreshCw } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, isAuthLoading, isAuthenticated } = useDigiTube();

  const isUserAuthenticated = Boolean(
    isAuthenticated ||
    currentUser?.isAuthenticated ||
    currentUser?.isDemo ||
    (currentUser?.email && currentUser?.email.length > 0 && currentUser?.role !== 'GUEST')
  );

  useEffect(() => {
    if (!isAuthLoading && !isUserAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname || '/dashboard')}`);
    }
  }, [isAuthLoading, isUserAuthenticated, router, pathname]);

  // While checking auth status on initial load, show a clean, secure loading gate
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col justify-center items-center px-4">
        <div className="p-8 rounded-2xl bg-[#0d1322] border border-blue-500/20 shadow-2xl flex flex-col items-center text-center space-y-4 max-w-sm">
          <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center animate-pulse">
            <RefreshCw className="w-6 h-6 animate-spin" />
          </div>
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-white tracking-wide">DigiTube Security Gate</h2>
            <p className="text-xs text-slate-400">Verifying authorized backstage session...</p>
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated, block render and redirect to login
  if (!isUserAuthenticated) {
    return (
      <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col justify-center items-center px-4">
        <div className="p-8 rounded-2xl bg-[#0d1322] border border-red-500/30 shadow-2xl flex flex-col items-center text-center space-y-4 max-w-sm">
          <div className="w-12 h-12 rounded-xl bg-red-600/20 border border-red-500/30 text-red-400 flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-white">Authentication Required</h2>
            <p className="text-xs text-slate-400">
              Please sign in with your email and password to access your artist catalog.
            </p>
          </div>
          <button
            onClick={() => router.replace(`/login?redirect=${encodeURIComponent(pathname || '/dashboard')}`)}
            className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <span>Proceed to Sign In</span>
          </button>
        </div>
      </div>
    );
  }

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
