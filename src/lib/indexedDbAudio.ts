// Utility to store and retrieve large audio master files (WAV, FLAC, MP3) in browser IndexedDB
// This enables instantaneous studio master preview for artists & admins without hitting Vercel payload limits

const DB_NAME = 'digitube_media_db';
const DB_VERSION = 1;
const STORE_NAME = 'audio_masters';

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported in this environment'));
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Save an audio file or blob into IndexedDB
 */
export async function saveTrackAudioBlob(key: string, blob: Blob): Promise<void> {
  try {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(blob, key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('[IndexedDB] Could not save audio blob:', err);
  }
}

/**
 * Retrieve an audio blob from IndexedDB and return an object URL
 */
export async function getTrackAudioUrl(key: string): Promise<string | null> {
  try {
    const db = await openDb();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);

      req.onsuccess = () => {
        const result = req.result;
        if (result instanceof Blob) {
          const url = URL.createObjectURL(result);
          resolve(url);
        } else {
          resolve(null);
        }
      };

      req.onerror = () => resolve(null);
    });
  } catch (err) {
    return null;
  }
}
