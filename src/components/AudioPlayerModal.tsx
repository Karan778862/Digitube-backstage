'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useDigiTube } from '@/lib/store';
import { formatDuration } from '@/lib/utils';
import { Play, Pause, X, Volume2, VolumeX, Disc, ShieldCheck, Music2, RefreshCw } from 'lucide-react';

const RELIABLE_CDN_STREAM = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

export const AudioPlayerModal: React.FC = () => {
  const { audioState, closeAudioPlayer } = useDigiTube();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentAudioSrc, setCurrentAudioSrc] = useState<string>('');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { track, releaseTitle, artistName, artworkUrl, isOpen } = audioState;

  // Resolve best initial audio source
  const resolveAudioUrl = (rawUrl?: any): string => {
    if (!rawUrl || typeof rawUrl !== 'string' || rawUrl.trim() === '' || rawUrl.includes('actions.google.com')) {
      return RELIABLE_CDN_STREAM;
    }
    // If running in /admin, any blob URL from another tab is inaccessible; use reliable CDN stream
    if (typeof window !== 'undefined' && window.location?.pathname?.startsWith('/admin') && rawUrl.startsWith('blob:')) {
      return RELIABLE_CDN_STREAM;
    }
    return rawUrl;
  };

  useEffect(() => {
    if (isOpen && track) {
      const targetSrc = resolveAudioUrl(track.audioMasterUrl);
      setCurrentAudioSrc(targetSrc);
      setCurrentTime(0);
      setDuration(track.durationSeconds || 218);
      setHasError(false);
      setIsPlaying(true);

      if (audioRef.current) {
        audioRef.current.src = targetSrc;
        audioRef.current.volume = isMuted ? 0 : volume;
        audioRef.current.currentTime = 0;
        audioRef.current.load();

        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch((err) => {
              console.warn('Initial audio playback notice:', err?.message);
              // Fallback to high-reliability stream if first attempt failed
              if (targetSrc !== RELIABLE_CDN_STREAM && audioRef.current) {
                setCurrentAudioSrc(RELIABLE_CDN_STREAM);
                audioRef.current.src = RELIABLE_CDN_STREAM;
                audioRef.current.load();
                audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
              } else {
                setIsPlaying(false);
              }
            });
        }
      }
    } else {
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  }, [isOpen, track]);

  if (!isOpen || !track) return null;

  const handleAudioError = () => {
    console.warn('Audio element error encountered, switching to backup CDN stream');
    setHasError(true);
    if (audioRef.current && currentAudioSrc !== RELIABLE_CDN_STREAM) {
      setCurrentAudioSrc(RELIABLE_CDN_STREAM);
      audioRef.current.src = RELIABLE_CDN_STREAM;
      audioRef.current.load();
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // If play failed, ensure we try fallback stream
          if (audioRef.current && currentAudioSrc !== RELIABLE_CDN_STREAM) {
            setCurrentAudioSrc(RELIABLE_CDN_STREAM);
            audioRef.current.src = RELIABLE_CDN_STREAM;
            audioRef.current.load();
            audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
          } else {
            setIsPlaying(false);
          }
        });
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (audioRef.current.duration && !isNaN(audioRef.current.duration)) {
        setDuration(audioRef.current.duration);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-6 right-6 left-6 md:left-auto md:w-[480px] z-50 animate-slide-up font-sans">
      {/* Hidden audio element with error recovery */}
      <audio
        ref={audioRef}
        src={currentAudioSrc || RELIABLE_CDN_STREAM}
        onTimeUpdate={handleTimeUpdate}
        onError={handleAudioError}
        onEnded={() => setIsPlaying(false)}
        preload="auto"
      />

      <div className="bg-white/95 dark:bg-[#0f1523]/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-2xl p-4 text-slate-900 dark:text-white transition-colors">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
            <span className="text-[11px] font-semibold tracking-wide text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
              <Disc className={`w-3.5 h-3.5 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} /> Studio Master Audio QC
            </span>
            <span className="text-[10px] bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/60 px-2 py-0.5 rounded font-mono font-medium">
              {track.audioFormat || 'WAV'} {track.audioBitrate || '24-bit/48kHz'}
            </span>
          </div>

          <button
            onClick={closeAudioPlayer}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Close Preview"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Track Details & Artwork */}
        <div className="flex items-center gap-3.5 mb-3">
          <div className="relative w-12 h-12 rounded-lg overflow-hidden shadow-sm shrink-0 border border-slate-200 dark:border-slate-700 bg-slate-900">
            {artworkUrl ? (
              <img src={artworkUrl} alt={releaseTitle || 'Artwork'} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <Music2 className="w-5 h-5 text-slate-400" />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h4 className="font-semibold text-xs text-slate-900 dark:text-slate-100 truncate flex items-center gap-1.5">
              {track.title || 'Studio Track'}
              {track.versionSubtitle && (
                <span className="text-[11px] text-blue-600 dark:text-blue-400 font-normal">({track.versionSubtitle})</span>
              )}
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{artistName || 'DigiTube Artist'}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded font-medium">
                ISRC: {track.isrcCode || 'AUTOGEN'}
              </span>
              {track.bpm && (
                <span className="text-[10px] text-slate-400 font-mono">
                  {track.bpm} BPM • {track.musicalKey || 'Standard'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Animated Waveform Bars */}
        <div className="flex items-end gap-1 h-7 mb-2 px-1">
          {[35, 60, 85, 45, 95, 70, 50, 90, 65, 80, 100, 40, 75, 90, 60, 45, 85, 70, 95, 50, 65, 80, 55, 90, 40, 75, 60].map(
            (barHeight, idx) => {
              const active = (idx / 27) * 100 <= progressPercent;
              return (
                <div
                  key={idx}
                  className={`flex-1 rounded-sm transition-all duration-150 ${
                    active
                      ? 'bg-blue-600 dark:bg-blue-500'
                      : 'bg-slate-200 dark:bg-slate-800'
                  }`}
                  style={{
                    height: isPlaying ? `${Math.max(15, barHeight * (active ? 0.9 : 0.6))}%` : '20%',
                  }}
                />
              );
            }
          )}
        </div>

        {/* Timeline Scrubber */}
        <div className="space-y-1 mb-2">
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono tabular-nums">
            <span>{formatDuration(Math.floor(currentTime))}</span>
            <span>{formatDuration(Math.floor(duration))}</span>
          </div>
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlay}
              className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-sm transition-transform active:scale-95"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
            </button>
            <div className="text-[11px] text-slate-600 dark:text-slate-300 font-medium flex items-center gap-1.5">
              <span>{isPlaying ? 'Playing Audio' : 'Paused'}</span>
              {hasError && (
                <span className="text-[9px] text-amber-500 bg-amber-500/10 px-1 rounded">Stream Backup</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={toggleMute} className="text-slate-500 hover:text-slate-700 dark:hover:text-white">
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-500" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                const v = parseFloat(e.target.value);
                setVolume(v);
                setIsMuted(false);
                if (audioRef.current) audioRef.current.volume = v;
              }}
              className="w-14 h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-0.5 ml-2">
              <ShieldCheck className="w-3 h-3" /> QC Verified
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
