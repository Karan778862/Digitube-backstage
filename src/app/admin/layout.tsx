'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AdminSidebar } from '@/components/AdminSidebar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useDigiTube } from '@/lib/store';
import {
  ShieldAlert,
  Lock,
  ArrowRight,
  Disc3,
  LogIn,
  ShieldX,
  AlertTriangle,
} from 'lucide-react';

const ADMIN_ROLES = [
  'SUPER_ADMIN',
  'COMPANY_ADMIN',
  'RELEASE_MANAGER',
  'CATALOG_STAFF',
  'ACCOUNTS_STAFF',
  'SUPPORT_STAFF',
];

// Strict Route Access Control Matrix
const ROUTE_PERMISSIONS: { prefix: string; allowed: string[]; title: string }[] = [
  { prefix: '/admin/staff', allowed: ['SUPER_ADMIN'], title: 'Staff Administration & Role RBAC' },
  { prefix: '/admin/audit', allowed: ['SUPER_ADMIN', 'COMPANY_ADMIN'], title: 'System Security Audit Logs' },
  { prefix: '/admin/finance', allowed: ['SUPER_ADMIN', 'COMPANY_ADMIN', 'ACCOUNTS_STAFF'], title: 'Royalty Ingestion Engine' },
  { prefix: '/admin/payouts', allowed: ['SUPER_ADMIN', 'COMPANY_ADMIN', 'ACCOUNTS_STAFF'], title: 'Financial Payout Authorizations' },
  { prefix: '/admin/distribution', allowed: ['SUPER_ADMIN', 'COMPANY_ADMIN', 'RELEASE_MANAGER'], title: 'DSP Partner Adapters' },
  { prefix: '/admin/review', allowed: ['SUPER_ADMIN', 'COMPANY_ADMIN', 'RELEASE_MANAGER', 'CATALOG_STAFF'], title: 'Catalog Quality Review Queue' },
  { prefix: '/admin/support', allowed: ['SUPER_ADMIN', 'COMPANY_ADMIN', 'SUPPORT_STAFF'], title: 'Helpdesk & Ticket Operations' },
  { prefix: '/admin', allowed: ADMIN_ROLES, title: 'Operations Hub' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { currentUser } = useDigiTube();

  const userRole = currentUser?.role || 'GUEST';
  const isStaffAuthorized = ADMIN_ROLES.includes(userRole);

  // 1. If user is not staff at all, block entire admin portal
  if (!isStaffAuthorized) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative">
        <div className="absolute top-5 right-5">
          <ThemeToggle />
        </div>

        <div className="max-w-md w-full bg-slate-950 border border-red-500/30 rounded-2xl p-7 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-red-950/60 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-red-400 font-bold bg-red-950/40 px-2.5 py-1 rounded-full border border-red-900/60">
              Access Restricted
            </span>
            <h1 className="text-xl font-display font-bold text-white tracking-tight">
              DigiTube Operations Portal
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              This area contains privileged DDEX catalog ingestion tools, financial payouts, and staff management. Authorized staff and Super Admin credentials are required.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-left text-xs space-y-1.5 font-mono">
            <div className="text-[11px] text-slate-500 font-sans font-semibold">Active Session:</div>
            <div className="text-slate-200 truncate">
              User: <span className="text-white font-bold">{currentUser.fullName || currentUser.stageName || 'Guest'}</span>
            </div>
            <div className="text-slate-400 truncate">
              Email: <span className="text-slate-300">{currentUser.email || 'Not logged in'}</span>
            </div>
            <div className="text-slate-400">
              Assigned Role: <span className="text-amber-400 font-bold">{userRole}</span>
            </div>
          </div>

          <div className="space-y-2.5 pt-2">
            <Link
              href="/login"
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In with Staff / Admin Credentials</span>
            </Link>

            <Link
              href="/dashboard"
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <span>Return to Artist Backstage</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. Check if current staff role has permission for this specific page
  const matchingRoute = ROUTE_PERMISSIONS.find((r) => pathname === r.prefix || pathname.startsWith(r.prefix + '/'));
  const isPageAuthorized = !matchingRoute || matchingRoute.allowed.includes(userRole);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#080c14] text-slate-900 dark:text-slate-100 transition-colors">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Operations Bar */}
        <div className="h-14 bg-white/90 dark:bg-[#080c14]/90 border-b border-amber-200 dark:border-amber-500/20 px-6 flex items-center justify-between text-xs sticky top-0 z-30 backdrop-blur-md">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
            <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="font-bold">DigiTube Privileged Operations</span>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <span className="text-slate-600 dark:text-slate-400 font-mono text-[11px]">
              Logged in: <strong className="text-slate-900 dark:text-white">{currentUser.fullName}</strong> ({userRole.replace(/_/g, ' ')})
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 text-[11px] font-bold border border-blue-200 dark:border-blue-800/60 transition-colors"
            >
              <Disc3 className="w-3.5 h-3.5" />
              <span>Artist Backstage &rarr;</span>
            </Link>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>DigiTube DDEX Grid:</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">Online</span>
            </div>
            <ThemeToggle />
          </div>
        </div>

        {/* 3. Render content or 403 Forbidden Shield if page access is denied for this staff role */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {isPageAuthorized ? (
            children
          ) : (
            <div className="max-w-xl mx-auto my-12 p-8 rounded-2xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/60 shadow-xl text-center space-y-5 animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-rose-100 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
                <ShieldX className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-400 text-xs font-mono font-bold uppercase">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>403 Forbidden • Access Denied</span>
                </div>
                <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white">
                  Restricted Staff Area
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                  Your staff account role (<strong>{userRole.replace(/_/g, ' ')}</strong>) is not authorized to access <strong className="text-slate-700 dark:text-slate-200">{matchingRoute?.title || pathname}</strong>.
                  This page requires elevated privileges (<strong>{matchingRoute?.allowed.join(', ')}</strong>).
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-left text-xs font-mono space-y-1">
                <div className="text-slate-400 text-[11px]">Security Enforcement:</div>
                <div className="text-slate-600 dark:text-slate-300">• Path: {pathname}</div>
                <div className="text-slate-600 dark:text-slate-300">• Account: {currentUser.email}</div>
                <div className="text-emerald-600 dark:text-emerald-400">• Security Guard: Active & Logged</div>
              </div>

              <div className="pt-2 flex items-center justify-center gap-3">
                {userRole === 'SUPPORT_STAFF' ? (
                  <Link
                    href="/admin/support"
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm"
                  >
                    Go to Helpdesk Operations
                  </Link>
                ) : (
                  <Link
                    href="/admin"
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition-all shadow-sm"
                  >
                    Return to Operations Hub
                  </Link>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
