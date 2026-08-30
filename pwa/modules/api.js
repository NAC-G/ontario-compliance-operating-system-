/**
 * /fc/* API client for the PWA.
 * All requests include X-OCOS-License header.
 */

import { getSetting } from './db.js';

const FC_BASE = window.location.hostname === 'localhost'
  ? 'http://localhost:8787'
  : 'https://ocos-fc.naturalalternatives.ca';

async function licenseKey() {
  return (await getSetting('licenseKey')) || '';
}

async function fcFetch(path, opts = {}) {
  const key = await licenseKey();
  const headers = {
    'X-OCOS-License': key,
    ...(opts.headers || {}),
  };
  // Don't set Content-Type for FormData — browser sets boundary automatically
  if (opts.body && !(opts.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  const res = await fetch(`${FC_BASE}/fc${path}`, { ...opts, headers });
  return res;
}

export async function uploadPhoto(formData) {
  return fcFetch('/photo', { method: 'POST', body: formData });
}

// Replays a queued offline upload (see modules/db.js queueUpload /
// getAllPendingUploads). Uses the license key stored on the item at
// queue time, not whatever's currently active — deliberate, so a queued
// item still uploads correctly to the right license even if the active
// one changes before it's retried. Used by sync.js's main-thread flush
// fallback (browsers without Background Sync — notably iOS Safari).
export async function uploadQueuedItem(item) {
  const formData = new FormData();
  formData.append('photo', item.photoBytes, item.fileName);
  if (item.thumbnailBytes) formData.append('thumbnail', item.thumbnailBytes, item.thumbnailFileName);
  if (item.voiceBytes) formData.append('voice', item.voiceBytes, item.voiceFileName);
  formData.append('metadata', JSON.stringify(item.metadata));
  const res = await fetch(`${FC_BASE}/fc/photo`, {
    method: 'POST',
    headers: { 'X-OCOS-License': item.licenseKey || '' },
    body: formData,
  });
  return res.ok;
}

export async function getSite(siteId, { cursor, search } = {}) {
  const params = new URLSearchParams();
  if (cursor) params.set('cursor', cursor);
  if (search) params.set('search', search);
  const qs = params.toString() ? `?${params.toString()}` : '';
  return fcFetch(`/site/${siteId}${qs}`).then(r => r.json());
}

export async function updatePhoto(photoId, patch) {
  const res = await fcFetch(`/photo/${photoId}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || 'Failed to update photo');
  return body;
}

export async function deletePhoto(photoId) {
  const res = await fcFetch(`/photo/${photoId}`, { method: 'DELETE' });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || 'Failed to delete photo');
  return body;
}

export async function createSite(name, address) {
  const res = await fcFetch('/site', {
    method: 'POST',
    body: JSON.stringify({ name, address }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || 'Failed to create site');
  return body;
}

export async function createInspection(body) {
  return fcFetch('/inspection', { method: 'POST', body: JSON.stringify(body) }).then(r => r.json());
}

export async function signoffInspection(inspectionId, formData) {
  return fcFetch(`/inspection/${inspectionId}/signoff`, { method: 'POST', body: formData }).then(r => r.json());
}

export async function getChecklist(checklistId) {
  return fcFetch(`/checklist/${checklistId}`).then(r => r.json());
}

export async function aiSummarize(body) {
  return fcFetch('/ai/summarize', { method: 'POST', body: JSON.stringify(body) }).then(r => r.json());
}

export async function generateReport(body) {
  return fcFetch('/report/generate', { method: 'POST', body: JSON.stringify(body) }).then(r => r.json());
}

export async function lockReport(reportId) {
  return fcFetch(`/report/${reportId}/lock`, { method: 'POST' }).then(r => r.json());
}

export async function sendReport(reportId, recipients, channel) {
  return fcFetch(`/report/${reportId}/send`, {
    method: 'POST',
    body: JSON.stringify({ recipients, channel }),
  }).then(r => r.json());
}

export async function regenerateReport(reportId, body) {
  return fcFetch(`/report/${reportId}/regenerate`, {
    method: 'POST',
    body: JSON.stringify(body),
  }).then(r => r.json());
}

export async function getReportVersions(reportId) {
  return fcFetch(`/report/${reportId}/versions`).then(r => r.json());
}

export async function uploadStyleSample(formData) {
  return fcFetch('/style/upload', { method: 'POST', body: formData }).then(r => r.json());
}

export async function listStyleSamples() {
  return fcFetch('/style/list').then(r => r.json());
}

export async function deleteStyleSample(sampleId) {
  return fcFetch(`/style/${sampleId}`, { method: 'DELETE' }).then(r => r.json());
}

export async function listReports(siteId) {
  const qs = siteId ? `?siteId=${encodeURIComponent(siteId)}` : '';
  return fcFetch(`/reports${qs}`).then(r => r.json());
}

export async function seedDemoData() {
  return fcFetch('/demo/seed', { method: 'POST' }).then(r => r.json());
}

export function getPhotoAudioUrl(photoId) {
  const base = window.location.hostname === 'localhost' ? 'http://localhost:8787' : 'https://ocos-fc.naturalalternatives.ca';
  return `${base}/fc/photo/${photoId}/audio`;
}

export function getPhotoImageUrl(photoId) {
  const base = window.location.hostname === 'localhost' ? 'http://localhost:8787' : 'https://ocos-fc.naturalalternatives.ca';
  return `${base}/fc/photo/${photoId}/image`;
}
