import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, GridFSBucket, ObjectId } from 'mongodb';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const uri = process.env.MONGODB_URI || 'mongodb+srv://kkpkaran22_db_user:KDTuZqgr0E4QM2hs@cluster0.cbhfkdn.mongodb.net/digitube_backstage?retryWrites=true&w=majority';
const dbName = process.env.MONGODB_DB || 'digitube_backstage';

let clientPromise: Promise<MongoClient> | null = null;
function getClient(): Promise<MongoClient> {
  if (!clientPromise) {
    const client = new MongoClient(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 6000,
      connectTimeoutMS: 6000,
    });
    clientPromise = client.connect();
  }
  return clientPromise;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const gridId = searchParams.get('gridId');

    if (!id && !gridId) {
      return NextResponse.json({ error: 'Audio file identifier required' }, { status: 400 });
    }

    const safeFileName = id ? path.basename(id) : '';
    const ext = path.extname(safeFileName).toLowerCase() || '.wav';
    const contentType =
      ext === '.mp3'
        ? 'audio/mpeg'
        : ext === '.wav'
        ? 'audio/wav'
        : ext === '.flac'
        ? 'audio/flac'
        : ext === '.ogg'
        ? 'audio/ogg'
        : ext === '.m4a' || ext === '.aac'
        ? 'audio/aac'
        : 'audio/mpeg';

    // 1. Fast local check (Disk Cache on server/container)
    const localPaths = [
      safeFileName ? path.join('/tmp', 'uploads', 'audio', safeFileName) : '',
      safeFileName ? path.join(process.cwd(), 'public', 'uploads', 'audio', safeFileName) : '',
    ].filter(Boolean);

    for (const p of localPaths) {
      if (fs.existsSync(p)) {
        const stat = fs.statSync(p);
        const fileSize = stat.size;
        const range = req.headers.get('range');

        if (range) {
          const parts = range.replace(/bytes=/, '').split('-');
          const start = parseInt(parts[0], 10);
          const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
          const chunkSize = end - start + 1;
          const fileStream = fs.createReadStream(p, { start, end });

          // @ts-ignore
          return new Response(fileStream, {
            status: 206,
            headers: {
              'Content-Range': `bytes ${start}-${end}/${fileSize}`,
              'Accept-Ranges': 'bytes',
              'Content-Length': chunkSize.toString(),
              'Content-Type': contentType,
              'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
            },
          });
        } else {
          const fileStream = fs.createReadStream(p);
          // @ts-ignore
          return new Response(fileStream, {
            headers: {
              'Content-Length': fileSize.toString(),
              'Content-Type': contentType,
              'Accept-Ranges': 'bytes',
              'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
            },
          });
        }
      }
    }

    // 2. Fetch from MongoDB Atlas GridFS
    try {
      const client = await getClient();
      const db = client.db(dbName);
      const bucket = new GridFSBucket(db, { bucketName: 'audio_masters' });

      let downloadStream: any = null;
      let fileMeta: any = null;

      // Try locating by ObjectId first
      if (gridId && ObjectId.isValid(gridId)) {
        const files = await db
          .collection('audio_masters.files')
          .find({ _id: new ObjectId(gridId) })
          .toArray();
        if (files.length > 0) {
          fileMeta = files[0];
          downloadStream = bucket.openDownloadStream(new ObjectId(gridId));
        }
      }

      // Fallback: locate by filename in GridFS
      if (!downloadStream && safeFileName) {
        const files = await db
          .collection('audio_masters.files')
          .find({ filename: safeFileName })
          .toArray();
        if (files.length > 0) {
          fileMeta = files[0];
          downloadStream = bucket.openDownloadStreamByName(safeFileName);
        }
      }

      if (downloadStream && fileMeta) {
        const fileSize = fileMeta.length || 0;
        const resolvedType = fileMeta.metadata?.contentType || contentType;

        // Cache file locally in /tmp for subsequent fast reads
        const chunks: Buffer[] = [];
        downloadStream.on('data', (c: Buffer) => chunks.push(c));
        downloadStream.on('end', () => {
          try {
            const fullBuf = Buffer.concat(chunks);
            const cacheDir = path.join('/tmp', 'uploads', 'audio');
            if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
            fs.writeFileSync(path.join(cacheDir, safeFileName || fileMeta.filename), fullBuf);
          } catch {}
        });

        // @ts-ignore
        return new Response(downloadStream, {
          headers: {
            'Content-Type': resolvedType,
            'Content-Length': fileSize.toString(),
            'Accept-Ranges': 'bytes',
            'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
          },
        });
      }
    } catch (dbErr: any) {
      console.warn('MongoDB GridFS retrieval notice:', dbErr?.message);
    }

    return NextResponse.json({ error: 'Master audio recording not found' }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
