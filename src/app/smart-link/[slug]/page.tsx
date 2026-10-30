'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useDigiTube } from '@/lib/store';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  SpotifyLogo,
  AppleMusicLogo,
  YouTubeMusicLogo,
  JioSaavnLogo,
  AmazonMusicLogo,
} from '@/components/DspLogos';
import {
  Disc3,
  Play,
  ExternalLink,
  Share2,
  Check,
  Headphones,
  Music2,
  Sparkles,
} from 'lucide-react';

export default function SmartLinkFanPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { smartLinks, releases, playAudioTrack } = useDigiTube();

  const [copied, setCopied] = useState(false);

  const link = smartLinks.find((l) => l.slug === slug) || smartLinks[0];
  const release = releases.find((r) => r.id === link?.releaseId) || releases[0];
  const firstTrack = release?.tracks[0];

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const platforms = [
    {
      name: 'Spotify',
      color: '#1DB954',
      url: link?.spotifyUrl || 'https://open.spotify.com',
      badge: 'Play',
      Logo: SpotifyLogo,
    },
    {
      name: 'Apple Music',
      color: '#FC3C44',
      url: link?.appleMusicUrl || 'https://music.apple.com',
      badge: 'Play',
      Logo: AppleMusicLogo,
    },
    {
      name: 'YouTube Music',
      color: '#FF0000',
      url: link?.youtubeUrl || 'https://music.youtube.com',
      badge: 'Watch & Listen',
      Logo: YouTubeMusicLogo,
    },
    {
      name: 'JioSaavn',
      color: '#2BC5B4',
      url: link?.jiosaavnUrl || 'https://www.jiosaavn.com',
      badge: 'Play',
      Logo: JioSaavnLogo,
    },
    {
      name: 'Amazon Music',
      color: '#00A8E1',
      url: link?.amazonUrl || 'https://music.amazon.com',
      badge: 'Play',
      Logo: AmazonMusicLogo,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden text-slate-900 dark:text-slate-100 transition-colors">
      {/* Blurred Album Artwork Ambient Background */}
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-3xl opacity-20 dark:opacity-20 scale-125 pointer-events-none"
        style={{ backgroundImage: `url(${link?.artworkUrl})` }}
      />
      <div className="absolute inset-0 bg-white/70 dark:bg-slate-950/80 backdrop-blur-xl pointer-events-none" />

      {/* Top Controls */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      {/* Main Fan Card */}
      <div className="relative z-10 max-w-sm w-full bg-white dark:bg-slate-900/90 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 text-center space-y-6 animate-fade-in">
        {/* Cover Artwork with audio preview button */}
        <div className="relative w-64 h-64 mx-auto rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-700/80 group">
          <img src={link?.artworkUrl} alt={link?.title} className="w-full h-full object-cover" />
          {firstTrack && (
            <button
              onClick={() =>
                playAudioTrack(
                  firstTrack,
                  link?.title || 'Release',
                  link?.artistName || 'Artist',
                  link?.artworkUrl || ''
                )
              }
              className="absolute inset-0 bg-black/40 hover:bg-black/60 flex items-center justify-center text-white transition-opacity"
              title="Preview 30s Master Sample"
            >
              <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Play className="w-7 h-7 fill-white ml-1" />
              </div>
            </button>
          )}
        </div>

        {/* Title & Artist */}
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{link?.title}</h1>
          <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold">{link?.artistName}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Choose your favorite music service</p>
        </div>

        {/* Platform Selection Buttons */}
        <div className="space-y-2.5">
          {platforms.map((p) => (
            <a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-slate-800 flex items-center justify-between transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700/80 flex items-center justify-center shadow-xs border border-slate-200/60 dark:border-slate-600/60 shrink-0">
                  <p.Logo className="w-4 h-4 shrink-0" />
                </div>
                <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {p.name}
                </span>
              </div>

              <span className="px-3 py-1 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 group-hover:bg-blue-600 text-[11px] font-semibold text-slate-700 dark:text-slate-300 group-hover:text-white transition-all flex items-center gap-1 shadow-sm">
                <span>{p.badge}</span>
                <ExternalLink className="w-3 h-3" />
              </span>
            </a>
          ))}
        </div>

        {/* Share Button & Branding */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <button
            onClick={handleShare}
            className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 transition-colors font-medium"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>Share Song</span>
              </>
            )}
          </button>

          <Link
            href="/"
            className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-semibold"
          >
            <Disc3 className="w-3.5 h-3.5" />
            <span>DigiTube Network</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
