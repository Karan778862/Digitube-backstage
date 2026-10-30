import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Max file sizes
const MAX_ARTWORK_SIZE = 25 * 1024 * 1024; // 25 MB
const MAX_AUDIO_SIZE = 150 * 1024 * 1024; // 150 MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const uploadType = (formData.get('type') as string) || 'artwork'; // 'artwork' | 'audio'

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file uploaded. Please select a file.' },
        { status: 400 }
      );
    }

    const originalName = file.name || 'unnamed';
    const ext = path.extname(originalName).toLowerCase();

    if (uploadType === 'artwork') {
      const allowedExts = ['.jpg', '.jpeg', '.png', '.webp'];
      if (!allowedExts.includes(ext)) {
        return NextResponse.json(
          { success: false, error: 'Invalid artwork format. Please upload JPG, PNG, or WebP.' },
          { status: 400 }
        );
      }
      if (file.size > MAX_ARTWORK_SIZE) {
        return NextResponse.json(
          { success: false, error: 'Artwork file too large. Maximum size allowed is 25 MB.' },
          { status: 400 }
        );
      }
    } else if (uploadType === 'audio') {
      const allowedExts = ['.wav', '.flac', '.mp3', '.m4a', '.aac', '.ogg'];
      if (!allowedExts.includes(ext)) {
        return NextResponse.json(
          { success: false, error: 'Invalid audio format. Please upload studio WAV, FLAC, or MP3.' },
          { status: 400 }
        );
      }
      if (file.size > MAX_AUDIO_SIZE) {
        return NextResponse.json(
          { success: false, error: 'Audio file too large. Maximum size allowed is 150 MB.' },
          { status: 400 }
        );
      }
    }

    // Determine target directory inside public
    const subDir = uploadType === 'audio' ? 'audio' : 'artwork';
    const targetDir = path.join(process.cwd(), 'public', 'uploads', subDir);

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Generate safe clean filename
    const cleanBase = path
      .basename(originalName, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .substring(0, 30);
    const uniqueFileName = `${subDir}_${Date.now()}_${cleanBase}${ext}`;
    const filePath = path.join(targetDir, uniqueFileName);

    // Write file buffer to disk
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.promises.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${subDir}/${uniqueFileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: originalName,
      fileSize: file.size,
      uploadType,
      message: `${uploadType === 'audio' ? 'Studio audio master' : 'Cover artwork'} uploaded successfully.`,
    });
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'File upload failed on server.' },
      { status: 500 }
    );
  }
}
