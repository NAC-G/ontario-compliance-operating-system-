/**
 * OCOS Field — Service Worker
 * Caches app shell for offline use.
 * Queued photo/voice uploads sync via Background Sync when back online.
 */

const CACHE_NAME = 'ocos-field-v33';
const SHELL = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/modules/copy.js',
  '/modules/db.js',
  '/modules/sync.js',
  '/modules/api.js',
  '/modules/permissions.js',
  '/modules/camera.js',
  '/modules/image.js',
  '/modules/voice.js',
  '/modules/tag-picker.js',
  '/modules/severity-status.js',
  '/modules/before-after.js',
  '/modules/inspection.js',
  '/modules/signoff.js',
  '/modules/reports.js',
  '/modules/style-samples.js',
  '/modules/branding-setup.js',
  '/taxonomy.json',
  '/manifest.webmanifest',
];

const SYNC_TAG = 'fc-photo-upload';

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      Promise.all(SHELL.map(url =>
        fetch(new Request(url, { cache: 'reload' })).then(res => cache.put(url, res))
      ))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Pass FC API calls through — don't cache
  if (url.pathname.startsWith('/fc/')) return;

  // Serve shell from cache, fall back to network
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).catch(() => caches.match('/index.html')))
  );
});

// Background Sync — upload queued photos
self.addEventListener('sync', e => {
  if (e.tag === SYNC_TAG) {
    e.waitUntil(flushQueue());
  }
});

async function flushQueue() {
  const db = await openDB();
  const queue = await getAllPending(db);

  for (const item of queue) {
    try {
      const formData = new FormData();
      formData.append('photo', item.photoBytes, item.fileName);
      if (item.thumbnailBytes) formData.append('thumbnail', item.thumbnailBytes, item.thumbnailFileName);
      if (item.voiceBytes) formData.append('voice', item.voiceBytes, item.voiceFileName);
      formData.append('metadata', JSON.stringify(item.metadata));

      const res = await fetch('/fc/photo', {
        method: 'POST',
        headers: { 'X-OCOS-License': item.licenseKey },
        body: formData,
      });

      if (res.ok) {
        await deleteQueueItem(db, item.id);
        notifyClients({ type: 'SYNC_COMPLETE', itemId: item.id });
      } else {
        // A real server rejection (not a connectivity problem, since we
        // got a response at all) — leave it queued for a person to
        // notice via the sync chip rather than silently dropping it, but
        // don't keep hammering it automatically; this same request will
        // just fail the same way again next sync too.
        console.error('Upload failed for item', item.id, res.status);
      }
    } catch (err) {
      // Network error mid-flush — stop this pass; the rest of the queue
      // will get another shot on the next sync event.
      console.error('Sync error for item', item.id, err);
      break;
    }
  }
}

function notifyClients(msg) {
  self.clients.matchAll().then(clients => clients.forEach(c => c.postMessage(msg)));
}

// Minimal IndexedDB helpers (mirrored in modules/db.js for the main thread)
function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('ocos-field', 1);
    req.onupgradeneeded = e => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('upload_queue')) {
        const store = db.createObjectStore('upload_queue', { keyPath: 'id', autoIncrement: true });
        store.createIndex('synced', 'synced', { unique: false });
      }
    };
    req.onsuccess = e => resolve(e.target.result);
    req.onerror = e => reject(e.target.error);
  });
}

function getAllPending(db) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('upload_queue', 'readonly');
    const idx = tx.objectStore('upload_queue').index('synced');
    const req = idx.getAll(0);
    req.onsuccess = e => resolve(e.target.result);
    req.onerror = e => reject(e.target.error);
  });
}

// Deletes rather than flags-as-synced — queued items carry real photo/
// thumbnail/voice blobs, and there's no UI that ever reads a "synced"
// record back, so keeping them around forever just wastes IndexedDB
// storage on a device that's often storage-constrained in the field.
function deleteQueueItem(db, id) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('upload_queue', 'readwrite');
    tx.objectStore('upload_queue').delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = e => reject(e.target.error);
  });
}
