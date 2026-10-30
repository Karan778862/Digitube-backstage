'use client';

import React, { useState } from 'react';
import { useDigiTube } from '@/lib/store';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  ShieldCheck,
  Lock,
  FileCheck,
  Bell,
  Smartphone,
  Key,
  CheckCircle2,
  ExternalLink,
  User,
  Sun,
  Moon,
  Laptop,
} from 'lucide-react';

export default function SettingsPage() {
  const { currentUser } = useDigiTube();

  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [statementAlerts, setStatementAlerts] = useState(true);
  const [payoutAlerts, setPayoutAlerts] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
          Account Settings & Security
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Manage your artist identity, theme appearance (Light, Dark, Auto Day/Night), MFA security, and signed distribution contracts.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="font-medium">Security settings and preferences updated successfully.</span>
        </div>
      )}

      {/* Theme & Display Appearance (Section User Request) */}
      <div className="card-executive p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Interface Theme & Appearance</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Choose Light Mode, Dark Mode, or Automatic System Sync (adapts smoothly to day & night).
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-900 dark:text-white">Backstage Color Theme</span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Select your preferred visual style or let DigiTube automatically sync with your device time and ambient mode.
            </p>
          </div>

          <ThemeToggle variant="segmented" />
        </div>
      </div>

      {/* Contract & Legal Agreement Viewer */}
      <div className="card-executive p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Music Distribution Agreement</h3>
          </div>
          <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60 font-semibold">
            Digitally Signed & Legally Binding
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-slate-500 dark:text-slate-400 block">Contract Reference:</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">AGR-2026-IND-01</span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 block">Commission Model:</span>
            <span className="text-slate-900 dark:text-white font-semibold">15% DigiTube / 85% Artist</span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 block">Signed Timestamp:</span>
            <span className="text-slate-900 dark:text-white">15 Oct 2026 14:22:10 IST</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
          Master rights holder grants DigiTube Network authorized digital ingestion authority for 150+ international DSPs. Artist retains 100% intellectual property, publishing, and master recording ownership.
        </div>
      </div>

      {/* MFA & Account Security (Section 19) */}
      <div className="card-executive p-6 space-y-4 shadow-xs">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Two-Factor Authentication (MFA) & Sessions</h3>
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-slate-900 dark:text-white">Multi-Factor Authentication (TOTP / OTP)</div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Enforce mandatory authentication codes for financial payouts and contract modifications.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setMfaEnabled(!mfaEnabled)}
            className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
              mfaEnabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full bg-white transition-transform shadow-sm ${
                mfaEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="space-y-2 pt-2">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Active Device Sessions:</span>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">Current Session: macOS Chrome 130</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">IP: 103.21.244.18 • Mumbai, India</div>
            </div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-semibold">Active Now</span>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="card-executive p-6 space-y-4 shadow-xs">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Email & System Alerts</h3>
        </div>

        <div className="space-y-3 text-xs">
          <label className="flex items-center justify-between cursor-pointer p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors">
            <span className="text-slate-700 dark:text-slate-300">Release Status Updates (Live store confirmations, QA changes)</span>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-0"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors">
            <span className="text-slate-700 dark:text-slate-300">Monthly Royalty Statement Publishing Notices</span>
            <input
              type="checkbox"
              checked={statementAlerts}
              onChange={(e) => setStatementAlerts(e.target.checked)}
              className="rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-0"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors">
            <span className="text-slate-700 dark:text-slate-300">Bank Payout Settlement Receipts</span>
            <input
              type="checkbox"
              checked={payoutAlerts}
              onChange={(e) => setPayoutAlerts(e.target.checked)}
              className="rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-0"
            />
          </label>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleSave}
            className="btn-primary px-5 py-2 text-xs"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
