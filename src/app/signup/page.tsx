'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDigiTube } from '@/lib/store';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  Disc3,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  AlertCircle,
  RefreshCw,
  Mail,
} from 'lucide-react';
import { UserRole } from '@/lib/types';

export default function SignupPage() {
  const router = useRouter();
  const { switchRole, loginUser } = useDigiTube();

  // Screen state: 'EMAIL_STEP' | 'VERIFY_STEP' | 'SUCCESS'
  const [step, setStep] = useState<'EMAIL_STEP' | 'VERIFY_STEP' | 'SUCCESS'>('EMAIL_STEP');

  // Input states
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [fullName, setFullName] = useState('');
  const [stageName, setStageName] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [accountType, setAccountType] = useState<'ARTIST' | 'RECORD_LABEL'>('ARTIST');
  const [showPassword, setShowPassword] = useState(false);

  // Status & feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [resendCountdown, setResendCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'VERIFY_STEP' && resendCountdown > 0) {
      timer = setInterval(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
    } else if (resendCountdown === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [step, resendCountdown]);

  // Step 1: User / Artist inputs email -> Send OTP to that email
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');

    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, purpose: 'SIGNUP' }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to send verification code.');
        setLoading(false);
        return;
      }

      setInfoMessage(data.message || `Verification code sent to ${cleanEmail}`);
      setStep('VERIFY_STEP');
      setResendCountdown(60);
      setCanResend(false);
    } catch (err: any) {
      setError(err.message || 'Unable to connect to authentication server.');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (!canResend || loading) return;
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), purpose: 'SIGNUP' }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Could not resend verification code.');
        setLoading(false);
        return;
      }

      setResendCountdown(60);
      setCanResend(false);
    } catch (err: any) {
      setError('Failed to resend code.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP & Complete Registration into MongoDB
  const handleCompleteSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!otp || otp.trim().length !== 6) {
      setError('Please enter the 6-digit verification code.');
      return;
    }
    if (!fullName.trim()) {
      setError('Please enter your full name or artist name.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      // 1. Verify OTP
      const verifyRes = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), otp: otp.trim() }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok || !verifyData.success) {
        setError(verifyData.error || 'Invalid or expired verification code.');
        setLoading(false);
        return;
      }

      // 2. Insert user into MongoDB Atlas
      const signupRes = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password,
          fullName: fullName.trim(),
          stageName: stageName.trim() || fullName.trim(),
          mobile: mobile.trim(),
          accountType,
          otp: otp.trim(),
        }),
      });

      const signupData = await signupRes.json();
      if (!signupRes.ok || !signupData.success) {
        setError(signupData.error || 'Failed to complete registration.');
        setLoading(false);
        return;
      }

      loginUser(signupData.user);
      setStep('SUCCESS');

      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Something went wrong during signup.');
    } finally {
      setLoading(false);
    }
  };

  // 1-Click Demo Shortcut
  const handleDemoLaunch = (role: UserRole) => {
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
            {step === 'EMAIL_STEP' && 'Create your account'}
            {step === 'VERIFY_STEP' && 'Check your email'}
            {step === 'SUCCESS' && 'Account verified!'}
          </h1>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {step === 'EMAIL_STEP' && 'Enter your email to receive a verification code.'}
            {step === 'VERIFY_STEP' && (
              <span>
                We sent a 6-digit code to <strong className="text-slate-700 dark:text-slate-200">{email}</strong>
              </span>
            )}
            {step === 'SUCCESS' && 'Taking you to your Backstage dashboard...'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* ================= STEP 1: ENTER EMAIL ================= */}
        {step === 'EMAIL_STEP' && (
          <div className="bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-7 shadow-xs space-y-5">
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    autoFocus
                    placeholder="artist@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1.5">
                  We will send a 6-digit verification code to this email.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Sending code...</span>
                  </>
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                Sign in
              </Link>
            </div>
          </div>
        )}

        {/* ================= STEP 2: VERIFY CODE & CREATE PROFILE ================= */}
        {step === 'VERIFY_STEP' && (
          <div className="bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-7 shadow-xs space-y-4">
            {/* Info Message when email is dispatched */}
            {infoMessage && (
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-blue-700 dark:text-blue-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-blue-600 dark:text-blue-400" />
                <span>{infoMessage}</span>
              </div>
            )}

            <form onSubmit={handleCompleteSignup} className="space-y-3.5" autoComplete="off">
              {/* 6-Digit Code */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    6-Digit Verification Code
                  </label>
                  <button
                    type="button"
                    onClick={() => setStep('EMAIL_STEP')}
                    className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    <span>Change email</span>
                  </button>
                </div>
                <input
                  type="text"
                  name="one_time_password"
                  id="digitube_otp"
                  maxLength={6}
                  required
                  autoFocus
                  autoComplete="one-time-code"
                  inputMode="numeric"
                  placeholder="------"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="w-full text-center font-mono text-xl tracking-[0.3em] font-bold py-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                />
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Full Name / Artist Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Karan Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Stage Name / Artist Alias */}
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Artist / Stage Name <span className="text-slate-400 text-[10px]">(Public Display Name)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Karan Beats (not your phone number)"
                  value={stageName}
                  onChange={(e) => setStageName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Mobile Number <span className="text-slate-400 text-[10px]">(For SMS / WhatsApp Alerts)</span>
                </label>
                <div className="relative flex rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-transparent">
                  <div className="flex items-center px-3 bg-slate-50 dark:bg-slate-800/60 border-r border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 select-none">
                    <span>🇮🇳 +91</span>
                  </div>
                  <input
                    type="tel"
                    placeholder="98997 08677"
                    maxLength={10}
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3 py-2 text-xs bg-transparent text-slate-900 dark:text-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Create Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white pr-9 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Account Type (Clean Segmented) */}
              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Account Type
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setAccountType('ARTIST')}
                    className={`py-1.5 text-xs font-medium rounded-md transition-all ${
                      accountType === 'ARTIST'
                        ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs font-semibold'
                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                  >
                    Artist / Creator
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccountType('RECORD_LABEL')}
                    className={`py-1.5 text-xs font-medium rounded-md transition-all ${
                      accountType === 'RECORD_LABEL'
                        ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs font-semibold'
                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                  >
                    Record Label
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm mt-3"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <span>Verify Code & Complete Registration</span>
                )}
              </button>

              <div className="flex items-center justify-between text-xs pt-1 text-slate-500">
                <span>Didn&apos;t get the email?</span>
                <button
                  type="button"
                  disabled={!canResend || loading}
                  onClick={handleResendOtp}
                  className={`font-semibold ${
                    canResend
                      ? 'text-blue-600 dark:text-blue-400 hover:underline cursor-pointer'
                      : 'text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {canResend ? 'Resend code' : `Resend in ${resendCountdown}s`}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================= STEP 3: SUCCESS ================= */}
        {step === 'SUCCESS' && (
          <div className="bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center space-y-4 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Account Created Successfully
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Welcome to DigiTube Backstage, <strong className="text-slate-700 dark:text-slate-200">{stageName || fullName}</strong>.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/dashboard"
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Enter Backstage Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Subtle 1-Click Demo Shortcut */}
        <div className="text-center mt-6 text-xs text-slate-400 dark:text-slate-500">
          Just exploring?{' '}
          <button
            type="button"
            onClick={() => handleDemoLaunch('ARTIST')}
            className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-semibold underline"
          >
            Launch instant demo
          </button>
        </div>
      </div>
    </div>
  );
}
