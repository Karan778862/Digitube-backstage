'use client';

import React, { useState } from 'react';
import { useDigiTube } from '@/lib/store';
import { ReleaseItem } from '@/lib/types';
import { StatusBadge } from '@/components/StatusBadge';
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
} from 'lucide-react';

export default function AdminReviewPage() {
  const { releases, updateReleaseStatus, playAudioTrack } = useDigiTube();

  const [selectedRel, setSelectedRel] = useState<ReleaseItem | null>(null);
  const [showChangesModal, setShowChangesModal] = useState(false);
  const [changesNotes, setChangesNotes] = useState(
    'Please attach written sample clearance license for track 1. Also update the composer credit to match the IPI database.'
  );
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Filter releases that require QA attention
  const reviewQueue = releases.filter(
    (r) =>
      r.status === 'IN_REVIEW' ||
      r.status === 'SUBMITTED' ||
      r.status === 'VALIDATION' ||
      r.status === 'CHANGES_REQUIRED'
  );

  const handleApprove = async (rel: ReleaseItem) => {
    updateReleaseStatus(
      rel.id,
      'APPROVED',
      'Quality assurance passed. Release approved and queued for distribution delivery.'
    );
    try {
      await fetch('/api/releases', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: rel.id, status: 'APPROVED' }),
      });
    } catch {}
    setActionNotice(`Release ${rel.releaseCode} approved! Queued for DigiTube DDEX delivery.`);
    setSelectedRel(null);
    setTimeout(() => setActionNotice(null), 5000);
  };

  const handleRequestChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRel || !changesNotes) return;

    updateReleaseStatus(selectedRel.id, 'CHANGES_REQUIRED', changesNotes);
    try {
      await fetch('/api/releases', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedRel.id,
          status: 'CHANGES_REQUIRED',
          reviewNotes: changesNotes,
        }),
      });
    } catch {}
    setActionNotice(`Changes requested for ${selectedRel.releaseCode}. Artist notified.`);
    setShowChangesModal(false);
    setSelectedRel(null);
    setTimeout(() => setActionNotice(null), 5000);
  };

  const handleReject = async (rel: ReleaseItem) => {
    const reason = prompt(`Enter rejection reason for ${rel.releaseCode}:`, 'Copyright compliance violation / uncleared third-party samples.');
    if (!reason) return;

    updateReleaseStatus(rel.id, 'REJECTED', reason);
    try {
      await fetch('/api/releases', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: rel.id, status: 'REJECTED', reviewNotes: reason }),
      });
    } catch {}
    setActionNotice(`Release ${rel.releaseCode} rejected.`);
    setTimeout(() => setActionNotice(null), 5000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200 dark:border-slate-800">
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

      {actionNotice && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-300 text-xs flex items-center gap-3 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
          <span className="font-medium">{actionNotice}</span>
        </div>
      )}

      {/* Review Queue Cards */}
      <div className="space-y-4">
        {reviewQueue.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200">Quality Review Queue is Clear!</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              All submitted music releases have been inspected and authorized for distribution.
            </p>
          </div>
        ) : (
          reviewQueue.map((rel) => {
            const firstTrack = rel.tracks[0];
            return (
              <div
                key={rel.id}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500/40 shadow-sm transition-all space-y-5"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 shadow-sm">
                      <img src={rel.artworkUrl} alt={rel.title} className="w-full h-full object-cover" />
                      {firstTrack && (
                        <button
                          onClick={() =>
                            playAudioTrack(
                              firstTrack,
                              rel.title,
                              rel.artistStageName,
                              rel.artworkUrl
                            )
                          }
                          className="absolute inset-0 bg-black/40 hover:bg-black/60 flex items-center justify-center text-white"
                          title="QC Audio Player"
                        >
                          <Play className="w-7 h-7 fill-white" />
                        </button>
                      )}
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded font-semibold border border-amber-200 dark:border-amber-800/60">
                          {rel.releaseCode}
                        </span>
                        <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                          UPC: {rel.upcEan}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400">
                          {rel.releaseType}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white truncate flex items-center gap-2">
                        {rel.title}
                        {rel.versionSubtitle && (
                          <span className="text-xs font-normal text-slate-500 dark:text-slate-400">({rel.versionSubtitle})</span>
                        )}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        Artist: <strong className="text-slate-900 dark:text-slate-200">{rel.artistStageName}</strong> • {rel.primaryGenre} • Target Live Date: {rel.targetReleaseDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-auto">
                    <StatusBadge status={rel.status} />

                    <button
                      onClick={() => {
                        setSelectedRel(rel);
                        setShowChangesModal(true);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:border-amber-300 dark:hover:border-amber-500/40 border border-slate-200 dark:border-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Request Changes</span>
                    </button>

                    <button
                      onClick={() => handleReject(rel)}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:border-rose-300 dark:hover:border-rose-500/40 border border-slate-200 dark:border-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>

                    <button
                      onClick={() => handleApprove(rel)}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm hover:shadow flex items-center gap-1.5 transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve Release</span>
                    </button>
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
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{firstTrack?.isrcCode || 'Allocated'}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Copyright & Content ID:</span>
                    <span className="text-slate-700 dark:text-slate-300">
                      ℗ {rel.pLineYear} {rel.pLineText} • {rel.hasContentIdOptIn ? 'CID Opted-In' : 'CID Disabled'}
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

      {/* REQUEST CHANGES MODAL */}
      {showChangesModal && selectedRel && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-amber-500/40 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <span>Request Corrections: {selectedRel.releaseCode}</span>
              </h3>
              <button onClick={() => setShowChangesModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
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
