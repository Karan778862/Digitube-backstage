import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getDatabase } from '@/lib/mongodb';
import { ReleaseItem } from '@/lib/types';
import { INITIAL_RELEASES } from '@/lib/mockData';

const RELEASES_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'releases.json');

function loadReleases(): ReleaseItem[] {
  try {
    if (fs.existsSync(RELEASES_FILE_PATH)) {
      const data = fs.readFileSync(RELEASES_FILE_PATH, 'utf-8');
      return JSON.parse(data);
    } else {
      saveReleases(INITIAL_RELEASES);
      return INITIAL_RELEASES;
    }
  } catch (err) {
    console.error('Error reading releases.json:', err);
  }
  return [];
}

function saveReleases(releases: ReleaseItem[]): void {
  try {
    const dir = path.dirname(RELEASES_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(RELEASES_FILE_PATH, JSON.stringify(releases, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving releases.json:', err);
  }
}

// GET /api/releases
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const all = searchParams.get('all') === 'true';

    const localReleases = loadReleases();

    if (all || !email) {
      return NextResponse.json({ success: true, releases: localReleases });
    }

    const filtered = localReleases.filter(
      (r) => r.artistId === email || (r.splits && r.splits.some((s) => s.payeeEmail === email))
    );
    return NextResponse.json({ success: true, releases: filtered });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/releases - Ingest new release
export async function POST(req: NextRequest) {
  try {
    const newRelease: ReleaseItem = await req.json();

    if (!newRelease || !newRelease.id) {
      return NextResponse.json({ success: false, error: 'Invalid release payload' }, { status: 400 });
    }

    const currentReleases = loadReleases();
    const existingIndex = currentReleases.findIndex((r) => r.id === newRelease.id);

    if (existingIndex >= 0) {
      currentReleases[existingIndex] = newRelease;
    } else {
      currentReleases.unshift(newRelease);
    }

    saveReleases(currentReleases);

    // Also persist to MongoDB Atlas if available
    try {
      const db = await Promise.race([
        getDatabase(),
        new Promise<null>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 2500)),
      ]);
      if (db) {
        await db.collection('releases').updateOne(
          { id: newRelease.id },
          { $set: newRelease },
          { upsert: true }
        );
      }
    } catch {}

    return NextResponse.json({ success: true, release: newRelease });
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
        new Promise<null>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 2500)),
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
