'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDigiTube } from '@/lib/store';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  Disc3,
  ArrowRight,
  Lock,
  Mail,
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';
import { UserRole } from '@/lib/types';

export default function LoginPage() {
  const router = useRouter();
  const { switchRole, loginUser } = useDigiTube();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMessage(data.error || 'Authentication failed. Please check credentials.');
        setLoading(false);
        return;
      }

      loginUser(data.user);
      setSuccessMessage(`Welcome back, ${data.user.stageName || data.user.fullName}!`);
      const adminRoles = [
        'SUPER_ADMIN',
        'COMPANY_ADMIN',
        'RELEASE_MANAGER',
        'CATALOG_STAFF',
        'ACCOUNTS_STAFF',
        'SUPPORT_STAFF',
      ];

      const searchParams = new URLSearchParams(window.location.search);
      const redirectUrl = searchParams.get('redirect');

      setTimeout(() => {
        if (redirectUrl && redirectUrl.startsWith('/')) {
          router.push(redirectUrl);
        } else if (adminRoles.includes(data.user.role)) {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      }, 500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to connect to authentication server.');
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    switchRole(role);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080c14] flex flex-col justify-center py-12 px-4 sm:px-6 relative text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Controls */}
      <div className="absolute top-5 right-5">
        <ThemeToggle />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-[400px]">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <Disc3 className="w-4 h-4" />
            </div>
            <span className="font-display font-bold text-xl text-slate-900 dark:text-white">
              DigiTube Backstage
            </span>
          </Link>
          <h1 className="text-2xl font-display font-bold tracking-tight text-slate-900 dark:text-white">
            Sign in to your account
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Access your music catalog, royalties, and DDEX analytics.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Clean Login Card */}
        <div className="bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-7 shadow-xs space-y-4">
          <form className="space-y-4" onSubmit={handleSignIn}>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  placeholder="artist@example.com"
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm mt-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
              Create account with Email OTP
            </Link>
          </div>
        </div>

        {/* Clean, Discreet Demo Showcase Shortcut */}
        <div className="text-center mt-6 text-xs text-slate-400 dark:text-slate-500 space-y-1.5">
          <div>Just exploring without an account?</div>
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('ARTIST')}
              className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium underline"
            >
              Artist Demo
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('RECORD_LABEL')}
              className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium underline"
            >
              Label Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
