import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fileName = searchParams.get('file');

    if (!fileName) {
      return NextResponse.json({ error: 'File parameter is required' }, { status: 400 });
    }

    // Sanitize file name to prevent directory traversal
    const safeName = path.basename(fileName);
    const subDir = safeName.startsWith('audio_') ? 'audio' : 'artwork';

    // Check multiple potential paths
    const publicPath = path.join(process.cwd(), 'public', 'uploads', subDir, safeName);
    const tmpPath = path.join('/tmp', 'uploads', subDir, safeName);

    let resolvedPath = '';
    if (fs.existsSync(publicPath)) {
      resolvedPath = publicPath;
    } else if (fs.existsSync(tmpPath)) {
      resolvedPath = tmpPath;
    } else {
      return NextResponse.json({ error: 'File not found on server' }, { status: 404 });
    }

    const stat = fs.statSync(resolvedPath);
    const fileSize = stat.size;
    const range = req.headers.get('range');

    const ext = path.extname(safeName).toLowerCase();
    const contentType =
      ext === '.mp3'
        ? 'audio/mpeg'
        : ext === '.wav'
        ? 'audio/wav'
        : ext === '.flac'
        ? 'audio/flac'
        : ext === '.ogg'
        ? 'audio/ogg'
        : ext === '.png'
        ? 'image/png'
        : ext === '.webp'
        ? 'image/webp'
        : ext === '.jpg' || ext === '.jpeg'
        ? 'image/jpeg'
        : 'application/octet-stream';

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = end - start + 1;
      const fileStream = fs.createReadStream(resolvedPath, { start, end });

      // @ts-ignore
      return new Response(fileStream, {
        status: 206,
        headers: {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize.toString(),
          'Content-Type': contentType,
        },
      });
    } else {
      const fileStream = fs.createReadStream(resolvedPath);
      // @ts-ignore
      return new Response(fileStream, {
        headers: {
          'Content-Length': fileSize.toString(),
          'Content-Type': contentType,
          'Accept-Ranges': 'bytes',
        },
      });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
