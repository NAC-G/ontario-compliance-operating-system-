/**
 * IndexedDB schema for offline queue and local cache.
 * Main thread mirror of the SW's minimal DB helpers.
 */

const DB_NAME = 'ocos-field';
const DB_VERSION = 1;

let _db = null;

export async function openDB() {
  if (_db) return _db;
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = e => {
      const db = e.target.result;
      // Upload queue for offline photos/voice
      if (!db.objectStoreNames.contains('upload_queue')) {
        const store = db.createObjectStore('upload_queue', { keyPath: 'id', autoIncrement: true });
        store.createIndex('synced', 'synced', { unique: false });
        store.createIndex('siteId', 'siteId', { unique: false });
      }
      // Local site cache
      if (!db.objectStoreNames.contains('sites')) {
        db.createObjectStore('sites', { keyPath: 'id' });
      }
      // Settings (license key, preferences)
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' });
      }
    };
    req.onsuccess = e => { _db = e.target.result; resolve(_db); };
    req.onerror = e => reject(e.target.error);
  });
}

export async function queueUpload(item) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('upload_queue', 'readwrite');
    const req = tx.objectStore('upload_queue').add({
      ...item,
      synced: 0,
      queuedAt: Date.now(),
    });
    req.onsuccess = e => resolve(e.target.result);
    req.onerror = e => reject(e.target.error);
  });
}

export async function getPendingCount() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('upload_queue', 'readonly');
    const req = tx.objectStore('upload_queue').index('synced').count(0);
    req.onsuccess = e => resolve(e.target.result);
    req.onerror = e => reject(e.target.error);
  });
}

export async function getSetting(key) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('settings', 'readonly');
    const req = tx.objectStore('settings').get(key);
    req.onsuccess = e => resolve(e.target.result?.value ?? null);
    req.onerror = e => reject(e.target.error);
  });
}

export async function setSetting(key, value) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('settings', 'readwrite');
    const req = tx.objectStore('settings').put({ key, value });
    req.onsuccess = () => resolve();
    req.onerror = e => reject(e.target.error);
  });
}

export async function cacheSite(site) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('sites', 'readwrite');
    tx.objectStore('sites').put({ ...site, cachedAt: Date.now() }).onsuccess = () => resolve();
    tx.onerror = e => reject(e.target.error);
  });
}

export async function getCachedSite(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('sites', 'readonly');
    const req = tx.objectStore('sites').get(id);
    req.onsuccess = e => resolve(e.target.result || null);
    req.onerror = e => reject(e.target.error);
  });
}
