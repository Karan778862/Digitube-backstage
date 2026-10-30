'use client';

import React from 'react';
import Link from 'next/link';
import { Disc3, ShieldCheck, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-[#0b0f19] border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-600/20">
                <Disc3 className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-black text-lg text-slate-900 dark:text-white">
                DigiTube <span className="text-blue-600 dark:text-blue-400">Network</span>
              </span>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed max-w-sm">
              Enterprise music distribution platform, automated DDEX ingestion, and auditable royalty accounting ledger. Engineered with Believe Backstage architectural standards.
            </p>
            <div className="flex items-center gap-3 pt-1 text-xs text-slate-500">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" /> DDEX ERN 3.8 / 4.2 Compliant
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium">
                <Globe className="w-3.5 h-3.5" /> 150+ Territories
              </span>
            </div>
          </div>

          {/* Solutions */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Features</h4>
            <ul className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
              <li><Link href="/dashboard/releases/new" className="hover:text-blue-600 dark:hover:text-white transition-colors">9-Step Release Wizard</Link></li>
              <li><Link href="/dashboard/label" className="hover:text-blue-600 dark:hover:text-white transition-colors">Record Label Multi-Artist</Link></li>
              <li><Link href="/dashboard/royalties" className="hover:text-blue-600 dark:hover:text-white transition-colors">Royalty Ledger & Splits</Link></li>
              <li><Link href="/dashboard/wallet" className="hover:text-blue-600 dark:hover:text-white transition-colors">Instant Payouts & Reserves</Link></li>
              <li><Link href="/dashboard/marketing" className="hover:text-blue-600 dark:hover:text-white transition-colors">Smart Music Links & Pre-Save</Link></li>
            </ul>
          </div>

          {/* Connected Stores */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Connected DSPs</h4>
            <ul className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
              <li><span>Spotify & Spotify for Artists</span></li>
              <li><span>Apple Music & iTunes</span></li>
              <li><span>YouTube Music & Content ID</span></li>
              <li><span>JioSaavn & Wynk Music</span></li>
              <li><span>Amazon Music & Alexa</span></li>
              <li><span>Instagram, Facebook & TikTok</span></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Compliance</h4>
            <ul className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
              <li><Link href="/dashboard/settings" className="hover:text-blue-600 dark:hover:text-white transition-colors">Distribution Terms & Contract</Link></li>
              <li><span>Anti-Fraud & Bot Stream Policy</span></li>
              <li><span>Copyright & Content ID Eligibility</span></li>
              <li><span>KYC/KYB Verification</span></li>
              <li><Link href="/admin" className="text-amber-600 dark:text-amber-400 font-semibold hover:underline">Super Admin Portal &rarr;</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div>
            © {new Date().getFullYear()} DigiTube Network. All rights reserved.
          </div>
          <div className="flex items-center gap-5">
            <span className="hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer">Security & MFA</span>
            <span className="hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer">API Docs</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
