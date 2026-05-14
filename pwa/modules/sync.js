/**
 * Sync status manager.
 * Polls IndexedDB pending count and listens for online/offline events.
 */

import { getPendingCount } from './db.js';

export class SyncManager {
  constructor({ onUpdate }) {
    this._onUpdate = onUpdate;
    this._syncing = false;
    this._pollInterval = null;

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
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      navigator.serviceWorker.ready
        .then(reg => reg.sync.register('fc-photo-upload'))
        .catch(() => {});
    }
  }

  _onOffline() {
    this._poll();
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
}
