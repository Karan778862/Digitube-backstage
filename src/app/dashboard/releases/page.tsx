'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useDigiTube } from '@/lib/store';
import { ReleaseItem } from '@/lib/types';
import { StatusBadge } from '@/components/StatusBadge';
import { DspStatusGrid } from '@/components/DspStatusGrid';
import {
  Plus,
  Search,
  Filter,
  Play,
  Trash2,
  AlertTriangle,
  X,
  ShieldAlert,
} from 'lucide-react';

export default function ReleasesCatalogPage() {
  const { releases, requestTakedown, playAudioTrack } = useDigiTube();

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedRelease, setSelectedRelease] = useState<ReleaseItem | null>(null);
  const [takedownModalRelease, setTakedownModalRelease] = useState<ReleaseItem | null>(null);

  const filteredReleases = releases.filter((rel) => {
    const matchesSearch =
      rel.title.toLowerCase().includes(search.toLowerCase()) ||
      rel.releaseCode.toLowerCase().includes(search.toLowerCase()) ||
      rel.upcEan.toLowerCase().includes(search.toLowerCase()) ||
      rel.artistStageName.toLowerCase().includes(search.toLowerCase());

    if (filterStatus === 'ALL') return matchesSearch;
    if (filterStatus === 'LIVE') return matchesSearch && rel.status === 'LIVE';
    if (filterStatus === 'IN_REVIEW')
      return matchesSearch && (rel.status === 'IN_REVIEW' || rel.status === 'SUBMITTED' || rel.status === 'VALIDATION');
    if (filterStatus === 'CHANGES_REQUIRED') return matchesSearch && rel.status === 'CHANGES_REQUIRED';
    return matchesSearch && rel.status === filterStatus;
  });

  const handleConfirmTakedown = () => {
    if (takedownModalRelease) {
      requestTakedown(takedownModalRelease.id);
      setTakedownModalRelease(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">Music Catalog & Releases</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage your singles, EPs, and albums. Track per-store ingestion status and execute takedowns.
          </p>
        </div>

        <Link
          href="/dashboard/releases/new"
          className="btn-primary px-4 py-2 text-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Release</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by title, artist, UPC, or ISRC..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-executive w-full pl-9 pr-3 text-xs placeholder-slate-400"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { key: 'ALL', label: 'All Catalog' },
            { key: 'LIVE', label: 'Live on Stores' },
            { key: 'IN_REVIEW', label: 'In Review' },
            { key: 'CHANGES_REQUIRED', label: 'Changes Needed' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilterStatus(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border ${
                filterStatus === tab.key
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-white dark:bg-[#0d1322] border-slate-200/90 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Releases List */}
      <div className="space-y-3.5">
        {filteredReleases.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <Filter className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">No releases found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try adjusting your search terms or create a new release using the wizard.
            </p>
          </div>
        ) : (
          filteredReleases.map((rel) => {
            const firstTrack = rel.tracks[0];
            return (
              <div
                key={rel.id}
                className="card-executive p-5 hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-4 shadow-xs"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 shadow-sm">
                      <img src={rel.artworkUrl} alt={rel.title} className="w-full h-full object-cover" />
                      {firstTrack && (
                        <button
                          onClick={() =>
                            playAudioTrack(firstTrack, rel.title, rel.artistStageName, rel.artworkUrl)
                          }
                          className="absolute inset-0 bg-black/40 hover:bg-black/60 flex items-center justify-center text-white"
                          title="Preview Audio Master"
                        >
                          <Play className="w-6 h-6 fill-white" />
                        </button>
                      )}
                    </div>

                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-medium">
                          {rel.releaseCode}
                        </span>
                        <span className="text-[10px] font-mono text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-1.5 py-0.5 rounded font-bold">
                          UPC: {rel.upcEan}
                        </span>
                        <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
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
                        Primary: <strong className="text-slate-800 dark:text-slate-200">{rel.artistStageName}</strong> • {rel.primaryGenre} • {rel.tracks.length} {rel.tracks.length === 1 ? 'Track' : 'Tracks'} • Released: {rel.targetReleaseDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 self-end md:self-auto">
                    <StatusBadge status={rel.status} />

                    <button
                      onClick={() => setSelectedRelease(rel)}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors"
                    >
                      Details
                    </button>

                    {rel.status === 'LIVE' && (
                      <button
                        onClick={() => setTakedownModalRelease(rel)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                        title="Request DSP Takedown"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {rel.status === 'CHANGES_REQUIRED' && rel.reviewNotes && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Compliance Feedback:</span> {rel.reviewNotes}
                      <div className="mt-0.5">
                        <Link href="/dashboard/support" className="font-bold underline hover:text-rose-600">
                          Reply to Staff via Support Desk &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <DspStatusGrid dspStatuses={rel.dspStatuses} />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* DETAIL MODAL */}
      {selectedRelease && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded font-bold">
                  {selectedRelease.releaseCode}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{selectedRelease.title}</h3>
              </div>
              <button onClick={() => setSelectedRelease(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block">UPC / EAN:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{selectedRelease.upcEan}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Record Label:</span>
                <span className="text-slate-900 dark:text-white font-medium">{selectedRelease.recordLabel}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Target Live Date:</span>
                <span className="text-slate-900 dark:text-white font-medium">{selectedRelease.targetReleaseDate}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Track List</h4>
              <div className="space-y-1.5">
                {selectedRelease.tracks.map((t) => (
                  <div
                    key={t.id}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">{t.trackNumber}. {t.title}</span>
                      <span className="text-[10px] font-mono text-slate-400 ml-2">ISRC: {t.isrcCode}</span>
                    </div>
                    <button
                      onClick={() => playAudioTrack(t, selectedRelease.title, selectedRelease.artistStageName, selectedRelease.artworkUrl)}
                      className="px-2 py-1 rounded bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 hover:bg-blue-100 text-[11px] font-bold flex items-center gap-1"
                    >
                      <Play className="w-3 h-3 fill-blue-600 dark:fill-blue-400" /> Play
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedRelease(null)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAKEDOWN MODAL */}
      {takedownModalRelease && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2.5 text-rose-600">
              <ShieldAlert className="w-6 h-6" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Confirm Release Takedown</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Are you sure you want to request a takedown for <strong className="text-slate-900 dark:text-white">"{takedownModalRelease.title}"</strong> ({takedownModalRelease.releaseCode})?
              Formal takedown notices will be sent to all active stores.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setTakedownModalRelease(null)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmTakedown}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                Confirm Takedown
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
