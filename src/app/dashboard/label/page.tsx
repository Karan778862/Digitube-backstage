'use client';

import React, { useState } from 'react';
import { useDigiTube } from '@/lib/store';
import { formatCurrencyINR, formatNumber } from '@/lib/utils';
import {
  Building2,
  Users2,
  Plus,
  Mail,
  CheckCircle2,
  Clock,
  Disc3,
  TrendingUp,
  Share2,
  ExternalLink,
  ShieldCheck,
  X,
} from 'lucide-react';

export default function RecordLabelPage() {
  const { labelArtists, inviteLabelArtist, releases } = useDigiTube();

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [stageName, setStageName] = useState('');
  const [legalName, setLegalName] = useState('');
  const [email, setEmail] = useState('');
  const [successInvite, setSuccessInvite] = useState(false);

  const totalLabelRevenue = labelArtists.reduce((acc, a) => acc + a.totalRevenueInr, 0);
  const totalLabelStreams = labelArtists.reduce((acc, a) => acc + a.totalStreams, 0);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stageName || !email) return;

    inviteLabelArtist(stageName, legalName || stageName, email);
    setSuccessInvite(true);
    setShowInviteModal(false);
    setStageName('');
    setLegalName('');
    setEmail('');
    setTimeout(() => setSuccessInvite(false), 4000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
            <Building2 className="w-4 h-4" />
            <span>Multi-Tenant Label Hub (Section 09 Blueprint)</span>
          </div>
          <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
            Record Label Roster & Catalog
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage your signed artist roster, custom imprint releases, and aggregated label earnings.
          </p>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm hover:shadow flex items-center gap-2 self-start sm:self-auto transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Invite Signed Artist</span>
        </button>
      </div>

      {successInvite && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-3 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div>
            <strong className="font-semibold text-emerald-900 dark:text-emerald-200">Artist Invited:</strong> Profile linkage invitation email sent. The artist can sign the digital authorization contract to join your label catalog.
          </div>
        </div>
      )}

      {/* Label KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Signed Artist Roster</span>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{labelArtists.length} Artists</div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Across Desi Beats Music imprint</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Aggregated Label Streams</span>
          <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">{formatNumber(totalLabelStreams)}</div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">+15.8% combined growth</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Total Label Distributable</span>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {formatCurrencyINR(totalLabelRevenue)}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Reconciled after distributor deduction</p>
        </div>
      </div>

      {/* Artists Roster Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Artist Roster Management</h3>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Multi-tenant access isolation active</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
              <tr>
                <th className="py-3 px-4 font-semibold">Artist Stage Name</th>
                <th className="py-3 px-4 font-semibold">Legal Contact Email</th>
                <th className="py-3 px-4 font-semibold text-center">Catalog Releases</th>
                <th className="py-3 px-4 font-semibold text-right">Total Streams</th>
                <th className="py-3 px-4 font-semibold text-right">Label Revenue</th>
                <th className="py-3 px-4 font-semibold text-right">KYC Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {labelArtists.map((artist) => (
                <tr key={artist.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60 flex items-center justify-center font-bold text-xs shrink-0">
                      {artist.stageName[0]}
                    </span>
                    <div>
                      <div>{artist.stageName}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">{artist.legalName}</div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-400">{artist.email}</td>
                  <td className="py-3.5 px-4 text-center text-slate-700 dark:text-slate-300 font-bold">
                    {artist.totalReleases}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-slate-700 dark:text-slate-200">
                    {formatNumber(artist.totalStreams)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-blue-600 dark:text-blue-400">
                    {formatCurrencyINR(artist.totalRevenueInr)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span
                      className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold ${
                        artist.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                      }`}
                    >
                      {artist.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* INVITE ARTIST MODAL */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>Invite Artist to Label Roster</span>
              </h3>
              <button onClick={() => setShowInviteModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInvite} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Artist / Stage Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Desi Hip Hop Trio"
                  value={stageName}
                  onChange={(e) => setStageName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Legal Representative Name</label>
                <input
                  type="text"
                  placeholder="e.g. Karanveer Singh"
                  value={legalName}
                  onChange={(e) => setLegalName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Artist Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="artist@music.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                <div className="font-semibold text-slate-800 dark:text-slate-200">Authorization Agreement:</div>
                <p>
                  The invited artist will receive an invitation link to digitally affirm label representation rights.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm"
                >
                  Send Roster Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
