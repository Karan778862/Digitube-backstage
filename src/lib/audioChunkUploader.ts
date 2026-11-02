/**
 * Client-side chunked audio uploader.
 * Uploads large WAV/FLAC/MP3 files in 2MB slices to bypass Vercel serverless request limits
 * and stores them permanently into MongoDB Atlas GridFS.
 */

export interface ChunkUploadResult {
  success: boolean;
  url?: string;
  fileName?: string;
  fileSize?: number;
  error?: string;
}

const CHUNK_SIZE = 2 * 1024 * 1024; // 2 MB per chunk (well under Vercel's 4.5MB ceiling)

export async function uploadAudioFileInChunks(
  file: File,
  onProgress?: (percent: number) => void
): Promise<ChunkUploadResult> {
  const totalSize = file.size;
  const totalChunks = Math.ceil(totalSize / CHUNK_SIZE);
  const uploadId = `aud_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const fileName = file.name || 'master_audio.wav';
  const mimeType = file.type || 'audio/wav';

  for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
    const start = chunkIndex * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, totalSize);
    const chunkBlob = file.slice(start, end);

    const formData = new FormData();
    formData.append('chunk', chunkBlob, `chunk_${chunkIndex}`);
    formData.append('chunkIndex', chunkIndex.toString());
    formData.append('totalChunks', totalChunks.toString());
    formData.append('uploadId', uploadId);
    formData.append('fileName', fileName);
    formData.append('mimeType', mimeType);

    const res = await fetch('/api/upload/audio-chunk', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Failed uploading audio chunk ${chunkIndex + 1} of ${totalChunks}`);
    }

    const data = await res.json();

    if (onProgress) {
      const percent = Math.min(100, Math.round(((chunkIndex + 1) / totalChunks) * 100));
      onProgress(percent);
    }

    // If final chunk, return the assembled URL
    if (chunkIndex === totalChunks - 1) {
      return {
        success: true,
        url: data.url,
        fileName: data.fileName || fileName,
        fileSize: data.fileSize || totalSize,
      };
    }
  }

  return { success: false, error: 'Upload loop terminated unexpectedly' };
}
