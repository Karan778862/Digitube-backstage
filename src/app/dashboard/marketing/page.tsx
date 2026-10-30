'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useDigiTube } from '@/lib/store';
import {
  Share2,
  Plus,
  ExternalLink,
  Copy,
  Check,
  QrCode,
  Sparkles,
  BarChart2,
  Music,
  X,
} from 'lucide-react';

export default function MarketingPage() {
  const { smartLinks, createSmartLink, releases } = useDigiTube();
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form State
  const [selectedRelId, setSelectedRelId] = useState(releases[0]?.id || '');
  const [slug, setSlug] = useState('new-single-presave');
  const [spotifyUrl, setSpotifyUrl] = useState('https://open.spotify.com/track/sample');
  const [appleUrl, setAppleUrl] = useState('https://music.apple.com/in/album/sample');
  const [ytUrl, setYtUrl] = useState('https://music.youtube.com/watch?v=sample');
  const [jioUrl, setJioUrl] = useState('https://www.jiosaavn.com/song/sample');

  const handleCopyLink = (slugText: string) => {
    const fullUrl = `${window.location.origin}/smart-link/${slugText}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedSlug(slugText);
    setTimeout(() => setCopiedSlug(null), 3000);
  };

  const handleCreateSmartLink = (e: React.FormEvent) => {
    e.preventDefault();
    const rel = releases.find((r) => r.id === selectedRelId) || releases[0];
    createSmartLink({
      releaseId: rel.id,
      slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      title: rel.title,
      artistName: rel.artistStageName,
      artworkUrl: rel.artworkUrl,
      spotifyUrl,
      appleMusicUrl: appleUrl,
      youtubeUrl: ytUrl,
      jiosaavnUrl: jioUrl,
    });
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
            Smart Music Links & Pre-Save
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Section 14: Landing pages directing fans to their preferred streaming DSP. Built-in analytics and QR routing.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary px-4 py-2 text-xs flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Smart Link</span>
        </button>
      </div>

      {/* Smart Links Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {smartLinks.map((link) => (
          <div
            key={link.id}
            className="card-executive p-6 hover:border-blue-500/80 transition-all space-y-5 shadow-xs"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 shadow-sm">
                <img src={link.artworkUrl} alt={link.title} className="w-full h-full object-cover" />
              </div>

              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-mono font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800/60">
                  /{link.slug}
                </span>
                <h3 className="text-base font-display font-bold text-slate-900 dark:text-white truncate mt-1">{link.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{link.artistName}</p>
              </div>

              <div className="text-right">
                <div className="text-xl font-display font-bold tabular-nums text-slate-900 dark:text-white">{link.clicks}</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">Fan Clicks</div>
              </div>
            </div>

            {/* Link Preview Row */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="font-mono text-slate-600 dark:text-slate-400 truncate max-w-[280px]">
                digitube.link/{link.slug}
              </span>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleCopyLink(link.slug)}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1 transition-colors text-xs font-medium shadow-sm"
                >
                  {copiedSlug === link.slug ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>

                <Link
                  href={`/smart-link/${link.slug}`}
                  target="_blank"
                  className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-blue-200 dark:border-blue-800/60 flex items-center gap-1 transition-colors text-xs font-semibold"
                >
                  <span>Open Fan Page</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Connected Stores Pills */}
            <div className="flex flex-wrap gap-2 text-[11px] pt-1">
              {link.spotifyUrl && (
                <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 font-medium">
                  Spotify Active
                </span>
              )}
              {link.appleMusicUrl && (
                <span className="px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/50 font-medium">
                  Apple Music Active
                </span>
              )}
              {link.youtubeUrl && (
                <span className="px-2 py-0.5 rounded bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/50 font-medium">
                  YouTube Music Active
                </span>
              )}
              {link.jiosaavnUrl && (
                <span className="px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800/50 font-medium">
                  JioSaavn Active
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* CREATE SMART LINK MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Share2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>Generate Smart Music Link</span>
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSmartLink} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Select Catalog Release</label>
                <select
                  value={selectedRelId}
                  onChange={(e) => setSelectedRelId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                >
                  {releases.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title} ({r.releaseCode}) - {r.artistStageName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Custom Link Slug</label>
                <div className="flex items-center bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus-within:border-blue-500">
                  <span className="text-slate-400 font-mono">digitube.link/</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="flex-1 bg-transparent border-0 outline-none font-mono text-blue-600 dark:text-blue-400 pl-1 font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <span className="font-semibold text-slate-800 dark:text-slate-200 block">Verified Store URLs:</span>
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 text-[11px] mb-0.5">Spotify URL</label>
                  <input
                    type="text"
                    value={spotifyUrl}
                    onChange={(e) => setSpotifyUrl(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 text-[11px] mb-0.5">Apple Music URL</label>
                  <input
                    type="text"
                    value={appleUrl}
                    onChange={(e) => setAppleUrl(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 text-[11px] mb-0.5">YouTube Music URL</label>
                  <input
                    type="text"
                    value={ytUrl}
                    onChange={(e) => setYtUrl(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm"
                >
                  Publish Smart Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
