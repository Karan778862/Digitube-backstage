'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Disc3, ArrowRight, Menu, X, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#090d16]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm group-hover:bg-blue-700 transition-colors">
            <Disc3 className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-display font-bold text-base tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>DigiTube</span>
              <span className="text-[9px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/60">
                Backstage
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium leading-none mt-0.5">
              Music Distribution & Royalty Platform
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-slate-600 dark:text-slate-300">
          <a href="#services" className="hover:text-blue-600 dark:hover:text-white transition-colors">
            Services
          </a>
          <a href="#dsp-partners" className="hover:text-blue-600 dark:hover:text-white transition-colors">
            150+ Stores
          </a>
          <a href="#royalties" className="hover:text-blue-600 dark:hover:text-white transition-colors">
            Royalty Ledger
          </a>
          <a href="#plans" className="hover:text-blue-600 dark:hover:text-white transition-colors">
            Pricing Plans
          </a>
          <Link
            href="/dashboard"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Demo</span>
          </Link>
        </nav>

        {/* Action Buttons & Theme Switcher */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />

          <Link
            href="/login"
            className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white px-3 py-2 transition-colors"
          >
            Sign In
          </Link>

          <Link
            href="/dashboard"
            className="btn-primary inline-flex items-center gap-1.5 px-4 py-2 text-xs"
          >
            <span>Open Backstage</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-5 space-y-3 text-xs font-medium text-slate-700 dark:text-slate-300 shadow-xl">
          <a
            href="#services"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1 hover:text-blue-600 dark:hover:text-white"
          >
            Services
          </a>
          <a
            href="#dsp-partners"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1 hover:text-blue-600 dark:hover:text-white"
          >
            150+ Stores
          </a>
          <a
            href="#royalties"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1 hover:text-blue-600 dark:hover:text-white"
          >
            Royalty Ledger
          </a>
          <a
            href="#plans"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1 hover:text-blue-600 dark:hover:text-white"
          >
            Pricing Plans
          </a>
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-center text-slate-700 dark:text-slate-300 font-semibold"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-primary py-2.5 text-center text-xs"
            >
              Open Backstage Dashboard
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
