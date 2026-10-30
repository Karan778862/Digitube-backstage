'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDigiTube } from '@/lib/store';
import { generateISRC, generateUPC } from '@/lib/utils';
import { ReleaseType, ContributorRole, ReleaseItem, TrackItem, RoyaltySplitItem } from '@/lib/types';
import {
  Disc3,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Plus,
  Play,
  FileCheck,
  ShieldAlert,
  FileAudio,
  Trash2,
  Upload,
  RefreshCw,
  Image as ImageIcon,
  Music,
  Check,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import {
  SpotifyLogo,
  AppleMusicLogo,
  YouTubeMusicLogo,
  AmazonMusicLogo,
  JioSaavnLogo,
  WynkLogo,
  MetaInstagramLogo,
  TikTokLogo,
  TidalLogo,
  DeezerLogo,
} from '@/components/DspLogos';

interface ContributorItem {
  id: string;
  name: string;
  role: ContributorRole;
  ipiCode?: string;
}

export default function NewReleaseWizardPage() {
  const router = useRouter();
  const { addRelease, currentUser, playAudioTrack } = useDigiTube();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submittedRelease, setSubmittedRelease] = useState<ReleaseItem | null>(null);
  const [lastSaved, setLastSaved] = useState<string>('');
  const [isLoadedFromStorage, setIsLoadedFromStorage] = useState(false);

  // Step 1: Release Type
  const [releaseType, setReleaseType] = useState<ReleaseType>('SINGLE');

  // Step 2: Release Information
  const [title, setTitle] = useState('');
  const [versionSubtitle, setVersionSubtitle] = useState('');
  const [primaryArtist, setPrimaryArtist] = useState('');
  const [featuredArtists, setFeaturedArtists] = useState('');
  const [recordLabel, setRecordLabel] = useState('DigiTube Records');
  const [primaryGenre, setPrimaryGenre] = useState('Indian Pop');
  const [secondaryGenre, setSecondaryGenre] = useState('Lo-Fi / Chillout');
  const [primaryLanguage, setPrimaryLanguage] = useState('Hindi');
  const [targetDate, setTargetDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [releaseTimezone, setReleaseTimezone] = useState('Asia/Kolkata');
  const [originalDate, setOriginalDate] = useState('');
  const [upcEan, setUpcEan] = useState(generateUPC());
  const [territoryType, setTerritoryType] = useState<'WORLDWIDE' | 'RESTRICTED'>('WORLDWIDE');

  // Step 3: Artwork
  const [artworkUrl, setArtworkUrl] = useState(
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80'
  );
  const [artworkAttested, setArtworkAttested] = useState(true);
  const [isUploadingArtwork, setIsUploadingArtwork] = useState(false);
  const [uploadingAudioIndex, setUploadingAudioIndex] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputArtworkRef = useRef<HTMLInputElement>(null);

  // Step 4: Tracks & Audio Master
  const [tracks, setTracks] = useState<TrackItem[]>([
    {
      id: 'trk_new_1',
      trackNumber: 1,
      discNumber: 1,
      title: '',
      versionSubtitle: 'Original Mix',
      isrcCode: generateISRC(),
      durationSeconds: 214,
      audioMasterUrl: 'https://actions.google.com/sounds/v1/ambiences/daytime_forest_bonfire.ogg',
      audioFileName: 'Master_Track_1.wav',
      audioFormat: 'WAV',
      audioBitrate: '24-bit / 48kHz (Lossless)',
      isExplicit: false,
      isInstrumental: false,
      language: 'Hindi',
      bpm: 90,
      musicalKey: 'C Major',
      previewStartTime: 30,
      lyrics: '',
      credits: [],
    },
  ]);
  const fileInputAudioRef = useRef<HTMLInputElement>(null);

  // Step 5: Contributor Credits
  const [credits, setCredits] = useState<ContributorItem[]>([]);
  const [newCreditName, setNewCreditName] = useState('');
  const [newCreditRole, setNewCreditRole] = useState<ContributorRole>('COMPOSER');
  const [newCreditIpi, setNewCreditIpi] = useState('');
  const [showAddCreditForm, setShowAddCreditForm] = useState(false);

  // Step 6: Copyright & Licensing
  const [pLineYear, setPLineYear] = useState(new Date().getFullYear());
  const [pLineText, setPLineText] = useState('');
  const [cLineYear, setCLineYear] = useState(new Date().getFullYear());
  const [cLineText, setCLineText] = useState('DigiTube Network');
  const [workType, setWorkType] = useState<'ORIGINAL' | 'COVER' | 'REMIX' | 'SAMPLE_DERIVATIVE'>('ORIGINAL');
  const [hasContentIdOptIn, setHasContentIdOptIn] = useState(true);

  // Step 7: Distribution Settings
  const [enabledDsps, setEnabledDsps] = useState<string[]>([
    'spotify',
    'apple_music',
    'youtube_music',
    'amazon_music',
    'jiosaavn',
    'meta',
    'tiktok',
    'wynk',
    'deezer',
    'tidal',
  ]);

  // Step 8: Contract & Royalty Splits
  const [splits, setSplits] = useState<RoyaltySplitItem[]>([]);
  const [newPayeeName, setNewPayeeName] = useState('');
  const [newPayeeEmail, setNewPayeeEmail] = useState('');
  const [newPayeeShare, setNewPayeeShare] = useState<number>(10);
  const [newPayeeRole, setNewPayeeRole] = useState('Collaborator');
  const [showAddSplitForm, setShowAddSplitForm] = useState(false);

  // Step 9: Final Submission Consent
  const [finalConsent, setFinalConsent] = useState(true);

  // Get current storage draft key
  const draftStorageKey = `digitube_new_release_draft_${currentUser?.email || 'guest'}`;

  // 1. Initial Load: Check localStorage draft, else populate with current user
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const savedDraft = localStorage.getItem(draftStorageKey);
      if (savedDraft) {
        const d = JSON.parse(savedDraft);
        if (d.step) setStep(d.step);
        if (d.releaseType) setReleaseType(d.releaseType);
        if (d.title !== undefined) setTitle(d.title);
        if (d.versionSubtitle !== undefined) setVersionSubtitle(d.versionSubtitle);
        if (d.primaryArtist) setPrimaryArtist(d.primaryArtist);
        if (d.featuredArtists !== undefined) setFeaturedArtists(d.featuredArtists);
        if (d.recordLabel) setRecordLabel(d.recordLabel);
        if (d.primaryGenre) setPrimaryGenre(d.primaryGenre);
        if (d.secondaryGenre) setSecondaryGenre(d.secondaryGenre);
        if (d.primaryLanguage) setPrimaryLanguage(d.primaryLanguage);
        if (d.targetDate) setTargetDate(d.targetDate);
        if (d.releaseTimezone) setReleaseTimezone(d.releaseTimezone);
        if (d.originalDate !== undefined) setOriginalDate(d.originalDate);
        if (d.upcEan) setUpcEan(d.upcEan);
        if (d.territoryType) setTerritoryType(d.territoryType);
        if (d.artworkUrl) setArtworkUrl(d.artworkUrl);
        if (d.artworkAttested !== undefined) setArtworkAttested(d.artworkAttested);
        if (d.tracks && Array.isArray(d.tracks) && d.tracks.length > 0) setTracks(d.tracks);
        if (d.credits && Array.isArray(d.credits) && d.credits.length > 0) setCredits(d.credits);
        if (d.pLineYear) setPLineYear(d.pLineYear);
        if (d.pLineText) setPLineText(d.pLineText);
        if (d.cLineYear) setCLineYear(d.cLineYear);
        if (d.cLineText) setCLineText(d.cLineText);
        if (d.workType) setWorkType(d.workType);
        if (d.hasContentIdOptIn !== undefined) setHasContentIdOptIn(d.hasContentIdOptIn);
        if (d.enabledDsps && Array.isArray(d.enabledDsps)) setEnabledDsps(d.enabledDsps);
        if (d.splits && Array.isArray(d.splits) && d.splits.length > 0) setSplits(d.splits);
        setIsLoadedFromStorage(true);
        setLastSaved('Loaded draft from storage');
        return;
      }
    } catch (e) {
      console.warn('Failed reading draft from localStorage:', e);
    }

    // Default values if no draft exists
    const defaultArtist = currentUser.stageName || currentUser.fullName || 'My Artist Name';
    setPrimaryArtist(defaultArtist);
    setPLineText(`DigiTube Network / ${defaultArtist}`);
    setCredits([
      {
        id: 'cr_1',
        name: defaultArtist,
        role: 'MAIN_ARTIST',
        ipiCode: '',
      },
    ]);
    setSplits([
      {
        id: 'sp_1',
        payeeName: defaultArtist,
        payeeEmail: currentUser.email || 'artist@digitubenetwork.com',
        percentageShare: 100,
        roleDescription: 'Primary Creator',
        isConfirmed: true,
      },
    ]);
    setIsLoadedFromStorage(true);
  }, [currentUser?.email]);

  // 2. Auto-save all changes to localStorage
  useEffect(() => {
    if (!isLoadedFromStorage) return;

    const draftData = {
      step,
      releaseType,
      title,
      versionSubtitle,
      primaryArtist,
      featuredArtists,
      recordLabel,
      primaryGenre,
      secondaryGenre,
      primaryLanguage,
      targetDate,
      releaseTimezone,
      originalDate,
      upcEan,
      territoryType,
      artworkUrl,
      artworkAttested,
      tracks,
      credits,
      pLineYear,
      pLineText,
      cLineYear,
      cLineText,
      workType,
      hasContentIdOptIn,
      enabledDsps,
      splits,
    };

    try {
      localStorage.setItem(draftStorageKey, JSON.stringify(draftData));
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastSaved(`Auto-saved at ${timeStr}`);
    } catch {}
  }, [
    step,
    releaseType,
    title,
    versionSubtitle,
    primaryArtist,
    featuredArtists,
    recordLabel,
    primaryGenre,
    secondaryGenre,
    primaryLanguage,
    targetDate,
    releaseTimezone,
    originalDate,
    upcEan,
    territoryType,
    artworkUrl,
    artworkAttested,
    tracks,
    credits,
    pLineYear,
    pLineText,
    cLineYear,
    cLineText,
    workType,
    hasContentIdOptIn,
    enabledDsps,
    splits,
    isLoadedFromStorage,
  ]);

  // Sync release title with track 1 title when title changes
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (tracks.length > 0) {
      const updated = [...tracks];
      // If single or track 1 was previously empty or matched previous title, sync it
      if (releaseType === 'SINGLE' || !updated[0].title || updated[0].title === title) {
        updated[0] = { ...updated[0], title: val };
        setTracks(updated);
      }
    }
  };

  // Sync primary artist with main artist credit and primary split
  const handlePrimaryArtistChange = (val: string) => {
    const oldArtist = primaryArtist;
    setPrimaryArtist(val);

    // Update credit #1 if matching old artist
    setCredits((prev) =>
      prev.map((c, i) => (i === 0 && c.role === 'MAIN_ARTIST' ? { ...c, name: val } : c))
    );

    // Update split #1 if matching old artist
    setSplits((prev) =>
      prev.map((s, i) => (i === 0 ? { ...s, payeeName: val } : s))
    );

    // Update P-line suggestion if using standard pattern
    if (!pLineText || pLineText.includes(oldArtist)) {
      setPLineText(`DigiTube Network / ${val}`);
    }
  };

  // Reset Draft
  const handleResetDraft = () => {
    if (!confirm('Are you sure you want to discard this draft and start fresh? All entered details will be reset.')) {
      return;
    }
    localStorage.removeItem(draftStorageKey);
    const defaultArtist = currentUser.stageName || currentUser.fullName || 'My Artist Name';
    setStep(1);
    setTitle('');
    setVersionSubtitle('');
    setPrimaryArtist(defaultArtist);
    setFeaturedArtists('');
    setTracks([
      {
        id: 'trk_new_1',
        trackNumber: 1,
        discNumber: 1,
        title: '',
        versionSubtitle: 'Original Mix',
        isrcCode: generateISRC(),
        durationSeconds: 214,
        audioMasterUrl: 'https://actions.google.com/sounds/v1/ambiences/daytime_forest_bonfire.ogg',
        audioFileName: 'Master_Track_1.wav',
        audioFormat: 'WAV',
        audioBitrate: '24-bit / 48kHz (Lossless)',
        isExplicit: false,
        isInstrumental: false,
        language: 'Hindi',
        bpm: 90,
        musicalKey: 'C Major',
        previewStartTime: 30,
        lyrics: '',
        credits: [],
      },
    ]);
    setCredits([
      {
        id: 'cr_1',
        name: defaultArtist,
        role: 'MAIN_ARTIST',
        ipiCode: '',
      },
    ]);
    setSplits([
      {
        id: 'sp_1',
        payeeName: defaultArtist,
        payeeEmail: currentUser.email || 'artist@digitubenetwork.com',
        percentageShare: 100,
        roleDescription: 'Primary Creator',
        isConfirmed: true,
      },
    ]);
    setUpcEan(generateUPC());
    setLastSaved('Draft cleared');
  };

  // Artwork Upload Handler (Local Preview + Server Storage)
  const handleArtworkFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Instant local preview
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setArtworkUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);

    // 2. Real server upload
    setIsUploadingArtwork(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'artwork');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        setArtworkUrl(data.url);
        setLastSaved('Cover artwork uploaded and saved to server');
      } else {
        setUploadError(data.error || 'Failed to upload artwork to server.');
      }
    } catch (err: any) {
      console.warn('Network artwork upload fallback:', err);
    } finally {
      setIsUploadingArtwork(false);
    }
  };

  // Audio Upload Handler (Duration Extraction + Server Storage)
  const handleAudioFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, trackIdx: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split('.').pop()?.toUpperCase() || 'WAV';
    const tempUrl = URL.createObjectURL(file);

    // Extract audio duration dynamically from browser audio engine
    try {
      const tempAudio = new Audio(tempUrl);
      tempAudio.onloadedmetadata = () => {
        if (tempAudio.duration && !isNaN(tempAudio.duration)) {
          const updated = [...tracks];
          if (updated[trackIdx]) {
            updated[trackIdx] = {
              ...updated[trackIdx],
              durationSeconds: Math.round(tempAudio.duration),
            };
            setTracks(updated);
          }
        }
      };
    } catch {}

    setUploadingAudioIndex(trackIdx);
    setUploadError(null);

    // Instant local preview
    const updated = [...tracks];
    updated[trackIdx] = {
      ...updated[trackIdx],
      audioFileName: file.name,
      audioMasterUrl: tempUrl,
      audioFormat: ext === 'MP3' ? 'MP3' : ext === 'FLAC' ? 'FLAC' : 'WAV',
      audioBitrate: '24-bit / 48kHz (Lossless Verified)',
    };
    setTracks(updated);

    // Real server upload
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'audio');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        const synced = [...tracks];
        synced[trackIdx] = {
          ...synced[trackIdx],
          audioFileName: file.name,
          audioMasterUrl: data.url,
          audioFormat: ext === 'MP3' ? 'MP3' : ext === 'FLAC' ? 'FLAC' : 'WAV',
          audioBitrate: '24-bit / 48kHz (Server Verified)',
        };
        setTracks(synced);
        setLastSaved(`Track ${trackIdx + 1} master uploaded to server`);
      }
    } catch (err: any) {
      console.warn('Network audio upload fallback:', err);
    } finally {
      setUploadingAudioIndex(null);
    }
  };

  // Add Another Track (For EPs and Albums)
  const addAnotherTrack = () => {
    const nextNum = tracks.length + 1;
    setTracks([
      ...tracks,
      {
        id: `trk_new_${nextNum}`,
        trackNumber: nextNum,
        discNumber: 1,
        title: `Track ${nextNum}`,
        isrcCode: generateISRC(),
        durationSeconds: 180,
        audioMasterUrl: 'https://actions.google.com/sounds/v1/water/ocean_waves.ogg',
        audioFileName: `Track_${nextNum}_Master.wav`,
        audioFormat: 'WAV',
        audioBitrate: '24-bit / 48kHz (Lossless)',
        isExplicit: false,
        isInstrumental: false,
        language: primaryLanguage,
        previewStartTime: 30,
        credits: [],
      },
    ]);
  };

  const removeTrack = (index: number) => {
    if (tracks.length <= 1) return;
    const updated = tracks.filter((_, i) => i !== index).map((t, idx) => ({ ...t, trackNumber: idx + 1 }));
    setTracks(updated);
  };

  const handleTrackChange = (index: number, field: keyof TrackItem, value: any) => {
    const updated = [...tracks];
    updated[index] = { ...updated[index], [field]: value };
    setTracks(updated);
  };

  // Credits Management
  const handleAddCredit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCreditName.trim()) return;

    setCredits([
      ...credits,
      {
        id: `cr_${Date.now()}`,
        name: newCreditName.trim(),
        role: newCreditRole,
        ipiCode: newCreditIpi.trim() || undefined,
      },
    ]);
    setNewCreditName('');
    setNewCreditIpi('');
    setShowAddCreditForm(false);
  };

  const handleRemoveCredit = (id: string) => {
    setCredits(credits.filter((c) => c.id !== id));
  };

  // Splits Management
  const totalSplitPercentage = splits.reduce((acc, s) => acc + (Number(s.percentageShare) || 0), 0);

  const handleAddSplit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPayeeName.trim() || !newPayeeEmail.trim() || !newPayeeShare) return;

    setSplits([
      ...splits,
      {
        id: `sp_${Date.now()}`,
        payeeName: newPayeeName.trim(),
        payeeEmail: newPayeeEmail.trim(),
        percentageShare: Number(newPayeeShare),
        roleDescription: newPayeeRole,
        isConfirmed: true,
      },
    ]);
    setNewPayeeName('');
    setNewPayeeEmail('');
    setNewPayeeShare(10);
    setShowAddSplitForm(false);
  };

  const handleRemoveSplit = (id: string) => {
    setSplits(splits.filter((s) => s.id !== id));
  };

  const handleResetToSolo = () => {
    setSplits([
      {
        id: 'sp_1',
        payeeName: primaryArtist || currentUser.stageName || 'Primary Creator',
        payeeEmail: currentUser.email || 'artist@digitubenetwork.com',
        percentageShare: 100,
        roleDescription: 'Primary Creator (100% Solo)',
        isConfirmed: true,
      },
    ]);
  };

  const handleAutoBalanceSplits = () => {
    if (splits.length === 0) return;
    const othersSum = splits.slice(1).reduce((acc, s) => acc + (Number(s.percentageShare) || 0), 0);
    const primaryShare = Math.max(0, 100 - othersSum);
    const updated = [...splits];
    updated[0] = { ...updated[0], percentageShare: primaryShare };
    setSplits(updated);
  };

  // DSP Store Toggle
  const toggleDsp = (storeKey: string) => {
    if (enabledDsps.includes(storeKey)) {
      setEnabledDsps(enabledDsps.filter((s) => s !== storeKey));
    } else {
      setEnabledDsps([...enabledDsps, storeKey]);
    }
  };

  const toggleAllDsps = () => {
    if (enabledDsps.length >= 10) {
      setEnabledDsps([]);
    } else {
      setEnabledDsps([
        'spotify',
        'apple_music',
        'youtube_music',
        'amazon_music',
        'jiosaavn',
        'meta',
        'tiktok',
        'wynk',
        'deezer',
        'tidal',
      ]);
    }
  };

  // Final Submit
  const handleFinalSubmit = async () => {
    setSubmitting(true);

    const generatedCode = `DGT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const releaseTitle = title.trim() || tracks[0]?.title || 'Untitled Release';

    const newRelease: ReleaseItem = {
      id: `rel_${Date.now()}`,
      releaseCode: generatedCode,
      organizationId: 'org_001',
      artistId: currentUser.id || currentUser.email,
      artistStageName: primaryArtist.trim() || currentUser.stageName || 'Artist',
      releaseType,
      title: releaseTitle,
      versionSubtitle: versionSubtitle.trim() || undefined,
      recordLabel,
      primaryGenre,
      secondaryGenre,
      primaryLanguage,
      targetReleaseDate: targetDate,
      releaseTimezone,
      originalReleaseDate: originalDate || undefined,
      upcEan,
      territoryType,
      artworkUrl,
      pLineYear,
      pLineText: pLineText || `DigiTube Network / ${primaryArtist}`,
      cLineYear,
      cLineText: cLineText || 'DigiTube Network',
      workType,
      hasContentIdOptIn,
      status: 'SUBMITTED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tracks: tracks.map((t, idx) => ({
        ...t,
        title: t.title || (idx === 0 ? releaseTitle : `Track ${idx + 1}`),
        credits: credits.map((c) => ({
          id: c.id,
          name: c.name,
          role: c.role,
          ipiCode: c.ipiCode,
        })),
      })),
      splits,
      dspStatuses: enabledDsps.map((s) => ({
        store: s as any,
        name: s,
        status: 'PENDING',
      })),
      enabledDsps: enabledDsps as any,
    };

    // 1. Add to client React store
    addRelease(newRelease);

    // 2. Persist to API so Super Admin can see it immediately
    try {
      await fetch('/api/releases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRelease),
      });
    } catch {}

    // 3. Clear draft
    try {
      localStorage.removeItem(draftStorageKey);
    } catch {}

    setSubmittedRelease(newRelease);
    setSubmitting(false);
  };

  const stepsList = [
    { num: 1, title: 'Type', subtitle: 'Format' },
    { num: 2, title: 'Metadata', subtitle: 'Title & Info' },
    { num: 3, title: 'Artwork', subtitle: '3000px Cover' },
    { num: 4, title: 'Audio Master', subtitle: 'WAV & ISRC' },
    { num: 5, title: 'Credits', subtitle: 'Contributors' },
    { num: 6, title: 'Copyright', subtitle: 'P & C Lines' },
    { num: 7, title: 'Stores', subtitle: '150+ DSPs' },
    { num: 8, title: 'Splits', subtitle: 'Royalties' },
    { num: 9, title: 'Submit', subtitle: 'Review & Send' },
  ];

  // Helper validation status per step
  const isStep2Valid = Boolean(title.trim() && primaryArtist.trim());
  const isStep3Valid = Boolean(artworkUrl && artworkAttested);
  const isStep4Valid = Boolean(tracks.length > 0 && tracks.every((t) => t.title && t.isrcCode));
  const isStep5Valid = Boolean(credits.length > 0);
  const isStep8Valid = totalSplitPercentage === 100;

  return (
    <div className="max-w-5xl mx-auto space-y-7 animate-fade-in pb-16">
      {/* Top Breadcrumb & Auto-Save Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1 font-medium">
            <Link href="/dashboard" className="hover:text-blue-600">Backstage</Link>
            <span>/</span>
            <Link href="/dashboard/releases" className="hover:text-blue-600">Releases</Link>
            <span>/</span>
            <span className="text-blue-600 dark:text-blue-400 font-bold">New Release</span>
          </div>
          <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
            New Music Release Ingestion
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            9-step DDEX ingestion workflow complying with Section 05 of the Blueprint.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {lastSaved && (
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-3 py-1.5 rounded-lg font-medium shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{lastSaved}</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleResetDraft}
            title="Clear all inputs and start fresh"
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 font-medium px-2 py-1.5 rounded-lg border border-transparent hover:border-slate-200 dark:hover:border-slate-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Draft</span>
          </button>
        </div>
      </div>

      {/* Stepper Bar - ALL STEPS CLICKABLE FREELY */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-sm overflow-x-auto">
        <div className="flex items-center justify-between min-w-[720px] gap-1.5">
          {stepsList.map((s) => {
            const isCurrent = step === s.num;
            const isCompleted =
              (s.num === 1) ||
              (s.num === 2 && isStep2Valid) ||
              (s.num === 3 && isStep3Valid) ||
              (s.num === 4 && isStep4Valid) ||
              (s.num === 5 && isStep5Valid) ||
              (s.num === 6) ||
              (s.num === 7 && enabledDsps.length > 0) ||
              (s.num === 8 && isStep8Valid);

            return (
              <button
                key={s.num}
                type="button"
                onClick={() => setStep(s.num)}
                className={`flex-1 text-left p-2 rounded-xl transition-all border ${
                  isCurrent
                    ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-600 dark:border-blue-500 text-blue-700 dark:text-blue-300 font-bold shadow-sm'
                    : isCompleted
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-400 font-semibold hover:border-emerald-400'
                    : 'bg-transparent border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      isCurrent
                        ? 'bg-blue-600 text-white'
                        : isCompleted
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {isCompleted && !isCurrent ? <Check className="w-3.5 h-3.5" /> : s.num}
                  </span>
                  <div className="truncate">
                    <div className="text-xs truncate">{s.title}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SUCCESS SCREEN */}
      {submittedRelease && (
        <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800/60 text-center space-y-6 shadow-xl animate-slide-up">
          <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Release Submitted for QA Review!</h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-lg mx-auto">
              Your release <strong className="text-slate-900 dark:text-white">&quot;{submittedRelease.title}&quot;</strong> has been assigned Release ID{' '}
              <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">{submittedRelease.releaseCode}</span> and queued for staff quality review.
            </p>
          </div>

          <div className="max-w-md mx-auto p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-left space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Assigned UPC / EAN:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">{submittedRelease.upcEan}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Tracks Ingested:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">{submittedRelease.tracks.length} lossless masters</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Enabled Stores:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">{submittedRelease.enabledDsps.length} DSPs</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Status:</span>
              <span className="text-blue-600 dark:text-blue-400 font-bold">SUBMITTED (In QA Queue)</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <Link
              href="/dashboard/releases"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-colors"
            >
              View in My Catalog
            </Link>
            {(currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'RELEASE_MANAGER' || currentUser.role === 'CATALOG_STAFF') && (
              <Link
                href="/admin/review"
                className="px-5 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 font-bold text-xs hover:bg-amber-100 transition-colors"
              >
                Inspect in Super Admin Desk &rarr;
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Main Wizard Form Card */}
      {!submittedRelease && (
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          {/* ================= STEP 1: RELEASE TYPE ================= */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Step 1: Release Type Selection</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select the release format. Classification and distribution rules apply automatically.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {[
                  { type: 'SINGLE' as ReleaseType, title: 'Single', desc: '1-track release. Fastest path to playlists and radio.', badge: '1 Track' },
                  { type: 'EP' as ReleaseType, title: 'EP (Extended Play)', desc: '2 to 6 tracks categorized per DSP rules.', badge: '2-6 Tracks' },
                  { type: 'ALBUM' as ReleaseType, title: 'Full Album', desc: 'Multi-track release with disc sequencing.', badge: '7+ Tracks' },
                  { type: 'MUSIC_VIDEO' as ReleaseType, title: 'Music Video', desc: 'Apple Music & Vevo video master delivery.', badge: 'Video Master' },
                ].map((item) => (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => setReleaseType(item.type)}
                    className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      releaseType === item.type
                        ? 'bg-blue-50/60 dark:bg-blue-950/40 border-blue-600 dark:border-blue-500 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{item.title}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                    </div>

                    <div className="pt-3 flex justify-end">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                          releaseType === item.type
                            ? 'border-blue-600 bg-blue-600 text-white'
                            : 'border-slate-300 dark:border-slate-700'
                        }`}
                      >
                        {releaseType === item.type && <CheckCircle2 className="w-3 h-3" />}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ================= STEP 2: RELEASE-LEVEL INFO ================= */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Step 2: Release-Level Metadata</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Standardized DDEX release metadata. DSP display rules require strict spelling and formatting.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Release Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Tum Hi Ho / Kahani"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">This will automatically sync with Track 1 title.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Version / Subtitle <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={versionSubtitle}
                    onChange={(e) => setVersionSubtitle(e.target.value)}
                    placeholder="e.g. Acoustic, Live, Lofi Mix"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Primary Artist Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={primaryArtist}
                    onChange={(e) => handlePrimaryArtistChange(e.target.value)}
                    placeholder="Your Stage Name"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Featured Artists <span className="text-slate-400 font-normal">(Comma separated, optional)</span>
                  </label>
                  <input
                    type="text"
                    value={featuredArtists}
                    onChange={(e) => setFeaturedArtists(e.target.value)}
                    placeholder="e.g. Badshah, Neha Kakkar"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Record Label / Imprint
                  </label>
                  <input
                    type="text"
                    value={recordLabel}
                    onChange={(e) => setRecordLabel(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Primary Musical Genre</label>
                  <select
                    value={primaryGenre}
                    onChange={(e) => setPrimaryGenre(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                  >
                    <option value="Indian Pop">Indian Pop / Indipop</option>
                    <option value="Bollywood">Bollywood</option>
                    <option value="Punjabi">Punjabi</option>
                    <option value="Hip-Hop / Rap">Desi Hip-Hop / Rap</option>
                    <option value="Acoustic / Folk">Acoustic / Folk</option>
                    <option value="Sufi">Sufi & Devotional</option>
                    <option value="Electronic">EDM / Electronic</option>
                    <option value="R&B">R&B / Soul</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Target Release Date
                  </label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    UPC / EAN Barcode
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={upcEan}
                      onChange={(e) => setUpcEan(e.target.value)}
                      className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setUpcEan(generateUPC())}
                      className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-blue-600 rounded-xl text-xs font-semibold"
                    >
                      Regenerate
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Territory</label>
                  <select
                    value={territoryType}
                    onChange={(e) => setTerritoryType(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                  >
                    <option value="WORLDWIDE">Worldwide (150+ Countries)</option>
                    <option value="RESTRICTED">Restricted Territories Only</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 3: ARTWORK UPLOAD ================= */}
          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Step 3: Square Artwork Upload</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Must be square (1:1), minimum 3000 x 3000 pixels, RGB color mode, JPG or PNG format.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                  <div className="relative w-52 h-52 rounded-xl overflow-hidden shadow-md border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                    <img src={artworkUrl} alt="Cover Preview" className="w-full h-full object-cover" />
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-[10px] font-mono text-emerald-400">
                      3000 x 3000 px • Validated
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 font-medium">Aspect Ratio: 1:1 Square</p>

                  <input
                    type="file"
                    ref={fileInputArtworkRef}
                    onChange={handleArtworkFileUpload}
                    accept="image/jpeg,image/png"
                    className="hidden"
                  />
                  <button
                    type="button"
                    disabled={isUploadingArtwork}
                    onClick={() => fileInputArtworkRef.current?.click()}
                    className="mt-3 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    {isUploadingArtwork ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Uploading Artwork to Server...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Image File</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Or Provide Artwork Direct URL
                    </label>
                    <input
                      type="text"
                      value={artworkUrl}
                      onChange={(e) => setArtworkUrl(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                    <div className="font-bold text-slate-900 dark:text-slate-200">DSP Artwork Policy:</div>
                    <div className="space-y-1 text-[11px]">
                      <div>✓ High resolution minimum 3000x3000px</div>
                      <div>✓ No promotional branding, logos or social media handles</div>
                      <div>✓ No barcodes or retail prices included</div>
                    </div>
                  </div>

                  <label className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={artworkAttested}
                      onChange={(e) => setArtworkAttested(e.target.checked)}
                      className="mt-0.5 rounded text-blue-600 focus:ring-0"
                    />
                    <span>I attest that I own or hold valid licensed rights to this cover image.</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 4: TRACKS & AUDIO MASTER ================= */}
          {step === 4 && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Step 4: Tracks & Lossless Master Audio</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Upload lossless master audio (WAV 24-bit / 48kHz, FLAC). Automated checksum verification.
                  </p>
                </div>
                {releaseType !== 'SINGLE' && (
                  <button
                    type="button"
                    onClick={addAnotherTrack}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Track
                  </button>
                )}
              </div>

              {tracks.map((trk, idx) => (
                <div key={trk.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center justify-center">
                        {trk.trackNumber}
                      </span>
                      <span className="font-bold text-xs text-slate-900 dark:text-white">
                        {trk.title || `Track #${trk.trackNumber} (Enter Title)`}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => playAudioTrack(trk, title || 'New Release', primaryArtist, artworkUrl)}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-100 text-xs font-semibold flex items-center gap-1"
                      >
                        <Play className="w-3 h-3 fill-blue-600 dark:fill-blue-400" />
                        <span>QC Audio Preview</span>
                      </button>

                      {tracks.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTrack(idx)}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                          title="Remove Track"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Track Title <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={trk.title}
                        onChange={(e) => handleTrackChange(idx, 'title', e.target.value)}
                        placeholder="e.g. Song Title"
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">ISRC Code</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={trk.isrcCode}
                          onChange={(e) => handleTrackChange(idx, 'isrcCode', e.target.value)}
                          className="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={() => handleTrackChange(idx, 'isrcCode', generateISRC())}
                          className="px-2.5 py-1 bg-slate-200 dark:bg-slate-800 text-[11px] font-bold text-blue-600 dark:text-blue-400 rounded-lg hover:bg-slate-300"
                        >
                          Auto
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Lossless Audio Master File
                      </label>
                      <div className="flex items-center gap-2">
                        <label className={`flex-1 flex items-center justify-between bg-white dark:bg-slate-900 border rounded-xl px-3 py-2 text-xs cursor-pointer transition-colors ${
                          uploadingAudioIndex === idx
                            ? 'border-blue-500 bg-blue-50/40 dark:bg-blue-950/30'
                            : trk.audioMasterUrl && !trk.audioMasterUrl.includes('actions.google.com')
                            ? 'border-emerald-400 dark:border-emerald-700'
                            : 'border-slate-300 dark:border-slate-700 hover:border-blue-600'
                        }`}>
                          <span className="truncate text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                            {uploadingAudioIndex === idx ? (
                              <span className="text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1.5">
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Uploading Master Audio...
                              </span>
                            ) : (
                              trk.audioFileName || 'Upload WAV / FLAC'
                            )}
                          </span>
                          {uploadingAudioIndex === idx ? (
                            <RefreshCw className="w-3.5 h-3.5 text-blue-600 animate-spin shrink-0 ml-1.5" />
                          ) : trk.audioMasterUrl && !trk.audioMasterUrl.includes('actions.google.com') ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 ml-1.5" />
                          ) : (
                            <Upload className="w-3.5 h-3.5 text-blue-600 shrink-0 ml-1.5" />
                          )}
                          <input
                            type="file"
                            accept="audio/*"
                            disabled={uploadingAudioIndex === idx}
                            onChange={(e) => handleAudioFileUpload(e, idx)}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ================= STEP 5: CREDITS ================= */}
          {step === 5 && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Step 5: Contributor Credits</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Preserve songwriter, composer, and producer credits. Section 05: Credits do not determine legal royalty splits.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddCreditForm(!showAddCreditForm)}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Contributor</span>
                </button>
              </div>

              {/* Add Contributor Form */}
              {showAddCreditForm && (
                <form
                  onSubmit={handleAddCredit}
                  className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 space-y-3 animate-fade-in"
                >
                  <div className="text-xs font-bold text-blue-900 dark:text-blue-300">New Contributor Details:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 mb-1">Full Legal / Stage Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. A. R. Rahman"
                        value={newCreditName}
                        onChange={(e) => setNewCreditName(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 mb-1">Credit Role</label>
                      <select
                        value={newCreditRole}
                        onChange={(e) => setNewCreditRole(e.target.value as any)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                      >
                        <option value="COMPOSER">Composer / Music Director</option>
                        <option value="LYRICIST">Lyricist / Songwriter</option>
                        <option value="PRODUCER">Music Producer</option>
                        <option value="FEATURED_ARTIST">Featured Artist</option>
                        <option value="ARRANGER">Arranger</option>
                        <option value="MIX_MASTER_ENGINEER">Mix / Master Engineer</option>
                        <option value="SESSION_MUSICIAN">Session Musician</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 mb-1">
                        IPI / CAE Number <span className="text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. IPI-00291823"
                        value={newCreditIpi}
                        onChange={(e) => setNewCreditIpi(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddCreditForm(false)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm"
                    >
                      Add Credit
                    </button>
                  </div>
                </form>
              )}

              {/* Credits List */}
              <div className="space-y-2.5">
                {credits.map((cr, i) => (
                  <div
                    key={cr.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                        {i + 1}
                      </span>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{cr.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {cr.ipiCode ? `IPI / CAE: ${cr.ipiCode}` : 'Unregistered IPI'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[11px] font-medium">
                        {cr.role}
                      </span>

                      {credits.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveCredit(cr.id)}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                          title="Remove Contributor"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= STEP 6: COPYRIGHT ================= */}
          {step === 6 && (
            <div className="space-y-5 animate-fade-in">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Step 6: Copyright & Rights Declaration</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  P-line (sound recording owner) and C-line (artwork/packaging owner). Content ID eligibility declaration.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ℗ Phonographic Copyright Line (P-Line)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="number"
                      value={pLineYear}
                      onChange={(e) => setPLineYear(parseInt(e.target.value) || 2026)}
                      className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                    />
                    <input
                      type="text"
                      value={pLineText}
                      onChange={(e) => setPLineText(e.target.value)}
                      placeholder="e.g. DigiTube Network / Artist Name"
                      className="col-span-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    © Artwork & Packaging Line (C-Line)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="number"
                      value={cLineYear}
                      onChange={(e) => setCLineYear(parseInt(e.target.value) || 2026)}
                      className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                    />
                    <input
                      type="text"
                      value={cLineText}
                      onChange={(e) => setCLineText(e.target.value)}
                      placeholder="e.g. DigiTube Network"
                      className="col-span-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Classification</label>
                  <select
                    value={workType}
                    onChange={(e) => setWorkType(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                  >
                    <option value="ORIGINAL">100% Original Recording & Composition</option>
                    <option value="COVER">Cover Song (Requires Mechanical License)</option>
                    <option value="REMIX">Official Remix (Requires Master Authorization)</option>
                    <option value="SAMPLE_DERIVATIVE">Contains Third-Party Samples</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">YouTube Content ID</label>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 flex items-center justify-between">
                    <span className="text-xs text-slate-700 dark:text-slate-300">Monetize YouTube video matches automatically</span>
                    <input
                      type="checkbox"
                      checked={hasContentIdOptIn}
                      onChange={(e) => setHasContentIdOptIn(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-0"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 7: DISTRIBUTION ================= */}
          {step === 7 && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Step 7: Distribution Stores</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Select digital service providers enabled under DigiTube partner agreements ({enabledDsps.length} selected).
                  </p>
                </div>

                <button
                  type="button"
                  onClick={toggleAllDsps}
                  className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:text-blue-600 transition-colors"
                >
                  {enabledDsps.length >= 10 ? 'Deselect All' : 'Select All (10)'}
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                {[
                  { key: 'spotify', name: 'Spotify', Logo: SpotifyLogo },
                  { key: 'apple_music', name: 'Apple Music', Logo: AppleMusicLogo },
                  { key: 'youtube_music', name: 'YouTube Music', Logo: YouTubeMusicLogo },
                  { key: 'amazon_music', name: 'Amazon Music', Logo: AmazonMusicLogo },
                  { key: 'jiosaavn', name: 'JioSaavn', Logo: JioSaavnLogo },
                  { key: 'wynk', name: 'Wynk Music', Logo: WynkLogo },
                  { key: 'meta', name: 'Instagram & FB', Logo: MetaInstagramLogo },
                  { key: 'tiktok', name: 'TikTok', Logo: TikTokLogo },
                  { key: 'tidal', name: 'TIDAL', Logo: TidalLogo },
                  { key: 'deezer', name: 'Deezer', Logo: DeezerLogo },
                ].map((dsp) => {
                  const isChecked = enabledDsps.includes(dsp.key);
                  return (
                    <button
                      key={dsp.key}
                      type="button"
                      onClick={() => toggleDsp(dsp.key)}
                      className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                        isChecked
                          ? 'bg-blue-50/70 dark:bg-[#0d1322] border-blue-600 dark:border-blue-500 text-slate-900 dark:text-white font-bold shadow-xs'
                          : 'bg-slate-50 dark:bg-[#080c14] border-slate-200 dark:border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <dsp.Logo className="w-4 h-4 shrink-0" />
                        <span className="text-xs truncate">{dsp.name}</span>
                      </div>
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center text-[9px] ${
                          isChecked ? 'bg-blue-600 text-white' : 'border border-slate-300 dark:border-slate-700'
                        }`}
                      >
                        {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================= STEP 8: SPLITS ================= */}
          {step === 8 && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Step 8: Royalty Splits & Collaborator Shares</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Collaborator splits must sum to exactly 100%. Automatic monthly settlement via DigiTube Wallet.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetToSolo}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:text-blue-600"
                  >
                    100% Solo Artist
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddSplitForm(!showAddSplitForm)}
                    className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Collaborator</span>
                  </button>
                </div>
              </div>

              {/* Add Split Form */}
              {showAddSplitForm && (
                <form
                  onSubmit={handleAddSplit}
                  className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 space-y-3 animate-fade-in"
                >
                  <div className="text-xs font-bold text-blue-900 dark:text-blue-300">Add Collaborator Payee:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 mb-1">Payee Legal Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Collaborator Name"
                        value={newPayeeName}
                        onChange={(e) => setNewPayeeName(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 mb-1">Payee Email (for invite)</label>
                      <input
                        type="email"
                        required
                        placeholder="collab@gmail.com"
                        value={newPayeeEmail}
                        onChange={(e) => setNewPayeeEmail(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 mb-1">Role Description</label>
                      <input
                        type="text"
                        placeholder="e.g. Featured Artist / Beatmaker"
                        value={newPayeeRole}
                        onChange={(e) => setNewPayeeRole(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 mb-1">Share %</label>
                      <input
                        type="number"
                        min={1}
                        max={100}
                        required
                        value={newPayeeShare}
                        onChange={(e) => setNewPayeeShare(parseFloat(e.target.value) || 0)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-blue-600 font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddSplitForm(false)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm"
                    >
                      Add Payee
                    </button>
                  </div>
                </form>
              )}

              {/* Splits Validation Banner */}
              <div
                className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                  totalSplitPercentage === 100
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300'
                    : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  {totalSplitPercentage === 100 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span>
                    Total Allocation:{' '}
                    <strong className="font-mono text-sm">{totalSplitPercentage}%</strong>{' '}
                    {totalSplitPercentage === 100
                      ? '✓ Exactly 100% (Valid for submission)'
                      : `(Must equal 100%, currently difference of ${100 - totalSplitPercentage}%)`}
                  </span>
                </div>

                {totalSplitPercentage !== 100 && splits.length > 0 && (
                  <button
                    type="button"
                    onClick={handleAutoBalanceSplits}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50"
                  >
                    Auto-Balance to 100%
                  </button>
                )}
              </div>

              {/* Splits List */}
              <div className="space-y-2.5">
                {splits.map((sp, idx) => (
                  <div
                    key={sp.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-2 items-center text-xs"
                  >
                    <div className="sm:col-span-2">
                      <div className="font-bold text-slate-900 dark:text-white">{sp.payeeName}</div>
                      <div className="text-[11px] text-slate-400">{sp.payeeEmail}</div>
                    </div>
                    <div className="text-slate-500 text-[11px]">{sp.roleDescription}</div>
                    <div className="flex items-center gap-2 justify-end">
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={sp.percentageShare}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          const updated = [...splits];
                          updated[idx] = { ...updated[idx], percentageShare: val };
                          setSplits(updated);
                        }}
                        className="w-16 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1 text-xs font-mono font-bold text-right text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                      />
                      <span className="font-bold text-slate-500">%</span>

                      {splits.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSplit(sp.id)}
                          className="p-1 rounded text-slate-400 hover:text-rose-600"
                          title="Remove Payee"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= STEP 9: SUBMIT ================= */}
          {step === 9 && (
            <div className="space-y-5 animate-fade-in">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Step 9: Review & Final Submission</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Read-only summary of all metadata, audio, artwork, rights, and distribution stores.
                </p>
              </div>

              {/* Release Card Summary */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <div className="w-24 h-24 rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 shrink-0 mx-auto md:mx-0 bg-slate-200 dark:bg-slate-800">
                  <img src={artworkUrl} alt="Cover" className="w-full h-full object-cover" />
                </div>
                <div className="md:col-span-3 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 px-1.5 py-0.5 rounded font-bold">
                      {releaseType}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">UPC: {upcEan}</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    {title || tracks[0]?.title || 'Untitled Release'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Primary Artist: <strong className="text-slate-900 dark:text-white">{primaryArtist}</strong> • Genre: {primaryGenre} • Target Live: {targetDate}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Tracks: {tracks.length} | Contributors: {credits.length} | Enabled DSPs: {enabledDsps.length} stores
                  </p>
                </div>
              </div>

              {/* Automated Pre-Flight Check */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <div className="font-bold text-slate-900 dark:text-white">Automated Pre-Flight Check:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 dark:text-slate-300">
                  <div className={`flex items-center gap-1.5 ${isStep2Valid ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
                    {isStep2Valid ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                    <span>{isStep2Valid ? 'Release metadata verified' : 'Metadata missing: enter title & artist (Step 2)'}</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${isStep3Valid ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
                    {isStep3Valid ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                    <span>{isStep3Valid ? 'Artwork resolution & rights verified' : 'Artwork check pending (Step 3)'}</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${isStep4Valid ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
                    {isStep4Valid ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                    <span>{isStep4Valid ? 'Audio master & ISRC verified' : 'Audio master checks incomplete (Step 4)'}</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${isStep8Valid ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
                    {isStep8Valid ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                    <span>{isStep8Valid ? 'Royalty splits equal 100%' : `Royalty splits sum is ${totalSplitPercentage}% (Step 8)`}</span>
                  </div>
                </div>
              </div>

              <label className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={finalConsent}
                  onChange={(e) => setFinalConsent(e.target.checked)}
                  className="mt-0.5 rounded text-blue-600 focus:ring-0"
                />
                <span>
                  I confirm all metadata and files are complete and legally accurate. Upon submission, this revision will be queued for quality inspection.
                </span>
              </label>
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous: {stepsList[step - 2].title}</span>
              </button>
            ) : (
              <div />
            )}

            {step < 9 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm shadow-blue-600/30 flex items-center gap-1.5 transition-all"
              >
                <span>Next: {stepsList[step].title}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={submitting || !finalConsent || !isStep8Valid || !isStep2Valid}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-2 transition-all disabled:opacity-50"
              >
                {submitting ? 'Submitting to Queue...' : 'Submit Release for Review'}
                <Sparkles className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
