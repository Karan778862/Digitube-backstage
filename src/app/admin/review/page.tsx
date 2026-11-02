'use client';

import React, { useState, useEffect } from 'react';
import { useDigiTube } from '@/lib/store';
import { ReleaseItem, TrackItem } from '@/lib/types';
import { StatusBadge } from '@/components/StatusBadge';
import { formatDuration } from '@/lib/utils';
import {
  ClipboardCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Play,
  ShieldCheck,
  FileAudio,
  Eye,
  Send,
  X,
  FileCheck,
  RefreshCw,
  SlidersHorizontal,
  Music,
  Users,
  PieChart,
  Globe,
  Radio,
  FileText,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function AdminReviewPage() {
  const { releases: contextReleases, updateReleaseStatus, playAudioTrack } = useDigiTube();

  const [activeReleases, setActiveReleases] = useState<ReleaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRel, setSelectedRel] = useState<ReleaseItem | null>(null);
  const [selectedDetailRel, setSelectedDetailRel] = useState<ReleaseItem | null>(null);
  const [showChangesModal, setShowChangesModal] = useState(false);
  const [changesNotes, setChangesNotes] = useState(
    'Please attach written sample clearance license for track 1. Also update the composer credit to match the IPI database.'
  );
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'PENDING' | 'APPROVED' | 'ALL'>('PENDING');

  // Multi-tier fetcher: merges server API data + local submitted storage
  const syncReleases = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/releases?all=true', {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
      });
      const data = await res.json();
      let combined: ReleaseItem[] = Array.isArray(data?.releases) ? data.releases.filter(Boolean) : [];

      // Merge with browser-wide submitted releases in localStorage
      try {
        const local = JSON.parse(localStorage.getItem('digitube_all_submitted_releases') || '[]');
        if (Array.isArray(local) && local.length > 0) {
          const serverMap = new Map(combined.filter((r) => r && r.id).map((r) => [r.id, r]));
          for (const item of local) {
            if (item && item.id) {
              if (!serverMap.has(item.id)) {
                combined.unshift(item);
                serverMap.set(item.id, item);
              } else {
                const existing = serverMap.get(item.id)!;
                if (item.artworkUrl && (!existing.artworkUrl || existing.artworkUrl.includes('unsplash'))) {
                  existing.artworkUrl = item.artworkUrl;
                }
                if (Array.isArray(item.tracks) && item.tracks.length > 0) {
                  existing.tracks = item.tracks;
                }
              }
            }
          }
        }
      } catch {}

      // Fallback merge with context releases if any
      if (contextReleases && contextReleases.length > 0) {
        const currentMap = new Map(combined.filter((r) => r && r.id).map((r) => [r.id, r]));
        for (const r of contextReleases) {
          if (r && r.id && !currentMap.has(r.id)) {
            combined.unshift(r);
            currentMap.set(r.id, r);
          }
        }
      }

      setActiveReleases(combined.filter(Boolean));
    } catch (err) {
      console.warn('Admin review sync notice:', err);
      if (contextReleases && contextReleases.length > 0) {
        setActiveReleases(contextReleases.filter(Boolean));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    syncReleases();
  }, []);

  // Filter releases based on active tab
  const pendingQueue = activeReleases.filter(
    (r) =>
      r &&
      (r.status === 'IN_REVIEW' ||
        r.status === 'SUBMITTED' ||
        r.status === 'VALIDATION' ||
        r.status === 'CHANGES_REQUIRED')
  );

  const approvedList = activeReleases.filter(
    (r) => r && (r.status === 'APPROVED' || r.status === 'LIVE')
  );

  const displayedList = (
    activeTab === 'PENDING'
      ? pendingQueue
      : activeTab === 'APPROVED'
      ? approvedList
      : activeReleases
  ).filter(Boolean);

  const persistStatusChange = (id: string, status: ReleaseItem['status'], notes?: string) => {
    // 1. Update component state
    setActiveReleases((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status, reviewNotes: notes || r.reviewNotes } : r))
    );

    // If modal is open, update selectedDetailRel too
    if (selectedDetailRel && selectedDetailRel.id === id) {
      setSelectedDetailRel((prev) => (prev ? { ...prev, status, reviewNotes: notes || prev.reviewNotes } : null));
    }

    // 2. Update context state
    updateReleaseStatus(id, status, notes);

    // 3. Update localStorage
    try {
      const local = JSON.parse(localStorage.getItem('digitube_all_submitted_releases') || '[]');
      if (Array.isArray(local)) {
        const updated = local.map((r: any) =>
          r.id === id ? { ...r, status, reviewNotes: notes || r.reviewNotes } : r
        );
        localStorage.setItem('digitube_all_submitted_releases', JSON.stringify(updated));
      }
    } catch {}

    // 4. Update API
    fetch('/api/releases', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status, reviewNotes: notes }),
    }).catch(() => {});
  };

  const handleApprove = (rel: ReleaseItem) => {
    persistStatusChange(
      rel.id,
      'APPROVED',
      'Quality assurance passed. Release approved and queued for distribution delivery.'
    );
    setActionNotice(`Release ${rel.releaseCode} approved! Queued for DigiTube DDEX delivery.`);
    setSelectedRel(null);
    setTimeout(() => setActionNotice(null), 5000);
  };

  const handleRequestChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRel || !changesNotes) return;

    persistStatusChange(selectedRel.id, 'CHANGES_REQUIRED', changesNotes);
    setActionNotice(`Changes requested for ${selectedRel.releaseCode}. Artist notified.`);
    setShowChangesModal(false);
    setSelectedRel(null);
    setTimeout(() => setActionNotice(null), 5000);
  };

  const handleReject = (rel: ReleaseItem) => {
    const reason = prompt(
      `Enter rejection reason for ${rel.releaseCode}:`,
      'Copyright compliance violation / uncleared third-party samples.'
    );
    if (!reason) return;

    persistStatusChange(rel.id, 'REJECTED', reason);
    setActionNotice(`Release ${rel.releaseCode} rejected.`);
    setTimeout(() => setActionNotice(null), 5000);
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      {/* Header */}
      <div className="pb-3 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">
            <ClipboardCheck className="w-4 h-4" />
            <span>Staff Quality Review Desk (Section 06 & 07)</span>
          </div>
          <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
            Release Ingestion & QA Queue
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Inspect master recordings, verify artwork compliance, check IPI/ISRC identifiers, and authorize DSP delivery.
          </p>
        </div>

        <button
          onClick={syncReleases}
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs font-semibold flex items-center gap-2 self-start md:self-auto border border-slate-200 dark:border-slate-700 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-600' : ''}`} />
          <span>{loading ? 'Syncing Queue...' : 'Refresh Queue'}</span>
        </button>
      </div>

      {actionNotice && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-300 text-xs flex items-center gap-3 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
          <span className="font-medium">{actionNotice}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('PENDING')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'PENDING'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>Needs Review</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-950/20 text-current font-mono">
            {pendingQueue.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('APPROVED')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'APPROVED'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>Approved / Live</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 text-current font-mono">
            {approvedList.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'ALL'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>All Releases</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 dark:bg-slate-700 text-current font-mono">
            {activeReleases.length}
          </span>
        </button>
      </div>

      {/* Review Queue Cards */}
      <div className="space-y-4">
        {displayedList.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200">
              {activeTab === 'PENDING'
                ? 'Quality Review Queue is Clear!'
                : 'No releases found in this category'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {activeTab === 'PENDING'
                ? 'All submitted music releases have been inspected and authorized for distribution.'
                : 'Releases will show here once ingested into DigiTube Network.'}
            </p>
          </div>
        ) : (
          displayedList.map((rel) => {
            const firstTrack = (rel.tracks && rel.tracks[0]) || {
              id: 'trk_fallback',
              trackNumber: 1,
              title: rel.title,
              audioMasterUrl: '',
              audioFormat: 'WAV',
              audioBitrate: '24-bit/48kHz',
              durationSeconds: 218,
            };

            const artwork =
              rel.artworkUrl ||
              'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80';

            return (
              <div
                key={rel.id}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500/40 shadow-sm transition-all space-y-5"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 shadow-sm bg-slate-900">
                      <img src={artwork} alt={rel.title} className="w-full h-full object-cover" />
                      <button
                        onClick={() =>
                          playAudioTrack(
                            firstTrack as any,
                            rel.title,
                            rel.artistStageName,
                            artwork
                          )
                        }
                        className="absolute inset-0 bg-black/40 hover:bg-black/60 flex items-center justify-center text-white transition-opacity"
                        title="Listen to Studio Master Preview"
                      >
                        <Play className="w-7 h-7 fill-white" />
                      </button>
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded font-semibold border border-amber-200 dark:border-amber-800/60">
                          {rel.releaseCode}
                        </span>
                        <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                          UPC: {rel.upcEan || 'Auto-Allocated'}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400">
                          {rel.releaseType}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white truncate flex items-center gap-2">
                        {rel.title}
                        {rel.versionSubtitle && (
                          <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                            ({rel.versionSubtitle})
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        Artist: <strong className="text-slate-900 dark:text-slate-200">{rel.artistStageName}</strong> • {rel.primaryGenre} • Target Live Date: {rel.targetReleaseDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-auto flex-wrap">
                    <StatusBadge status={rel.status} />

                    {/* Inspect Full Details Button */}
                    <button
                      onClick={() => setSelectedDetailRel(rel)}
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs font-bold transition-colors flex items-center gap-1.5"
                      title="Inspect All Metadata & Files"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span>Inspect Details</span>
                    </button>

                    <button
                      onClick={() =>
                        playAudioTrack(
                          firstTrack as any,
                          rel.title,
                          rel.artistStageName,
                          artwork
                        )
                      }
                      className="px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 text-xs font-semibold transition-colors flex items-center gap-1.5"
                      title="Play master audio preview"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Preview Song</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedRel(rel);
                        setShowChangesModal(true);
                      }}
                      className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:border-amber-300 dark:hover:border-amber-500/40 border border-slate-200 dark:border-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Request Changes</span>
                    </button>

                    <button
                      onClick={() => handleReject(rel)}
                      className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:border-rose-300 dark:hover:border-rose-500/40 border border-slate-200 dark:border-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>

                    {rel.status !== 'APPROVED' && rel.status !== 'LIVE' && (
                      <button
                        onClick={() => handleApprove(rel)}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm hover:shadow flex items-center gap-1.5 transition-all"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Approve Release</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Pre-flight Technical Inspection Box */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Audio Master Format:</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <FileAudio className="w-3.5 h-3.5" /> {firstTrack?.audioFormat || 'WAV'} 24-bit/48kHz
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Artwork Resolution:</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> 3000 x 3000 px (1:1 RGB)
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">ISRC Allocation:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {firstTrack?.isrcCode || 'Auto-Allocated'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Copyright & Content ID:</span>
                    <span className="text-slate-700 dark:text-slate-300">
                      ℗ {rel.pLineYear || 2026} {rel.pLineText || 'DigiTube Network'} • {rel.hasContentIdOptIn ? 'CID Opted-In' : 'CID Standard'}
                    </span>
                  </div>
                </div>

                {/* If notes already exist */}
                {rel.reviewNotes && (
                  <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-500/30 text-xs text-amber-800 dark:text-amber-300">
                    <span className="font-semibold text-slate-900 dark:text-white">Staff Review Notes:</span> {rel.reviewNotes}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ================= FULL DETAILED INSPECTION MODAL ================= */}
      {selectedDetailRel && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-6 space-y-6">
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-900">
                  {selectedDetailRel.releaseCode}
                </span>
                <span className="text-xs font-bold uppercase text-slate-500">
                  {selectedDetailRel.releaseType} Revision Inspection
                </span>
                <StatusBadge status={selectedDetailRel.status} />
              </div>

              <button
                onClick={() => setSelectedDetailRel(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Header Identity Row */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div className="w-28 h-28 rounded-xl overflow-hidden shadow-sm shrink-0 border border-slate-200 dark:border-slate-700 bg-slate-900">
                <img
                  src={selectedDetailRel.artworkUrl}
                  alt={selectedDetailRel.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-1.5 flex-1 min-w-0 text-center sm:text-left">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 justify-center sm:justify-start">
                  {selectedDetailRel.title}
                  {selectedDetailRel.versionSubtitle && (
                    <span className="text-sm font-normal text-blue-600 dark:text-blue-400">
                      ({selectedDetailRel.versionSubtitle})
                    </span>
                  )}
                </h2>
                <div className="text-xs text-slate-600 dark:text-slate-300">
                  Primary Artist: <strong className="text-slate-900 dark:text-white">{selectedDetailRel.artistStageName}</strong>
                  {selectedDetailRel.artistId && (
                    <span className="text-slate-400 font-mono ml-1.5">({selectedDetailRel.artistId})</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 pt-1 justify-center sm:justify-start text-xs">
                  <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                    UPC: {selectedDetailRel.upcEan}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    Genre: {selectedDetailRel.primaryGenre} {selectedDetailRel.secondaryGenre ? `• ${selectedDetailRel.secondaryGenre}` : ''}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    Language: {selectedDetailRel.primaryLanguage}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    Label: {selectedDetailRel.recordLabel || 'DigiTube Music'}
                  </span>
                </div>
              </div>
            </div>

            {/* Section 1: Detailed Metadata Grid */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>1. Release Information & Distribution Targets</span>
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-slate-400 block text-[11px]">Target Live Date:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{selectedDetailRel.targetReleaseDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Release Timezone:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{selectedDetailRel.releaseTimezone || 'Asia/Kolkata'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Territory:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{selectedDetailRel.territoryType || 'WORLDWIDE'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Work Classification:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{selectedDetailRel.workType || 'ORIGINAL'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">℗ P-Line:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">℗ {selectedDetailRel.pLineYear} {selectedDetailRel.pLineText}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">© C-Line:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">© {selectedDetailRel.cLineYear} {selectedDetailRel.cLineText}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">YouTube Content ID:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {selectedDetailRel.hasContentIdOptIn ? 'Opted-In (Monetize)' : 'Standard'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Target Stores:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {selectedDetailRel.enabledDsps?.length || selectedDetailRel.dspStatuses?.length || 10} Stores Selected
                  </span>
                </div>
              </div>
            </div>

            {/* Section 2: Complete Audio Master Tracklist */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Music className="w-4 h-4 text-blue-600" />
                <span>2. Master Audio Tracks & QC Inspection ({selectedDetailRel.tracks?.length || 0})</span>
              </h4>

              <div className="space-y-2">
                {selectedDetailRel.tracks?.map((trk, idx) => (
                  <div
                    key={trk.id || idx}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center text-[10px]">
                          {trk.trackNumber || idx + 1}
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white truncate">
                          {trk.title}
                          {trk.versionSubtitle && (
                            <span className="text-slate-400 font-normal ml-1">({trk.versionSubtitle})</span>
                          )}
                        </span>
                        <span className="font-mono text-[10px] bg-slate-200 dark:bg-slate-800 px-1.5 py-0.2 rounded font-semibold text-slate-700 dark:text-slate-300">
                          ISRC: {trk.isrcCode}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex flex-wrap gap-2">
                        <span>File: <strong className="font-mono text-slate-700 dark:text-slate-300">{trk.audioFileName || 'Master.wav'}</strong></span>
                        <span>•</span>
                        <span>Format: <strong className="text-emerald-600 dark:text-emerald-400">{trk.audioFormat || 'WAV'} {trk.audioBitrate || '24-bit/48kHz'}</strong></span>
                        <span>•</span>
                        <span>Duration: <strong>{formatDuration(trk.durationSeconds || 215)}</strong></span>
                        {trk.bpm && <span>• BPM: <strong>{trk.bpm}</strong></span>}
                        {trk.musicalKey && <span>• Key: <strong>{trk.musicalKey}</strong></span>}
                      </div>

                      {trk.lyrics && (
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800 mt-1 whitespace-pre-line">
                          <span className="font-bold text-slate-700 dark:text-slate-300">Lyrics:</span> {trk.lyrics}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() =>
                        playAudioTrack(
                          trk,
                          trk.title,
                          selectedDetailRel.artistStageName,
                          selectedDetailRel.artworkUrl
                        )
                      }
                      className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all shrink-0 self-start sm:self-auto"
                      title="Play master audio preview"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>QC Audio Player</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: Contributor Credits & Royalty Splits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Contributor Credits */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>3. Contributor Credits ({(selectedDetailRel.tracks?.[0]?.credits || []).length})</span>
                </h4>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                  {Array.isArray(selectedDetailRel.tracks?.[0]?.credits) && selectedDetailRel.tracks![0].credits!.length > 0 ? (
                    selectedDetailRel.tracks![0].credits!.map((c, i) => (
                      <div key={c.id || i} className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0">
                        <span className="font-semibold text-slate-900 dark:text-white">{c.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-1.5 py-0.5 rounded">
                            {c.role}
                          </span>
                          {c.ipiCode && (
                            <span className="text-[10px] font-mono text-slate-400">IPI: {c.ipiCode}</span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-slate-400">Primary artist credit: {selectedDetailRel.artistStageName}</div>
                  )}
                </div>
              </div>

              {/* Royalty Splits */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <PieChart className="w-4 h-4 text-blue-600" />
                  <span>4. Royalty Splits ({(selectedDetailRel.splits || []).length || 1})</span>
                </h4>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                  {Array.isArray(selectedDetailRel.splits) && selectedDetailRel.splits.length > 0 ? (
                    selectedDetailRel.splits.map((s, i) => (
                      <div key={s.id || i} className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0">
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white">{s.payeeName}</div>
                          <div className="text-[10px] text-slate-400">{s.payeeEmail}</div>
                        </div>
                        <span className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">
                          {s.percentageShare}%
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{selectedDetailRel.artistStageName}</span>
                      <span className="font-mono font-bold text-emerald-600">100% (Solo)</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Section 4: Previous Staff Notes (if any) */}
            {selectedDetailRel.reviewNotes && (
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-300 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Previous Quality Review Feedback:</span>
                </div>
                <p className="text-slate-800 dark:text-slate-200 whitespace-pre-line pl-5">
                  {selectedDetailRel.reviewNotes}
                </p>
              </div>
            )}

            {/* Modal Bottom Action Controls */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => setSelectedDetailRel(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                Close Inspection
              </button>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => {
                    setSelectedRel(selectedDetailRel);
                    setShowChangesModal(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 text-xs font-bold flex items-center gap-1.5"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Request Corrections</span>
                </button>

                <button
                  onClick={() => handleReject(selectedDetailRel)}
                  className="px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 text-xs font-bold flex items-center gap-1.5"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Reject Release</span>
                </button>

                {selectedDetailRel.status !== 'APPROVED' && selectedDetailRel.status !== 'LIVE' && (
                  <button
                    onClick={() => handleApprove(selectedDetailRel)}
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve Release & Authorize DDEX</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REQUEST CHANGES MODAL */}
      {showChangesModal && selectedRel && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-amber-500/40 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <span>Request Corrections: {selectedRel.releaseCode}</span>
              </h3>
              <button
                onClick={() => setShowChangesModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRequestChanges} className="space-y-4 text-xs">
              <p className="text-slate-600 dark:text-slate-300">
                Specify field-level feedback for <strong className="text-slate-900 dark:text-white">"{selectedRel.title}"</strong>. The release will be moved to <em>Changes Required</em> and unlocked for the artist to edit and resubmit.
              </p>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Detailed QA Feedback Notes</label>
                <textarea
                  rows={4}
                  required
                  value={changesNotes}
                  onChange={(e) => setChangesNotes(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowChangesModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs shadow-sm"
                >
                  Return to Artist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
