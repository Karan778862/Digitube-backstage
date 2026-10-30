'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import {
  Disc3,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  SlidersHorizontal,
  Wallet,
  Play,
  Building2,
  Lock,
  Zap,
  Star,
  Users,
  TrendingUp,
  Music,
  Quote,
  Award,
  MessageCircle,
  Headphones,
} from 'lucide-react';

import {
  SpotifyLogo,
  AppleMusicLogo,
  YouTubeMusicLogo,
  JioSaavnLogo,
  AmazonMusicLogo,
  MetaInstagramLogo,
  TikTokLogo,
  WynkLogo,
  TidalLogo,
  DeezerLogo,
} from '@/components/DspLogos';

export default function HomePage() {
  const clientRoster = [
    {
      name: 'Desi Beats Music Pvt Ltd',
      type: 'Record Label',
      region: 'New Delhi & Mohali',
      genre: 'Punjabi Pop & Hip-Hop',
      stats: '45+ Artists • 320 Releases',
      metric: '₹48L+ Royalties Settled',
      avatar: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=500&auto=format&fit=crop&q=80',
      badge: 'Certified Label Partner',
    },
    {
      name: 'Bhojpuri Wave Digital',
      type: 'Regional Network',
      region: 'Patna & Varanasi',
      genre: 'Bhojpuri & Maithili Folk',
      stats: '85+ Artists • 1,400 Tracks',
      metric: '180M+ YouTube CID Views',
      avatar: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&auto=format&fit=crop&q=80',
      badge: 'High-Volume Partner',
    },
    {
      name: 'Kamlesh Pandit',
      type: 'Verified Artist',
      region: 'Varanasi & Mumbai',
      genre: 'Devotional & Classical Fusion',
      stats: '18 Singles • 1.4M Listeners',
      metric: 'Top 100 Spiritual Charts',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
      badge: 'Verified Creator',
    },
    {
      name: 'Sufi Soul Records',
      type: 'Indie Imprint',
      region: 'Lucknow & Mumbai',
      genre: 'Sufi, Ghazal & Acoustic',
      stats: '30+ Artists • 210 Releases',
      metric: 'Spotify Editorial Curated',
      avatar: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
      badge: 'Editorial Partner',
    },
    {
      name: 'Urban Haryanvi Tunes',
      type: 'Regional Label',
      region: 'Rohtak & Gurugram',
      genre: 'Haryanvi Pop & Desi Trap',
      stats: '65+ Releases • 8 signed artists',
      metric: 'Trending #1 Reels Audio',
      avatar: 'https://images.unsplash.com/photo-1520523839898-507127cd53c3?w=500&auto=format&fit=crop&q=80',
      badge: 'Trending Audio',
    },
    {
      name: 'Mithila Beats Studio',
      type: 'Sound Recording Studio',
      region: 'Darbhanga & Patna',
      genre: 'Traditional Folk & Lokgeet',
      stats: '500+ Tracks Distributed',
      metric: 'Wynk & JioSaavn Direct',
      avatar: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80',
      badge: 'Studio Partner',
    },
    {
      name: 'Rohan Varma & The Collective',
      type: 'Indie Band',
      region: 'Mumbai & Pune',
      genre: 'Indie Pop & Alternative Rock',
      stats: '3 EPs • 950K Streams',
      metric: 'Apple Music Featured',
      avatar: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=500&auto=format&fit=crop&q=80',
      badge: 'Indie Spotlight',
    },
    {
      name: 'Southern Echoes Media',
      type: 'Regional Imprint',
      region: 'Bengaluru & Hyderabad',
      genre: 'South Fusion & Carnatic Rock',
      stats: '40 Releases • 12 Artists',
      metric: 'International Distribution',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
      badge: 'Regional Network',
    },
  ];

  const testimonials = [
    {
      quote:
        "Before DigiTube, our label had to wait 3-4 days just to get release approvals. With DigiTube's automated DDEX grid, our songs go live on Spotify, Wynk, and JioSaavn within 24 hours. Their splitsheets feature saves our accounts team 20 hours every month.",
      author: 'Vikramaditya Singh',
      role: 'Founder & Managing Director',
      company: 'Desi Beats Music Pvt Ltd',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      stats: '320+ Releases on DigiTube',
    },
    {
      quote:
        'The direct UPI and NEFT bank settlements with zero delay make DigiTube unmatched in India. Our artists receive monthly statements with complete store-by-store stream breakdown. No hidden deductions, 100% transparent double-entry ledger.',
      author: 'Sunita Sharma',
      role: 'Head of Catalog & Operations',
      company: 'Bhojpuri Wave Digital',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      stats: '1,400+ Tracks Live Worldwide',
    },
    {
      quote:
        'As an independent singer-composer, keeping 100% of my royalties and having automated YouTube Content ID fingerprinting without losing master rights has been revolutionary. The 9-step wizard generates ISRC and UPC codes automatically.',
      author: 'Kamlesh Pandit',
      role: 'Verified Singer & Composer',
      company: 'Independent Artist Roster',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
      stats: '1.4M+ Monthly Listeners',
    },
  ];

  const dspPartners = [
    { name: 'Spotify', color: '#1DB954', Logo: SpotifyLogo, share: '38%' },
    { name: 'Apple Music', color: '#FC3C44', Logo: AppleMusicLogo, share: '24%' },
    { name: 'YouTube Music', color: '#FF0000', Logo: YouTubeMusicLogo, share: '21%' },
    { name: 'JioSaavn', color: '#2BC5B4', Logo: JioSaavnLogo, share: '11%' },
    { name: 'Amazon Music', color: '#00A8E1', Logo: AmazonMusicLogo, share: '6%' },
    { name: 'Instagram & Meta', color: '#0668E1', Logo: MetaInstagramLogo, share: 'Global' },
    { name: 'TikTok & Resso', color: '#00F2FE', Logo: TikTokLogo, share: 'Global' },
    { name: 'Wynk Music', color: '#ED1B24', Logo: WynkLogo, share: 'India' },
    { name: 'TIDAL HiFi', color: '#000000', Logo: TidalLogo, share: 'Hi-Res' },
    { name: 'Deezer', color: '#FEAA2D', Logo: DeezerLogo, share: 'Global' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080c14] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-5">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/60 text-xs font-semibold tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
              <span>DigiTube Network • Enterprise DDEX Distribution Grid</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              The Operating System for{' '}
              <span className="text-blue-600 dark:text-blue-400">
                Independent Music Distribution
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
              Deliver sound recordings to 150+ digital stores globally. Built-in 9-step release wizard, automated quality assurance, auditable double-entry accounting, and direct Indian banking settlements.
            </p>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <Link
                href="/dashboard"
                className="btn-primary w-full sm:w-auto px-6 py-2.5 text-xs inline-flex items-center justify-center gap-2"
              >
                <span>Launch Backstage Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/dashboard/releases/new"
                className="btn-secondary w-full sm:w-auto px-5 py-2.5 text-xs inline-flex items-center justify-center gap-2"
              >
                <Disc3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>9-Step Release Wizard</span>
              </Link>

              <Link
                href="/admin"
                className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 text-xs font-semibold hover:border-amber-300 transition-all inline-flex items-center justify-center gap-1.5 shadow-sm"
              >
                <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Super Admin Desk</span>
              </Link>
            </div>

            {/* Key trust bullets */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> 100% Master & Publishing Rights Retained
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> DDEX ERN Compliant Ingestion
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Reconciled Royalty Splits
              </span>
            </div>
          </div>

          {/* Interactive Hero Preview Card */}
          <div className="mt-12 max-w-5xl mx-auto rounded-xl bg-white dark:bg-[#0f1523] border border-slate-200/90 dark:border-slate-800/80 p-5 sm:p-6 shadow-xl space-y-6">
            {/* Fake Backstage Window Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                <span className="text-xs font-mono text-slate-400 dark:text-slate-500 ml-2">
                  app.digitubenetwork.com/backstage/catalog/DGT-2026-8912
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/50 px-2.5 py-0.5 rounded-md flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Live on 150+ Stores
                </span>
              </div>
            </div>

            {/* Release Header Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="flex items-center gap-4 md:col-span-2">
                <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 shadow-sm">
                  <img
                    src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80"
                    alt="Album Artwork"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <Play className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800 px-1.5 py-0.5 rounded font-bold">
                      UPC: 890128492019
                    </span>
                    <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded font-medium">
                      ISRC: INDGT2600101
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">Kesariya Lofi Sunset</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Kamlesh Pandit • Indian Pop / Lo-Fi • Released 15 Oct 2026
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-0.5">
                    ℗ DigiTube Network / Kamlesh Pandit • © DigiTube Network
                  </p>
                </div>
              </div>

              {/* Metrics Box */}
              <div className="bg-slate-50 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 grid grid-cols-2 gap-3 text-center">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Total Streams</div>
                  <div className="text-xl font-bold font-sans tabular-nums text-slate-900 dark:text-white mt-0.5">1,420,500</div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">+24.5% month</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Net Royalties</div>
                  <div className="text-xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400 mt-0.5">₹49,300</div>
                  <div className="text-[10px] text-slate-500 font-medium">85% Artist Share</div>
                </div>
              </div>
            </div>

            {/* Per-Store Delivery Matrix */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Automated Per-Store Ingestion Status</span>
                <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">Live Webhook Sync</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                {[
                  { store: 'Spotify', status: 'LIVE', Logo: SpotifyLogo },
                  { store: 'Apple Music', status: 'LIVE', Logo: AppleMusicLogo },
                  { store: 'YouTube Music', status: 'LIVE', Logo: YouTubeMusicLogo },
                  { store: 'JioSaavn', status: 'LIVE', Logo: JioSaavnLogo },
                  { store: 'Amazon Music', status: 'LIVE', Logo: AmazonMusicLogo },
                  { store: 'Instagram Meta', status: 'LIVE', Logo: MetaInstagramLogo },
                ].map((s, idx) => (
                  <div key={idx} className="bg-slate-50 dark:bg-[#080c14] p-2.5 rounded-lg border border-slate-200/90 dark:border-slate-800 text-center flex flex-col items-center justify-center">
                    <s.Logo className="w-4 h-4 mb-1" />
                    <div className="text-[11px] font-bold text-slate-900 dark:text-slate-200">{s.store}</div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5 flex items-center justify-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>{s.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DSP Partners Grid */}
      <section id="dsp-partners" className="py-12 bg-white dark:bg-[#090d16] border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Direct Delivery to 150+ Digital Stores
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Automated ingestion for DSPs across South Asia, North America, Europe, and Global markets.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {dspPartners.map((dsp, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-white dark:bg-[#0d1322] border border-slate-200/90 dark:border-slate-800 hover:border-blue-500/80 dark:hover:border-blue-500/80 transition-all flex items-center gap-3 group shadow-xs"
              >
                <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center shrink-0 border border-slate-200/50 dark:border-slate-700/50">
                  <dsp.Logo className="w-5 h-5 shrink-0" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {dsp.name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">150+ Territory Ingestion</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Platform Features */}
      <section id="services" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
            Core Architecture
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Engineered According to Blueprint Specification
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs">
            DigiTube Network provides complete operational tools for independent creators, record labels, and administrative teams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 hover:border-blue-400 transition-all space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">9-Step Release Wizard</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Step-by-step ingestion: Title & subtitles, 3000px cover validation, lossless WAV audio master upload with audio playback preview, ISRC/UPC generation, contributor credits, and territory controls.
            </p>
            <div className="pt-1 text-xs text-blue-600 dark:text-blue-400 font-semibold">
              <Link href="/dashboard/releases/new">Launch Wizard &rarr;</Link>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 hover:border-blue-400 transition-all space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Quality Review & Life Cycle</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Internal QA desk where release managers inspect audio, artwork, copyright declarations, and metadata. Status workflow: Draft &rarr; In Review &rarr; Changes Required &rarr; Approved &rarr; Live.
            </p>
            <div className="pt-1 text-xs text-cyan-600 dark:text-cyan-400 font-semibold">
              <Link href="/admin/review">Inspect QA Queue &rarr;</Link>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 hover:border-blue-400 transition-all space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Wallet className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Immutable Royalty Ledger</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Import monthly DSP statements (DigiTube DDEX). Automatically deduct contractual 15% DigiTube commission cut, reconcile collaborator splits, and execute bank withdrawals without duplicate risk.
            </p>
            <div className="pt-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              <Link href="/dashboard/royalties">Explore Royalty Ledger &rarr;</Link>
            </div>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 hover:border-blue-400 transition-all space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Record Label Roster Hub</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Multi-tenant architecture allowing labels to manage dozens of signed artists, release catalog under distinct imprints, track combined earnings, and send profile linkage invites.
            </p>
            <div className="pt-1 text-xs text-amber-600 dark:text-amber-400 font-semibold">
              <Link href="/dashboard/label">View Label Workspace &rarr;</Link>
            </div>
          </div>

          {/* Card 5 */}
          <div className="p-6 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 hover:border-blue-400 transition-all space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Smart Links & Pre-Save</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Automatically generate fan landing pages with verified store URLs for Spotify, Apple Music, YouTube, and JioSaavn. QR code generation and real-time click attribution.
            </p>
            <div className="pt-1 text-xs text-blue-600 dark:text-blue-400 font-semibold">
              <Link href="/smart-link/kesariya-lofi-sunset">Test Smart Link Page &rarr;</Link>
            </div>
          </div>

          {/* Card 6 */}
          <div className="p-6 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 hover:border-blue-400 transition-all space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Staff Roles & Audit Trail</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Granular RBAC allowlisting: Catalog Staff, Release Manager, Accounts Staff, and Support Staff. Full immutable audit trail recording actor, timestamp, IP, reason, and before/after diffs.
            </p>
            <div className="pt-1 text-xs text-rose-600 dark:text-rose-400 font-semibold">
              <Link href="/admin/audit">View Audit Logs &rarr;</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Models */}
      <section id="plans" className="py-16 bg-white dark:bg-[#090d16] border-t border-slate-200/80 dark:border-slate-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-1">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Distribution & Pricing Models
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Transparent, creator-friendly pricing: Choose Revenue Share, Pro Subscription, or Label Enterprise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Model 1: Rev Share */}
            <div className="p-7 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800 space-y-5 flex flex-col justify-between shadow-sm">
              <div className="space-y-3">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Revenue Share</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold font-sans text-slate-900 dark:text-white">15%</span>
                  <span className="text-slate-500 text-xs">DigiTube Cut</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Zero upfront fee. Artist keeps 85% of net royalties. Ideal for emerging creators.
                </p>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 pt-3 border-t border-slate-200/80 dark:border-slate-800">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Unlimited releases to 150+ DSPs
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Free ISRC & UPC allocation
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> YouTube Content ID integration
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Reconciled monthly statements
                  </li>
                </ul>
              </div>
              <Link
                href="/dashboard"
                className="w-full py-2.5 rounded-lg bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold text-xs text-center transition-colors block"
              >
                Start with 85/15 Split
              </Link>
            </div>

            {/* Model 2: Artist Pro */}
            <div className="p-7 rounded-xl bg-blue-50/40 dark:bg-slate-900/90 border-2 border-blue-600 dark:border-blue-500 space-y-5 flex flex-col justify-between relative shadow-md">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-sm">
                Recommended
              </div>
              <div className="space-y-3">
                <div className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Artist Pro</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold font-mono text-slate-900 dark:text-white">₹4,999</span>
                  <span className="text-slate-500 text-xs">/ year</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Keep 100% of your royalties. Zero commission on all streaming and sales.
                </p>
                <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-200 pt-3 border-t border-blue-200 dark:border-slate-800">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> 100% Artist Royalties (0% Cut)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> Priority 24h QA Review Queue
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> Automated Collaborator Splits
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> Daily provisional streaming trends
                  </li>
                </ul>
              </div>
              <Link
                href="/dashboard"
                className="btn-primary w-full py-2.5 text-xs text-center block"
              >
                Choose Artist Pro
              </Link>
            </div>

            {/* Model 3: Label Enterprise */}
            <div className="p-7 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800 space-y-5 flex flex-col justify-between shadow-sm">
              <div className="space-y-3">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Record Label</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold font-mono text-slate-900 dark:text-white">₹19,999</span>
                  <span className="text-slate-500 text-xs">/ year</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Manage multiple artists, custom sub-labels, and dedicated DDEX delivery batching.
                </p>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 pt-3 border-t border-slate-200/80 dark:border-slate-800">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Unlimited Signed Artists & Roster
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Custom Record Label Imprints
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Scoped Staff Permission Accounts
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Dedicated Account Manager
                  </li>
                </ul>
              </div>
              <Link
                href="/dashboard/label"
                className="w-full py-2.5 rounded-lg bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold text-xs text-center transition-colors block"
              >
                Open Label Workspace
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CLIENTS & ARTIST PARTNERS SHOWCASE ================= */}
      <section className="py-20 bg-slate-50 dark:bg-[#060911] border-t border-slate-200/80 dark:border-slate-800/80 relative overflow-hidden transition-colors">
        {/* Ambient background soft light blurs */}
        <div className="absolute top-1/4 left-[-100px] w-96 h-96 rounded-full bg-blue-500/10 dark:bg-blue-600/10 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-[-100px] w-96 h-96 rounded-full bg-purple-500/10 dark:bg-purple-600/10 blur-[130px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/60 text-xs font-semibold tracking-wide">
              <Award className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Verified Client Catalog Network</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
              Trusted by 500+ Record Labels & 10,000+ Independent Artists
            </h2>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Powering prominent regional powerhouses, Bollywood indies, devotional music creators, and global chart-toppers across India. Fast automated DDEX ingestion and reliable Indian banking settlements.
            </p>
          </div>

          {/* Scale Impact Metrics Counter */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            <div className="p-5 rounded-2xl bg-white dark:bg-[#0b101d] border border-slate-200/90 dark:border-slate-800 shadow-sm text-center space-y-1">
              <div className="text-2xl sm:text-3xl font-bold font-sans text-blue-600 dark:text-blue-400">
                15,000+
              </div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Releases Ingested</div>
              <div className="text-[11px] text-slate-400">Delivered across 150+ DSPs</div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#0b101d] border border-slate-200/90 dark:border-slate-800 shadow-sm text-center space-y-1">
              <div className="text-2xl sm:text-3xl font-bold font-sans text-purple-600 dark:text-purple-400">
                650M+
              </div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Monthly Streams</div>
              <div className="text-[11px] text-slate-400">Audio & YouTube CID Views</div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#0b101d] border border-slate-200/90 dark:border-slate-800 shadow-sm text-center space-y-1">
              <div className="text-2xl sm:text-3xl font-mono font-bold text-emerald-600 dark:text-emerald-400">
                ₹18.4 Cr+
              </div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Royalties Distributed</div>
              <div className="text-[11px] text-slate-400">Direct NEFT & UPI Settlements</div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#0b101d] border border-slate-200/90 dark:border-slate-800 shadow-sm text-center space-y-1">
              <div className="text-2xl sm:text-3xl font-bold font-sans text-amber-600 dark:text-amber-400">
                24 Hours
              </div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Average Turnaround</div>
              <div className="text-[11px] text-slate-400">Automated QA Inspection</div>
            </div>
          </div>

          {/* Client & Artist Partner Showcase Cards Grid */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Featured Labels & Creators Working With DigiTube
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Real catalogs actively distributed and earning royalties via DigiTube DDEX.
                </p>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-semibold">
                <Users className="w-3.5 h-3.5" /> 500+ Active Imprints
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {clientRoster.map((client, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-white dark:bg-[#0c1220] border border-slate-200/90 dark:border-slate-800 hover:border-blue-500/80 transition-all p-4 space-y-4 shadow-sm group hover:-translate-y-1"
                >
                  {/* Photo & Badge */}
                  <div className="relative h-44 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900">
                    <img
                      src={client.avatar}
                      alt={client.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    
                    {/* Badge */}
                    <div className="absolute top-2.5 right-2.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900/80 text-white backdrop-blur-md border border-white/20">
                        {client.badge}
                      </span>
                    </div>

                    <div className="absolute bottom-2.5 left-2.5 right-2.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-blue-300 font-bold block">
                        {client.type}
                      </span>
                      <h4 className="text-sm font-bold text-white leading-tight truncate">
                        {client.name}
                      </h4>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px]">
                      <span>Genre:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{client.genre}</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px]">
                      <span>Region:</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">{client.region}</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#070b14] border border-slate-100 dark:border-slate-800/80 space-y-1">
                      <div className="text-[10px] font-semibold text-slate-400 uppercase">Catalog Scale</div>
                      <div className="text-[11px] font-bold text-slate-900 dark:text-white truncate">
                        {client.stats}
                      </div>
                      <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                        {client.metric}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonials From Actual Founders & Artists */}
          <div className="space-y-6 pt-4">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                What Creators Say About DigiTube
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Direct feedback from label heads and independent musicians scaling their catalogs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-white dark:bg-[#0c1220] border border-slate-200/90 dark:border-slate-800 p-6 space-y-4 shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Stars */}
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>

                    {/* Quote */}
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <img
                      src={t.avatar}
                      alt={t.author}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <div className="min-w-0 flex-1 text-xs">
                      <div className="font-bold text-slate-900 dark:text-white truncate flex items-center gap-1">
                        <span>{t.author}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {t.role} • {t.company}
                      </div>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-semibold">
                        {t.stats}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* High-Impact Pre-Footer CTA */}
          <div className="rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
            
            <div className="relative z-10 max-w-3xl space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Zero Onboarding Delay • Automated Verification</span>
              </div>

              <h3 className="text-2xl sm:text-4xl font-display font-bold tracking-tight leading-tight">
                Ready to Distribute Your Next Track to 150+ Digital Stores Worldwide?
              </h3>

              <p className="text-xs sm:text-sm text-blue-100 leading-relaxed max-w-2xl">
                Deliver sound recordings to Spotify, Apple Music, YouTube Music, JioSaavn, and Instagram Reels in minutes. Keep 100% of your master rights and receive monthly direct bank transfers.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <Link
                  href="/dashboard/releases/new"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white text-blue-900 hover:bg-blue-50 font-bold text-xs inline-flex items-center justify-center gap-2 transition-all shadow-lg"
                >
                  <Disc3 className="w-4 h-4 text-blue-600" />
                  <span>Start 9-Step Release Wizard</span>
                </Link>

                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/15 hover:bg-white/20 text-white font-semibold text-xs inline-flex items-center justify-center gap-2 backdrop-blur-md transition-all border border-white/20"
                >
                  <span>Open Artist Backstage</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="https://wa.me/919899708677?text=Hi%20DigiTube%20Team%2C%20I%20want%20to%20distribute%20my%20music"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-500/90 hover:bg-emerald-500 text-white font-semibold text-xs inline-flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Ingestion Desk</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
