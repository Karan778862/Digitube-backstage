'use client';

import React, { useState, useEffect } from 'react';
import { useDigiTube } from '@/lib/store';
import { formatDate } from '@/lib/utils';
import {
  Users,
  ShieldCheck,
  Plus,
  Lock,
  Key,
  CheckCircle2,
  AlertCircle,
  X,
  Mail,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Sparkles,
  Info,
} from 'lucide-react';
import { UserRole } from '@/lib/types';

interface StaffUserItem {
  id: string;
  fullName: string;
  email: string;
  role: string;
  assignedScope: string;
  permissions: string[];
  isActive: boolean;
  mfaEnabled: boolean;
  createdAt: string;
}

export default function AdminStaffPage() {
  const { currentUser } = useDigiTube();

  const [staffList, setStaffList] = useState<StaffUserItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>('RELEASE_MANAGER');
  const [scope, setScope] = useState<'ALL' | 'ASSIGNED_ARTISTS' | 'FINANCE_ONLY' | 'QA_ONLY'>('QA_ONLY');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Created Credentials Display Modal
  const [createdCredentials, setCreatedCredentials] = useState<{
    fullName: string;
    email: string;
    password: string;
    role: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  // Load staff from API
  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/staff');
      const data = await res.json();
      if (data.success && Array.isArray(data.staff)) {
        setStaffList(data.staff);
      }
    } catch (err) {
      console.error('Failed to fetch staff:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const generateStrongPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*';
    let pwd = '';
    for (let i = 0; i < 10; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(`DGT#${pwd}`);
  };

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim() || !email.trim() || !password) {
      setErrorMessage('Please fill in all fields (Full Name, Email, Password).');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          password,
          role,
          assignedScope: scope,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMessage(data.error || 'Failed to create staff account.');
        setSubmitting(false);
        return;
      }

      // Success
      setCreatedCredentials({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        role,
      });

      setShowModal(false);
      setFullName('');
      setEmail('');
      setPassword('');
      fetchStaff();
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteStaff = async (staffEmail: string) => {
    if (staffEmail === currentUser.email) {
      alert('You cannot delete your own active Super Admin account.');
      return;
    }

    if (!confirm(`Are you sure you want to revoke access for ${staffEmail}?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/staff?email=${encodeURIComponent(staffEmail)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        fetchStaff();
      }
    } catch (err) {
      console.error('Failed to delete staff:', err);
    }
  };

  const copyCredentials = () => {
    if (!createdCredentials) return;
    const text = `DigiTube Staff Login Credentials:\nURL: ${window.location.origin}/login\nEmail: ${createdCredentials.email}\nPassword: ${createdCredentials.password}\nRole: ${createdCredentials.role}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">
            <Users className="w-4 h-4" />
            <span>Staff Administration & Login Credentials Hub</span>
          </div>
          <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
            Staff Accounts & Access Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Create real employee accounts with Login Email & Password. Staff log in at /login and access privileged moderation tools.
          </p>
        </div>

        <button
          onClick={() => {
            setShowModal(true);
            generateStrongPassword();
          }}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm flex items-center gap-2 self-start sm:self-auto transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create Staff Account</span>
        </button>
      </div>

      {/* Explanatory Guide Box */}
      <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 flex items-start gap-3 text-xs text-blue-900 dark:text-blue-300">
        <Info className="w-5 h-5 shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold">How Staff Login Works:</div>
          <div className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
            1. Super Admin clicks <strong>&quot;+ Create Staff Account&quot;</strong>, enters staff&apos;s <strong>Name</strong>, <strong>Email (Login ID)</strong>, and <strong>Password</strong>.<br />
            2. The system generates login credentials which you can copy and share via WhatsApp or Email.<br />
            3. Staff member goes to the standard <strong>/login</strong> page, enters their email & password.<br />
            4. The system automatically detects their staff role and routes them directly to the <strong>Super Admin Desk (/admin)</strong> with their permitted tools.
          </div>
        </div>
      </div>

      {/* Staff Roster Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Administrative Staff ({staffList.length})</h3>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-medium">Role-Based Access Enforced</span>
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs text-slate-400">Loading staff accounts...</div>
        ) : staffList.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400 space-y-2">
            <div>No additional staff accounts created yet.</div>
            <button
              onClick={() => {
                setShowModal(true);
                generateStrongPassword();
              }}
              className="text-amber-600 dark:text-amber-400 font-bold hover:underline"
            >
              + Create your first staff member
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
                <tr>
                  <th className="py-3 px-4 font-semibold">Staff Member</th>
                  <th className="py-3 px-4 font-semibold">Assigned Role</th>
                  <th className="py-3 px-4 font-semibold">Scope</th>
                  <th className="py-3 px-4 font-semibold">Security</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {staffList.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">{s.fullName}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{s.email}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-amber-700 dark:text-amber-400 font-semibold">
                      {s.role.replace(/_/g, ' ')}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                        {s.assignedScope}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                      <ShieldCheck className="w-4 h-4" /> Password + Auth
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 font-semibold">
                        Active
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {s.email !== currentUser.email && (
                        <button
                          onClick={() => handleDeleteStaff(s.email)}
                          title="Revoke access"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE STAFF MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-amber-500/40 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-500" />
                <span>Create New Staff Account</span>
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleCreateStaff} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Staff Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                  Staff Email <span className="text-slate-400 font-normal">(Login ID)</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. rahul.staff@digitubenetwork.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-700 dark:text-slate-300 font-medium">Initial Password</label>
                  <button
                    type="button"
                    onClick={generateStrongPassword}
                    className="text-[11px] text-amber-600 dark:text-amber-400 font-bold hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" /> Auto-Generate
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 pr-10 text-slate-900 dark:text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Role Template</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="RELEASE_MANAGER">Release QA Manager (Inspects & Approves Songs)</option>
                  <option value="CATALOG_STAFF">Catalog Specialist (Metadata & ISRC)</option>
                  <option value="ACCOUNTS_STAFF">Royalty Accounts Staff (Payouts & Ledgers)</option>
                  <option value="SUPPORT_STAFF">Support Desk Agent (Tickets & Disputes)</option>
                  <option value="SUPER_ADMIN">Co-Super Admin (Full Platform Control)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Scope Restrictions</label>
                <select
                  value={scope}
                  onChange={(e) => setScope(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="QA_ONLY">QA Only Scope</option>
                  <option value="FINANCE_ONLY">Finance & Royalty Only</option>
                  <option value="ASSIGNED_ARTISTS">Assigned Artists Only</option>
                  <option value="ALL">All Platform Catalog</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs shadow-sm transition-all disabled:opacity-50"
                >
                  {submitting ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREDENTIALS SHARE DIALOG */}
      {createdCredentials && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-emerald-500/40 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-fade-in text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Staff Account Created!</h3>
                <p className="text-slate-500 text-[11px]">Share these credentials with your team member.</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2.5 font-mono">
              <div>
                <span className="text-slate-400 text-[10px] uppercase block">Login Portal URL</span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">{typeof window !== 'undefined' ? `${window.location.origin}/login` : '/login'}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase block">Staff Member</span>
                <span className="text-slate-900 dark:text-white font-bold">{createdCredentials.fullName}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase block">Login Email (User ID)</span>
                <span className="text-slate-900 dark:text-white font-bold">{createdCredentials.email}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase block">Initial Password</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                  {createdCredentials.password}
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase block">Assigned Role</span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">{createdCredentials.role}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={copyCredentials}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-sm transition-all"
              >
                {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Credentials'}</span>
              </button>

              <button
                onClick={() => setCreatedCredentials(null)}
                className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl font-bold transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
