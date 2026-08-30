/**
 * Sync status manager.
 * Polls IndexedDB pending count and listens for online/offline events.
 *
 * Two retry paths, chosen by capability:
 *  - Background Sync API (Chrome/Android): the service worker's own
 *    'sync' handler (service-worker.js flushQueue()) retries even if the
 *    PWA isn't open. Registered here on reconnect.
 *  - Everywhere else (notably iOS Safari, which has no Background Sync
 *    API at all — and this app specifically nudges users toward
 *    installing to the Home Screen): a main-thread fallback,
 *    _flushInMainThread(), that does the same upload replay directly.
 *    Only one path runs per browser, so there's no risk of both firing
 *    and double-uploading the same queued item.
 */

import { getPendingCount, getAllPendingUploads, deleteQueuedUpload } from './db.js';
import { uploadQueuedItem } from './api.js';

const SYNC_TAG = 'fc-photo-upload';

export class SyncManager {
  constructor({ onUpdate }) {
    this._onUpdate = onUpdate;
    this._syncing = false;
    this._pollInterval = null;
    this._supportsBackgroundSync = 'serviceWorker' in navigator && 'SyncManager' in window;

    window.addEventListener('online',  () => this._onOnline());
    window.addEventListener('offline', () => this._onOffline());

    this._poll();
    this._pollInterval = setInterval(() => this._poll(), 15000);
  }

  async _poll() {
    if (!navigator.onLine) {
      const n = await getPendingCount().catch(() => 0);
      this._onUpdate(n > 0 ? 'offline-queue' : 'offline-idle', { n });
      return;
    }
    const n = await getPendingCount().catch(() => 0);
    if (n > 0) {
      this._onUpdate('offline-queue', { n });
    } else if (!this._syncing) {
      this._onUpdate('synced', {});
    }
  }

  _onOnline() {
    this._poll();
    if (this._supportsBackgroundSync) {
      navigator.serviceWorker.ready
        .then(reg => reg.sync.register(SYNC_TAG))
        .catch(() => this._flushInMainThread());
    } else {
      this._flushInMainThread();
    }
  }

  _onOffline() {
    this._poll();
  }

  // Call right after queueing a new offline upload, so a still-online
  // browser retries immediately instead of waiting for the next poll
  // tick or an 'online' event that (since we're already online) will
  // never fire.
  requestSync() {
    if (navigator.onLine) this._onOnline();
  }

  markSyncing(n, total) {
    this._syncing = true;
    this._onUpdate('syncing', { n, total });
  }

  markSynced() {
    this._syncing = false;
    this._onUpdate('synced', {});
  }

  markError() {
    this._syncing = false;
    this._onUpdate('error', {});
  }

  async updateFromDB() {
    await this._poll();
  }

  async _flushInMainThread() {
    if (this._syncing) return;
    const items = await getAllPendingUploads().catch(() => []);
    if (items.length === 0) return;

    this._syncing = true;
    let remaining = items.length;
    for (const item of items) {
      this.markSyncing(items.length - remaining, items.length);
      try {
        const ok = await uploadQueuedItem(item);
        if (ok) {
          await deleteQueuedUpload(item.id);
        }
        // A non-ok response (still offline, or a real server rejection)
        // just leaves the item queued — next reconnect/poll tries again.
      } catch (_) {
        // Network error mid-flush (e.g. connection dropped again) — stop
        // this pass rather than burning through the rest of the queue
        // against a connection that's clearly not there.
        break;
      }
      remaining--;
    }
    this._syncing = false;
    await this._poll();
  }
}
