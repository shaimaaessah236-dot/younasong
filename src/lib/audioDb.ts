// Utility for persistent high-capacity audio storage via browser IndexedDB
// Prevents DOMException: QuotaExceededError when saving large audio recordings to localStorage

const DB_NAME = 'yona_audio_db';
const DB_VERSION = 1;
const STORE_NAME = 'audio_blobs';

let dbPromise: Promise<IDBDatabase> | null = null;
const memoryAudioCache = new Map<string, string>();

function getDb(): Promise<IDBDatabase> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('IndexedDB is not available on server'));
  }

  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        console.warn('Failed to open IndexedDB:', request.error);
        reject(request.error);
      };
    } catch (err) {
      reject(err);
    }
  });

  return dbPromise;
}

/**
 * Save audio (Blob or Data URL) to IndexedDB
 */
export async function saveAudioToIndexedDB(key: string, audioData: Blob | string): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  try {
    // Cache in memory immediately for synchronous playback
    if (typeof audioData === 'string') {
      memoryAudioCache.set(key, audioData);
    } else if (audioData instanceof Blob) {
      const blobUrl = URL.createObjectURL(audioData);
      memoryAudioCache.set(key, blobUrl);
    }

    const db = await getDb();
    return new Promise((resolve) => {
      try {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const req = store.put(audioData, key);

        req.onsuccess = () => resolve(true);
        req.onerror = () => {
          console.warn('Error storing audio to IndexedDB:', req.error);
          resolve(false);
        };
      } catch (e) {
        console.warn('Transaction error in IndexedDB:', e);
        resolve(false);
      }
    });
  } catch (err) {
    console.warn('IndexedDB saveAudio error:', err);
    return false;
  }
}

/**
 * Retrieve audio from IndexedDB (or memory cache)
 */
export async function getAudioFromIndexedDB(key: string): Promise<string | null> {
  if (typeof window === 'undefined') return null;

  // Check memory cache first
  if (memoryAudioCache.has(key)) {
    return memoryAudioCache.get(key) || null;
  }

  try {
    const db = await getDb();
    return new Promise((resolve) => {
      try {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const req = store.get(key);

        req.onsuccess = () => {
          const result = req.result;
          if (!result) {
            resolve(null);
            return;
          }

          if (result instanceof Blob) {
            const url = URL.createObjectURL(result);
            memoryAudioCache.set(key, url);
            resolve(url);
          } else if (typeof result === 'string') {
            memoryAudioCache.set(key, result);
            resolve(result);
          } else {
            resolve(null);
          }
        };

        req.onerror = () => {
          console.warn('Error reading audio from IndexedDB:', req.error);
          resolve(null);
        };
      } catch (e) {
        resolve(null);
      }
    });
  } catch (err) {
    console.warn('IndexedDB getAudio error:', err);
    return null;
  }
}

/**
 * Synchronous memory cache getter
 */
export function getCachedAudioUrl(key: string): string | null {
  return memoryAudioCache.get(key) || null;
}

/**
 * Delete audio from IndexedDB
 */
export async function deleteAudioFromIndexedDB(key: string): Promise<void> {
  memoryAudioCache.delete(key);
  try {
    const db = await getDb();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.delete(key);
  } catch (err) {
    console.warn('IndexedDB delete error:', err);
  }
}

/**
 * Safe localStorage setter that handles QuotaExceededError
 */
export function safeSetLocalStorage(key: string, value: string): boolean {
  if (typeof window === 'undefined') return false;

  try {
    localStorage.setItem(key, value);
    return true;
  } catch (e: any) {
    console.warn(`LocalStorage quota exceeded while setting key "${key}". Cleaning up heavy items...`, e);

    try {
      // Clear heavy audio strings that might have been accidentally saved in localStorage
      localStorage.removeItem('alice_recorded_voice');
      localStorage.removeItem('yona_weekly_contest_entries_v2');

      // Try setting again
      localStorage.setItem(key, value);
      return true;
    } catch (retryError) {
      console.error(`Could not save key "${key}" to localStorage even after cleanup:`, retryError);
      return false;
    }
  }
}
