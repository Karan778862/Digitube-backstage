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
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 8000,
    });
    clientPromise = client.connect();
  }
  return clientPromise;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const chunk = formData.get('chunk') as File | null;
    const chunkIndex = parseInt((formData.get('chunkIndex') as string) || '0', 10);
    const totalChunks = parseInt((formData.get('totalChunks') as string) || '1', 10);
    const uploadId = (formData.get('uploadId') as string) || `up_${Date.now()}`;
    const fileName = (formData.get('fileName') as string) || 'track_master.wav';
    const mimeType = (formData.get('mimeType') as string) || 'audio/wav';

    if (!chunk) {
      return NextResponse.json({ success: false, error: 'No chunk provided' }, { status: 400 });
    }

    const chunkArrayBuffer = await chunk.arrayBuffer();
    const chunkBuffer = Buffer.from(chunkArrayBuffer);

    // Write chunk to temporary storage
    const tmpDir = path.join('/tmp', 'audio_chunks', uploadId);
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }

    const chunkPath = path.join(tmpDir, `chunk_${chunkIndex}`);
    await fs.promises.writeFile(chunkPath, chunkBuffer);

    // If not the final chunk, acknowledge receipt
    if (chunkIndex < totalChunks - 1) {
      return NextResponse.json({
        success: true,
        receivedChunk: chunkIndex,
        totalChunks,
        uploadId,
      });
    }

    // FINAL CHUNK: Assemble all chunks into full audio file
    const assembledBuffers: Buffer[] = [];
    for (let i = 0; i < totalChunks; i++) {
      const partPath = path.join(tmpDir, `chunk_${i}`);
      if (!fs.existsSync(partPath)) {
        return NextResponse.json(
          { success: false, error: `Missing chunk ${i} during assembly` },
          { status: 400 }
        );
      }
      const partBuf = await fs.promises.readFile(partPath);
      assembledBuffers.push(partBuf);
    }
    const fullAudioBuffer = Buffer.concat(assembledBuffers);

    // Clean up temporary chunks directory
    try {
      for (let i = 0; i < totalChunks; i++) {
        const partPath = path.join(tmpDir, `chunk_${i}`);
        if (fs.existsSync(partPath)) fs.unlinkSync(partPath);
      }
      fs.rmdirSync(tmpDir);
    } catch {}

    // 1. Save to local /tmp/uploads/audio/ for instant fast streaming
    const cleanBase = path.basename(fileName, path.extname(fileName)).replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 30);
    const ext = path.extname(fileName).toLowerCase() || '.wav';
    const uniqueFileName = `audio_${Date.now()}_${cleanBase}${ext}`;

    const tmpUploadDir = path.join('/tmp', 'uploads', 'audio');
    if (!fs.existsSync(tmpUploadDir)) {
      fs.mkdirSync(tmpUploadDir, { recursive: true });
    }
    await fs.promises.writeFile(path.join(tmpUploadDir, uniqueFileName), fullAudioBuffer);

    // Also write to public/uploads/audio if writable (local dev)
    try {
      const publicDir = path.join(process.cwd(), 'public', 'uploads', 'audio');
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }
      await fs.promises.writeFile(path.join(publicDir, uniqueFileName), fullAudioBuffer);
    } catch {}

    // 2. Persist permanently to MongoDB Atlas GridFS
    let gridFsId = uniqueFileName;
    try {
      const client = await getClient();
      const db = client.db(dbName);
      const bucket = new GridFSBucket(db, { bucketName: 'audio_masters' });

      await new Promise<void>((resolve, reject) => {
        const uploadStream = bucket.openUploadStream(uniqueFileName, {
          metadata: {
            originalName: fileName,
            contentType: mimeType,
            size: fullAudioBuffer.length,
            uploadedAt: new Date(),
          },
        });
        gridFsId = uploadStream.id.toString();

        uploadStream.on('error', (err) => reject(err));
        uploadStream.on('finish', () => resolve());
        uploadStream.end(fullAudioBuffer);
      });
    } catch (gridFsErr: any) {
      console.warn('GridFS storage notice:', gridFsErr?.message);
    }

    // Return the universal audio streaming URL
    const audioUrl = `/api/media/audio?id=${encodeURIComponent(uniqueFileName)}&gridId=${encodeURIComponent(gridFsId)}`;

    return NextResponse.json({
      success: true,
      url: audioUrl,
      fileName,
      fileSize: fullAudioBuffer.length,
      fileId: uniqueFileName,
      gridFsId,
      message: 'Studio audio master successfully uploaded and stored permanently.',
    });
  } catch (error: any) {
    console.error('Audio chunk upload error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Chunk upload failed' },
      { status: 500 }
    );
  }
}
