'use client';

import React from 'react';
import Link from 'next/link';
import {
  Disc3,
  ShieldCheck,
  Globe,
  Instagram,
  Youtube,
  Facebook,
  Twitter,
  Linkedin,
  MessageCircle,
  Mail,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Lock,
  Headphones,
  Zap,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const socialLinks = [
    {
      name: 'Instagram',
      href: 'https://instagram.com/digitubenetwork',
      icon: Instagram,
      hoverClass: 'hover:text-[#E4405F] hover:border-[#E4405F]/40 hover:bg-[#E4405F]/10',
      tooltip: 'Follow @digitubenetwork on Instagram',
    },
    {
      name: 'YouTube',
      href: 'https://youtube.com/@digitubenetwork',
      icon: Youtube,
      hoverClass: 'hover:text-[#FF0000] hover:border-[#FF0000]/40 hover:bg-[#FF0000]/10',
      tooltip: 'Subscribe to DigiTube Network on YouTube',
    },
    {
      name: 'Facebook',
      href: 'https://facebook.com/digitubenetwork',
      icon: Facebook,
      hoverClass: 'hover:text-[#1877F2] hover:border-[#1877F2]/40 hover:bg-[#1877F2]/10',
      tooltip: 'Connect on Facebook',
    },
    {
      name: 'X / Twitter',
      href: 'https://x.com/digitubenetwork',
      icon: Twitter,
      hoverClass: 'hover:text-slate-900 dark:hover:text-white hover:border-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50',
      tooltip: 'Follow @digitubenetwork on X',
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com/company/digitubenetwork',
      icon: Linkedin,
      hoverClass: 'hover:text-[#0A66C2] hover:border-[#0A66C2]/40 hover:bg-[#0A66C2]/10',
      tooltip: 'Official Company LinkedIn',
    },
    {
      name: 'WhatsApp Support',
      href: 'https://wa.me/919899708677?text=Hi%20DigiTube%20Team%2C%20I%20need%20assistance%20with%20Music%20Distribution',
      icon: MessageCircle,
      hoverClass: 'hover:text-[#25D366] hover:border-[#25D366]/40 hover:bg-[#25D366]/10',
      tooltip: 'Direct WhatsApp Artist Desk (+91)',
    },
  ];

  return (
    <footer className="bg-slate-50 dark:bg-[#060911] border-t border-slate-200 dark:border-slate-800/80 text-slate-600 dark:text-slate-400 text-xs transition-colors relative overflow-hidden">
      {/* Top Banner: Direct Connect & System Status */}
      <div className="bg-white/80 dark:bg-[#090d18]/80 border-b border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              DigiTube DDEX Distribution Grid:
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono">
              All 150+ Ingestion Gateways Operational
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <a
              href="mailto:support@digitubenetwork.com"
              className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-blue-500" />
              <span>support@digitubenetwork.com</span>
            </a>
            <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
            <a
              href="https://wa.me/919899708677?text=Hi%20DigiTube%20Team%2C%20I%20need%20assistance%20with%20Music%20Distribution"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 font-semibold hover:bg-emerald-100 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Helpdesk (+91)</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main 5-Column Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Col - 2 Columns wide */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-500 flex items-center justify-center shadow-md shadow-blue-500/20 text-white group-hover:scale-105 transition-transform">
                <Disc3 className="w-5 h-5" />
              </div>
              <div>
                <div className="font-display font-black text-lg tracking-tight text-slate-900 dark:text-white leading-tight">
                  DigiTube <span className="text-blue-600 dark:text-blue-400">Network</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">
                  Enterprise Distribution
                </div>
              </div>
            </Link>

            <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed max-w-sm">
              India&apos;s premier high-throughput music distribution network and copyright administration platform. Direct automated DDEX delivery to Spotify, Apple Music, YouTube Content ID, JioSaavn, and 150+ digital streaming services.
            </p>

            {/* Certifications and Badges */}
            <div className="space-y-2 pt-1 text-xs">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>DDEX ERN 3.8 / 4.2 Automated Ingestion</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                <Globe className="w-4 h-4 text-blue-500 shrink-0" />
                <span>150+ Global DSP Stores & Terrestrial Coverage</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                <Lock className="w-4 h-4 text-purple-500 shrink-0" />
                <span>Double-Entry Ledger & Indian Banking Settlements</span>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="pt-2">
              <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2.5">
                Connect With DigiTube
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {socialLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={item.tooltip}
                      aria-label={item.name}
                      className={`w-8 h-8 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center transition-all shadow-xs ${item.hoverClass}`}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Col 2: Release & Catalog Wizard */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Headphones className="w-3.5 h-3.5 text-blue-500" />
              <span>Catalog Engine</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li>
                <Link href="/dashboard/releases/new" className="hover:text-blue-600 dark:hover:text-white transition-colors">
                  9-Step Release Wizard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/releases" className="hover:text-blue-600 dark:hover:text-white transition-colors">
                  Catalog & Audio Assets
                </Link>
              </li>
              <li>
                <Link href="/dashboard/label" className="hover:text-blue-600 dark:hover:text-white transition-colors">
                  Record Label Multi-Artist
                </Link>
              </li>
              <li>
                <Link href="/dashboard/releases/new" className="hover:text-blue-600 dark:hover:text-white transition-colors">
                  YouTube Content ID Ingestion
                </Link>
              </li>
              <li>
                <Link href="/dashboard/marketing" className="hover:text-blue-600 dark:hover:text-white transition-colors">
                  Smart Links & Pre-Save Bio
                </Link>
              </li>
              <li>
                <Link href="/dashboard/releases/new" className="hover:text-blue-600 dark:hover:text-white transition-colors">
                  Auto ISRC & UPC Generator
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Financial & Royalty Accounting */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-emerald-500" />
              <span>Royalties & Banking</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li>
                <Link href="/dashboard/royalties" className="hover:text-blue-600 dark:hover:text-white transition-colors">
                  Double-Entry Royalty Ledger
                </Link>
              </li>
              <li>
                <Link href="/dashboard/royalties" className="hover:text-blue-600 dark:hover:text-white transition-colors">
                  Automated Splitsheets (Split Pay)
                </Link>
              </li>
              <li>
                <Link href="/dashboard/wallet" className="hover:text-blue-600 dark:hover:text-white transition-colors">
                  NEFT / RTGS Bank Transfer
                </Link>
              </li>
              <li>
                <Link href="/dashboard/wallet" className="hover:text-blue-600 dark:hover:text-white transition-colors">
                  Instant UPI Direct Payouts
                </Link>
              </li>
              <li>
                <Link href="/dashboard/royalties" className="hover:text-blue-600 dark:hover:text-white transition-colors">
                  Monthly DSP Royalty Statements
                </Link>
              </li>
              <li>
                <Link href="/dashboard/wallet" className="hover:text-blue-600 dark:hover:text-white transition-colors">
                  Tax Invoicing & TDS/GST Reports
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Connected DSP Stores */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-indigo-500" />
              <span>Connected DSPs</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954]" />
                <span>Spotify & Spotify for Artists</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FC3C44]" />
                <span>Apple Music & iTunes</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF0000]" />
                <span>YouTube Music & Content ID</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2BC5B4]" />
                <span>JioSaavn & Wynk Music</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00A8E1]" />
                <span>Amazon Music & Alexa</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0668E1]" />
                <span>Instagram & Facebook Reels</span>
              </li>
            </ul>
          </div>

          {/* Col 5: Legal & Operations */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
              <span>Compliance & Help</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li>
                <Link href="/dashboard/settings" className="hover:text-blue-600 dark:hover:text-white transition-colors">
                  Distribution Agreement & Terms
                </Link>
              </li>
              <li>
                <Link href="/dashboard/settings" className="hover:text-blue-600 dark:hover:text-white transition-colors">
                  Anti-Fraud & Artificial Stream Policy
                </Link>
              </li>
              <li>
                <Link href="/dashboard/settings" className="hover:text-blue-600 dark:hover:text-white transition-colors">
                  DMCA Copyright Protection
                </Link>
              </li>
              <li>
                <Link href="/dashboard/support" className="hover:text-blue-600 dark:hover:text-white transition-colors">
                  Artist Support Helpdesk
                </Link>
              </li>
              <li>
                <Link href="/dashboard/settings" className="hover:text-blue-600 dark:hover:text-white transition-colors">
                  Two-Factor MFA Security
                </Link>
              </li>
              <li className="pt-1">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 font-semibold hover:bg-amber-100 transition-colors"
                >
                  <Lock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                  <span>Super Admin Portal &rarr;</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal Copyright & Headquarters */}
        <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800/80 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-500 gap-4">
          <div className="space-y-0.5 text-center md:text-left">
            <div>
              © {new Date().getFullYear()} DigiTube Network Private Limited. All rights reserved.
            </div>
            <div className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
              Registered Office: Mumbai, Maharashtra 400053 • India | Ingestion Hub ID: DGT-IND-DDEX-01
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-400">
            <Link href="/dashboard/settings" className="hover:text-blue-600 dark:hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/dashboard/settings" className="hover:text-blue-600 dark:hover:text-white transition-colors">
              Terms of Distribution
            </Link>
            <span>•</span>
            <Link href="/dashboard/settings" className="hover:text-blue-600 dark:hover:text-white transition-colors">
              Copyright DMCA
            </Link>
            <span>•</span>
            <Link href="/dashboard/settings" className="hover:text-blue-600 dark:hover:text-white transition-colors">
              Security Architecture
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
