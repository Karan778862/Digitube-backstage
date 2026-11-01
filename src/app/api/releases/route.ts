import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getDatabase } from '@/lib/mongodb';
import { ReleaseItem } from '@/lib/types';
import { INITIAL_RELEASES } from '@/lib/mockData';

export const dynamic = 'force-dynamic';

const LOCAL_RELEASES_FILE = path.join(process.cwd(), 'src', 'data', 'releases.json');
const TMP_RELEASES_FILE = path.join('/tmp', 'digitube_releases.json');
const DEFAULT_AUDIO_STREAM = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

declare global {
  // eslint-disable-next-line no-var
  var _digitube_releases_cache: ReleaseItem[] | undefined;
}

function normalizeTracksAudio(releases: ReleaseItem[]): ReleaseItem[] {
  return releases.map((rel) => ({
    ...rel,
    tracks: (rel.tracks || []).map((t) => ({
      ...t,
      audioMasterUrl:
        !t.audioMasterUrl || t.audioMasterUrl.includes('actions.google.com')
          ? DEFAULT_AUDIO_STREAM
          : t.audioMasterUrl,
    })),
  }));
}

function loadReleases(): ReleaseItem[] {
  // 1. Check in-memory cache first
  if (globalThis._digitube_releases_cache && globalThis._digitube_releases_cache.length > 0) {
    return globalThis._digitube_releases_cache;
  }

  // 2. Check /tmp on Vercel
  try {
    if (fs.existsSync(TMP_RELEASES_FILE)) {
      const data = fs.readFileSync(TMP_RELEASES_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const normalized = normalizeTracksAudio(parsed);
        globalThis._digitube_releases_cache = normalized;
        return normalized;
      }
    }
  } catch (err) {
    console.warn('Error reading from /tmp/digitube_releases.json:', err);
  }

  // 3. Check local bundled releases.json
  try {
    if (fs.existsSync(LOCAL_RELEASES_FILE)) {
      const data = fs.readFileSync(LOCAL_RELEASES_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const normalized = normalizeTracksAudio(parsed);
        globalThis._digitube_releases_cache = normalized;
        return normalized;
      }
    }
  } catch (err) {
    console.warn('Error reading local releases.json:', err);
  }

  // 4. Fallback to INITIAL_RELEASES
  const initial = normalizeTracksAudio(INITIAL_RELEASES);
  globalThis._digitube_releases_cache = initial;
  saveReleases(initial);
  return initial;
}

function saveReleases(releases: ReleaseItem[]): void {
  const normalized = normalizeTracksAudio(releases);
  globalThis._digitube_releases_cache = normalized;

  // Save to /tmp (always writable on Vercel and local)
  try {
    fs.writeFileSync(TMP_RELEASES_FILE, JSON.stringify(normalized, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not write to /tmp releases:', err);
  }

  // Save to local project path if writable
  try {
    const dir = path.dirname(LOCAL_RELEASES_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(LOCAL_RELEASES_FILE, JSON.stringify(normalized, null, 2), 'utf-8');
  } catch {
    // Expected on Vercel serverless read-only filesystem
  }
}

// GET /api/releases
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const all = searchParams.get('all') === 'true';

    // Try reading from MongoDB Atlas if available (with strict timeout)
    try {
      const db = await Promise.race([
        getDatabase(),
        new Promise<null>((_, reject) => setTimeout(() => reject(new Error('Atlas Timeout')), 1500)),
      ]);
      if (db) {
        const mongoReleases = await db.collection<ReleaseItem>('releases').find({}).sort({ createdAt: -1 }).toArray();
        if (mongoReleases && mongoReleases.length > 0) {
          const normalized = normalizeTracksAudio(mongoReleases);
          // Merge with current cache
          const existingIds = new Set(normalized.map((r) => r.id));
          const current = loadReleases();
          for (const cur of current) {
            if (!existingIds.has(cur.id)) {
              normalized.push(cur);
              existingIds.add(cur.id);
            }
          }
          saveReleases(normalized);
        }
      }
    } catch {}

    const releases = loadReleases();

    if (all || !email) {
      return NextResponse.json({
        success: true,
        count: releases.length,
        releases,
      }, {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const filtered = releases.filter(
      (r) =>
        (r.artistId && r.artistId.toLowerCase() === cleanEmail) ||
        (r.artistId && cleanEmail.includes(r.artistId.toLowerCase())) ||
        (r.splits && r.splits.some((s) => s.payeeEmail && s.payeeEmail.toLowerCase() === cleanEmail)) ||
        (r.artistStageName && r.artistStageName.toLowerCase().includes(cleanEmail.split('@')[0]))
    );

    return NextResponse.json({
      success: true,
      count: filtered.length,
      releases: filtered,
    }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/releases - Ingest new release
export async function POST(req: NextRequest) {
  try {
    const rawRelease: ReleaseItem = await req.json();

    if (!rawRelease || !rawRelease.id) {
      return NextResponse.json({ success: false, error: 'Invalid release payload' }, { status: 400 });
    }

    // Ensure tracks have valid audio stream URLs (fallback from dead google actions)
    const newRelease: ReleaseItem = {
      ...rawRelease,
      status: rawRelease.status || 'SUBMITTED',
      createdAt: rawRelease.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tracks: (rawRelease.tracks || []).map((t, idx) => ({
        ...t,
        audioMasterUrl:
          !t.audioMasterUrl || t.audioMasterUrl.includes('actions.google.com')
            ? `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${(idx % 4) + 1}.mp3`
            : t.audioMasterUrl,
      })),
    };

    const currentReleases = loadReleases();
    const existingIndex = currentReleases.findIndex((r) => r.id === newRelease.id);

    if (existingIndex >= 0) {
      currentReleases[existingIndex] = newRelease;
    } else {
      currentReleases.unshift(newRelease);
    }

    saveReleases(currentReleases);

    // Also persist to MongoDB Atlas if reachable
    try {
      const db = await Promise.race([
        getDatabase(),
        new Promise<null>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 1500)),
      ]);
      if (db) {
        await db.collection('releases').updateOne(
          { id: newRelease.id },
          { $set: newRelease },
          { upsert: true }
        );
      }
    } catch {}

    return NextResponse.json({
      success: true,
      message: 'Release ingested successfully and queued for Super Admin review.',
      release: newRelease,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PATCH /api/releases - Update status (Approve, Reject, Request Changes)
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, reviewNotes } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'id and status required' }, { status: 400 });
    }

    const currentReleases = loadReleases();
    const idx = currentReleases.findIndex((r) => r.id === id);
    if (idx === -1) {
      return NextResponse.json({ success: false, error: 'Release not found' }, { status: 404 });
    }

    currentReleases[idx].status = status;
    currentReleases[idx].updatedAt = new Date().toISOString();
    if (reviewNotes) {
      (currentReleases[idx] as any).reviewNotes = reviewNotes;
    }

    saveReleases(currentReleases);

    try {
      const db = await Promise.race([
        getDatabase(),
        new Promise<null>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 1500)),
      ]);
      if (db) {
        await db.collection('releases').updateOne(
          { id },
          { $set: { status, updatedAt: new Date().toISOString(), reviewNotes } }
        );
      }
    } catch {}

    return NextResponse.json({ success: true, release: currentReleases[idx] });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
