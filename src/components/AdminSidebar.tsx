'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDigiTube } from '@/lib/store';
import {
  ShieldAlert,
  ClipboardCheck,
  Send,
  Receipt,
  CheckCircle,
  Users,
  LifeBuoy,
  History,
  ArrowLeft,
  Server,
  Lock,
} from 'lucide-react';

interface NavItemConfig {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  allowedRoles: string[];
  badgeType?: 'review' | 'payouts' | 'support';
}

const ALL_ADMIN_NAV: NavItemConfig[] = [
  {
    href: '/admin',
    label: 'Operations Hub',
    icon: ShieldAlert,
    allowedRoles: ['SUPER_ADMIN', 'COMPANY_ADMIN', 'RELEASE_MANAGER', 'CATALOG_STAFF', 'ACCOUNTS_STAFF', 'SUPPORT_STAFF'],
  },
  {
    href: '/admin/review',
    label: 'Quality Review Queue',
    icon: ClipboardCheck,
    allowedRoles: ['SUPER_ADMIN', 'COMPANY_ADMIN', 'RELEASE_MANAGER', 'CATALOG_STAFF'],
    badgeType: 'review',
  },
  {
    href: '/admin/distribution',
    label: 'DSP Partner Adapters',
    icon: Send,
    allowedRoles: ['SUPER_ADMIN', 'COMPANY_ADMIN', 'RELEASE_MANAGER'],
  },
  {
    href: '/admin/finance',
    label: 'Royalty Ingestion Engine',
    icon: Receipt,
    allowedRoles: ['SUPER_ADMIN', 'COMPANY_ADMIN', 'ACCOUNTS_STAFF'],
  },
  {
    href: '/admin/payouts',
    label: 'Payout Authorizations',
    icon: CheckCircle,
    allowedRoles: ['SUPER_ADMIN', 'COMPANY_ADMIN', 'ACCOUNTS_STAFF'],
    badgeType: 'payouts',
  },
  {
    href: '/admin/staff',
    label: 'Staff Roles & RBAC',
    icon: Users,
    allowedRoles: ['SUPER_ADMIN'], // STRICT: ONLY SUPER_ADMIN!
  },
  {
    href: '/admin/support',
    label: 'Helpdesk Operations',
    icon: LifeBuoy,
    allowedRoles: ['SUPER_ADMIN', 'COMPANY_ADMIN', 'SUPPORT_STAFF'],
    badgeType: 'support',
  },
  {
    href: '/admin/audit',
    label: 'System Audit Logs',
    icon: History,
    allowedRoles: ['SUPER_ADMIN', 'COMPANY_ADMIN'],
  },
];

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const { releases, payouts, tickets, currentUser } = useDigiTube();

  const userRole = currentUser?.role || 'GUEST';

  const pendingReviewCount = releases.filter(
    (r) => r.status === 'IN_REVIEW' || r.status === 'SUBMITTED' || r.status === 'VALIDATION'
  ).length;

  const pendingPayoutsCount = payouts.filter((p) => p.status === 'PENDING_REVIEW').length;
  const openTicketsCount = tickets.filter((t) => t.status === 'NEW' || t.status === 'IN_PROGRESS').length;

  // Filter navigation items strictly by role
  const visibleNav = ALL_ADMIN_NAV.filter((item) => item.allowedRoles.includes(userRole));

  return (
    <aside className="w-64 bg-white dark:bg-[#080c14] border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0 sticky top-0 h-screen select-none transition-colors z-40">
      {/* Admin Header */}
      <div className="h-16 px-6 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-amber-50/50 dark:bg-amber-950/20 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-sm">
            <Server className="w-4 h-4" />
          </div>
          <div>
            <div className="font-display font-black text-sm text-slate-900 dark:text-amber-200">DigiTube Admin</div>
            <div className="text-[10px] text-amber-700 dark:text-amber-400 uppercase tracking-wider font-bold leading-none">
              Internal Operations
            </div>
          </div>
        </div>
      </div>

      {/* Switch to Artist Portal link */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-800">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit to Artist Portal</span>
        </Link>
      </div>

      {/* Role Notice Pill */}
      <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/30 flex items-center justify-between">
        <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Access Scope</span>
        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50">
          {userRole.replace(/_/g, ' ')}
        </span>
      </div>

      {/* Filtered Admin Nav Items */}
      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
        {visibleNav.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          let badgeCount = 0;
          let isAlert = false;
          if (item.badgeType === 'review') {
            badgeCount = pendingReviewCount;
            isAlert = pendingReviewCount > 0;
          } else if (item.badgeType === 'payouts') {
            badgeCount = pendingPayoutsCount;
            isAlert = pendingPayoutsCount > 0;
          } else if (item.badgeType === 'support') {
            badgeCount = openTicketsCount;
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40 font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`w-4 h-4 ${isActive ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'}`}
                />
                <span>{item.label}</span>
              </div>

              {badgeCount > 0 && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                    isAlert
                      ? 'bg-amber-200 dark:bg-amber-500/30 text-amber-900 dark:text-amber-300 border border-amber-400 dark:border-amber-500/40'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {badgeCount}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Security Status Box */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 shrink-0">
        <div className="flex items-center gap-2 text-[11px] text-amber-700 dark:text-amber-400 font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="truncate">RBAC Protected • {userRole.replace(/_/g, ' ')}</span>
        </div>
      </div>
    </aside>
  );
};
