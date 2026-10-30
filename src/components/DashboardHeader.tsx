'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useDigiTube } from '@/lib/store';
import { formatCurrencyINR } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  Bell,
  Wallet,
  ChevronDown,
  Building2,
  User,
  ShieldAlert,
  Plus,
  Radio,
  Check,
  LogOut,
  Search,
  MessageSquare,
} from 'lucide-react';

export const DashboardHeader: React.FC = () => {
  const { currentUser, switchRole, wallet, logoutUser } = useDigiTube();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowRoleMenu(false);
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = [
    {
      id: 1,
      title: 'Release Approved for Delivery',
      desc: 'Master WAV queued to DigiTube DDEX hub.',
      time: '2h ago',
    },
    {
      id: 2,
      title: 'Action Required: Sample Clearance',
      desc: 'Copyright validation pending for catalog asset.',
      time: '6h ago',
    },
    {
      id: 3,
      title: 'Royalty Statement Published',
      desc: 'Net artist share credited to wallet balance.',
      time: '1d ago',
    },
  ];

  return (
    <header className="h-16 bg-white/40 dark:bg-[#080c14]/40 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 px-6 flex items-center justify-between sticky top-0 z-30 transition-colors">
      {/* Left: User Avatar & Welcome Greeting (Astra Style) */}
      <div className="flex items-center gap-3" ref={menuRef}>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-3 text-left group transition-all"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white dark:border-slate-700 shadow-sm shrink-0 bg-gradient-to-tr from-purple-500 to-blue-500 p-0.5">
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                alt={currentUser.stageName}
                className="w-full h-full rounded-full object-cover bg-white"
              />
            </div>
            <div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-normal block leading-tight">
                Welcome,
              </span>
              <span className="font-bold text-slate-900 dark:text-white text-sm block leading-tight flex items-center gap-1">
                <span>{currentUser.stageName || currentUser.fullName}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform" />
              </span>
            </div>
          </button>

          {/* User Workspace Switcher & Logout Dropdown */}
          {showRoleMenu && (
            <div className="absolute left-0 mt-3 w-72 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl py-2 z-50 text-xs animate-fade-in">
              <div className="px-3.5 py-1 text-[10px] font-semibold text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800 mb-1">
                Active Session & Workspace
              </div>

              <div className="px-3.5 py-2 space-y-0.5">
                <div className="font-bold text-slate-900 dark:text-white text-xs">{currentUser.fullName}</div>
                <div className="text-[11px] text-slate-500 font-mono truncate">{currentUser.email}</div>
                <div className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase pt-0.5">
                  Role: {currentUser.role}
                </div>
              </div>

              <div className="pt-1 mt-1 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={async () => {
                    await logoutUser();
                    setShowRoleMenu(false);
                    window.location.href = '/login';
                  }}
                  className="w-full text-left px-3.5 py-2 flex items-center gap-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-semibold rounded-b-xl transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out of Backstage</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: Search Pill, Messages, Notifications, Theme Toggle */}
      <div className="flex items-center gap-3">
        {/* Soft Search Pill */}
        <div className="relative hidden sm:block w-48 md:w-60">
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-slate-100/90 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800 rounded-full pl-8 pr-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 transition-all shadow-inner"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
        </div>

        {/* Message / Chat button */}
        <Link
          href="/dashboard/support"
          className="w-9 h-9 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/70 dark:border-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-800 transition-all shadow-xs"
          title="Support & Messages"
        >
          <MessageSquare className="w-4 h-4" />
        </Link>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/70 dark:border-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-800 transition-all relative shadow-xs"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 border border-white dark:border-slate-900" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-4 z-50 text-xs animate-fade-in space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="font-bold text-slate-900 dark:text-white">Notifications</span>
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold cursor-pointer">
                  Mark all read
                </span>
              </div>
              <div className="space-y-2">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80 space-y-0.5 hover:border-slate-200 dark:hover:border-slate-700 transition-colors"
                  >
                    <div className="font-semibold text-slate-900 dark:text-slate-200 text-xs">{n.title}</div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">{n.desc}</p>
                    <span className="text-[10px] text-slate-400 font-mono block mt-1">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle (Light / Dark) */}
        <ThemeToggle />
      </div>
    </header>
  );
};
