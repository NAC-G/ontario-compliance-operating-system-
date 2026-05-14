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

export async function getSite(siteId) {
  return fcFetch(`/site/${siteId}`).then(r => r.json());
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
