'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDigiTube } from '@/lib/store';
import {
  LayoutDashboard,
  PlusCircle,
  Disc3,
  BarChart3,
  Receipt,
  Wallet,
  Share2,
  Users2,
  HelpCircle,
  Settings,
  ShieldAlert,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: any;
  highlight?: boolean;
  badge?: string | number;
  alert?: boolean;
  isLabelOnly?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const DashboardSidebar: React.FC = () => {
  const pathname = usePathname();
  const { releases, wallet, tickets, currentUser } = useDigiTube();

  const safeReleases = Array.isArray(releases) ? releases.filter(Boolean) : [];
  const safeTickets = Array.isArray(tickets) ? tickets.filter(Boolean) : [];

  const pendingReleasesCount = safeReleases.filter(
    (r) => r?.status === 'IN_REVIEW' || r?.status === 'CHANGES_REQUIRED'
  ).length;
  const openTicketsCount = safeTickets.filter((t) => t?.status !== 'CLOSED' && t?.status !== 'RESOLVED').length;

  const navItems: NavSection[] = [
    {
      title: 'Backstage Hub',
      items: [
        { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
        {
          href: '/dashboard/releases/new',
          label: 'New Release',
          icon: PlusCircle,
          highlight: true,
        },
        {
          href: '/dashboard/releases',
          label: 'My Catalog',
          icon: Disc3,
          badge: safeReleases.length,
          alert: pendingReleasesCount > 0,
        },
      ],
    },
    {
      title: 'Performance & Revenue',
      items: [
        { href: '/dashboard/analytics', label: 'Analytics & Trends', icon: BarChart3 },
        { href: '/dashboard/royalties', label: 'Royalties Ledger', icon: Receipt },
        {
          href: '/dashboard/wallet',
          label: 'Wallet & Payouts',
          icon: Wallet,
          badge:
            (wallet?.availableBalance || 0) > 0
              ? `₹${Math.round((wallet?.availableBalance || 0) / 1000)}k`
              : undefined,
        },
      ],
    },
    {
      title: 'Marketing & Roster',
      items: [
        { href: '/dashboard/marketing', label: 'Smart Links & Pre-Save', icon: Share2 },
        {
          href: '/dashboard/label',
          label: 'Record Label Hub',
          icon: Users2,
          isLabelOnly: true,
        },
      ],
    },
    {
      title: 'Account & Support',
      items: [
        {
          href: '/dashboard/support',
          label: 'Support Tickets',
          icon: HelpCircle,
          badge: openTicketsCount > 0 ? openTicketsCount : undefined,
        },
        { href: '/dashboard/settings', label: 'Settings & Security', icon: Settings },
      ],
    },
  ];

  const userRole = currentUser?.role || 'GUEST';
  const isStaff =
    userRole === 'SUPER_ADMIN' ||
    userRole === 'RELEASE_MANAGER' ||
    userRole === 'ACCOUNTS_STAFF' ||
    userRole === 'CATALOG_STAFF';

  return (
    <aside className="w-64 bg-slate-50/50 dark:bg-[#0a0f1d]/50 border-r border-slate-200/50 dark:border-slate-800/50 flex flex-col shrink-0 select-none transition-colors z-20">
      {/* Brand Header */}
      <div className="h-16 px-5 flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/50 shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-500 flex items-center justify-center shadow-md shadow-blue-500/20 text-white">
            <Disc3 className="w-4 h-4" />
          </div>
          <div>
            <div className="font-display font-bold text-sm tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>DigiTube</span>
              <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/60">
                Enterprise
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium leading-none mt-0.5">Distribution Network</p>
          </div>
        </Link>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto py-5 px-3 space-y-6">
        {navItems.map((section, sIdx) => (
          <div key={sIdx} className="space-y-1">
            <h3 className="px-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5 tracking-normal">
              {section.title}
            </h3>
            {section.items.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              if (item.isLabelOnly && userRole !== 'RECORD_LABEL' && userRole !== 'SUPER_ADMIN') {
                return null;
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-bold shadow-sm border border-slate-200/60 dark:border-slate-700/60'
                      : item.highlight
                      ? 'text-blue-600 dark:text-blue-400 hover:bg-white/60 dark:hover:bg-slate-800/40 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/60 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive
                          ? 'text-blue-600 dark:text-blue-400'
                          : item.highlight
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-medium ${
                        item.alert
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                          : isActive
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}

        {/* Super Admin Switcher for Staff */}
        {isStaff && (
          <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60 px-1">
            <Link
              href="/admin"
              className="flex items-center justify-between px-3 py-2 rounded-lg bg-amber-50 text-amber-900 dark:bg-amber-950/30 dark:text-amber-300 border border-amber-200/70 dark:border-amber-800/40 text-xs font-semibold hover:border-amber-400 transition-all"
            >
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Super Admin Desk</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            </Link>
          </div>
        )}
      </div>

      {/* Footer System Specs */}
      <div className="p-4 border-t border-slate-200/80 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between shrink-0">
        <div>
          <div className="font-semibold text-slate-800 dark:text-slate-200">DDEX Ingestion Active</div>
          <div className="text-[10px] text-slate-400 font-mono">150+ Stores Connected</div>
        </div>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      </div>
    </aside>
  );
};
