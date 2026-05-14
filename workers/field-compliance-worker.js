/**
 * OCOS Field Compliance Worker — /fc/* API
 * Deployed alongside nacosapp; handles all Field Compliance Module endpoints.
 * nacosapp calls POST /fc/provision on checkout.session.completed.
 */

import { validateLicense, requireTier } from './lib/auth.js';
import { handlePhotoUpload } from './lib/handlers/photo.js';
import { handleSiteGet } from './lib/handlers/site.js';
import {
  handleInspectionCreate,
  handleInspectionSignoff,
} from './lib/handlers/inspection.js';
import {
  handleChecklistGet,
} from './lib/handlers/checklist.js';
import { handleAiSummarize } from './lib/handlers/ai-summarize.js';
import {
  handleReportGenerate,
  handleReportList,
  handleReportLock,
  handleReportSend,
  handleReportRegenerate,
  handleReportVersions,
} from './lib/handlers/report.js';
import {
  handleStyleUpload,
  handleStyleList,
  handleStyleDelete,
} from './lib/handlers/style.js';
import { handleProvision } from './lib/handlers/provision.js';
import { seedDemoData } from './lib/demo-seeder.js';
import { seedFixtures } from './lib/seed-fixtures.js';
import { handlePhotoAudio, handlePhotoImage } from './lib/handlers/photo-media.js';

const ALLOWED_ORIGINS = [
  'https://field.naturalalternatives.ca',
  'https://naturalalternatives.ca',
  'https://www.naturalalternatives.ca',
  'https://app.naturalalternatives.ca',
  'http://localhost:3000',
  'http://localhost:5173',
];

function isAllowedOrigin(origin) {
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  if (origin.endsWith('.loca.lt')) return true;       // localtunnel dev tunnels
  if (origin.endsWith('.workers.dev')) return true;   // CF workers.dev previews
  return false;
}

function corsHeaders(request, env) {
  const origin = request?.headers?.get('Origin') || '';
  const allowed = isAllowedOrigin(origin)
    ? origin
    : (env.FRONTEND_URL || 'https://field.naturalalternatives.ca');
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-OCOS-License, X-FC-Internal',
    'Access-Control-Max-Age': '86400',
  };
}

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
  });
}

function err(message, status = 400) {
  return json({ error: message }, status);
}

async function handleFileDownload(request, env) {
  const url = new URL(request.url);
  const key = url.searchParams.get('key');
  const expires = parseInt(url.searchParams.get('expires') || '0', 10);

  if (!key) return new Response(JSON.stringify({ error: 'key required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  if (Date.now() > expires) return new Response(JSON.stringify({ error: 'Link has expired' }), { status: 410, headers: { 'Content-Type': 'application/json' } });

  let bucket, contentType, disposition;
  if (key.includes('/reports/') || key.endsWith('.pdf')) {
    bucket = env.FC_REPORTS;
    contentType = 'application/pdf';
    disposition = `attachment; filename="${key.split('/').pop()}"`;
  } else if (key.endsWith('.m4a')) {
    bucket = env.FC_VOICE;
    contentType = 'audio/mp4';
    disposition = 'inline';
  } else if (key.includes('/style/')) {
    bucket = env.FC_STYLE;
    contentType = 'application/pdf';
    disposition = 'inline';
  } else {
    bucket = env.FC_PHOTOS;
    contentType = key.endsWith('.png') ? 'image/png' : 'image/jpeg';
    disposition = 'inline';
  }

  const obj = await bucket.get(key);
  if (!obj) return new Response(JSON.stringify({ error: 'File not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });

  return new Response(obj.body, {
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': disposition,
      'Cache-Control': 'private, max-age=3600',
    },
  });
}

export default {
  async fetch(request, env, ctx) {
    const cors = corsHeaders(request, env);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    const withCors = (res) => {
      const h = new Headers(res.headers);
      Object.entries(cors).forEach(([k, v]) => h.set(k, v));
      return new Response(res.body, { status: res.status, headers: h });
    };

    try {
      let response;

      // ── Internal provision hook (called from nacosapp) ──────────────────
      if (method === 'POST' && path === '/fc/provision') {
        response = await handleProvision(request, env);

      // ── Photo ────────────────────────────────────────────────────────────
      } else if (method === 'POST' && path === '/fc/photo') {
        request._license = await validateLicense(request, env);
        response = await handlePhotoUpload(request, env);

      // ── Site ─────────────────────────────────────────────────────────────
      } else if (method === 'GET' && path.startsWith('/fc/site/')) {
        const siteId = path.slice('/fc/site/'.length);
        request._license = await validateLicense(request, env);
        response = await handleSiteGet(request, env, siteId);

      // ── Inspection ───────────────────────────────────────────────────────
      } else if (method === 'POST' && path === '/fc/inspection') {
        request._license = await validateLicense(request, env);
        response = await handleInspectionCreate(request, env);

      } else if (method === 'POST' && /^\/fc\/inspection\/[^/]+\/signoff$/.test(path)) {
        const inspectionId = path.split('/')[3];
        request._license = await validateLicense(request, env);
        response = await handleInspectionSignoff(request, env, inspectionId);

      // ── Checklist ────────────────────────────────────────────────────────
      } else if (method === 'GET' && path.startsWith('/fc/checklist/')) {
        const checklistId = path.slice('/fc/checklist/'.length);
        request._license = await validateLicense(request, env);
        response = await handleChecklistGet(request, env, checklistId);

      // ── AI summarize ─────────────────────────────────────────────────────
      } else if (method === 'POST' && path === '/fc/ai/summarize') {
        request._license = await validateLicense(request, env);
        response = await handleAiSummarize(request, env);

      // ── Reports ──────────────────────────────────────────────────────────
      } else if (method === 'GET' && path === '/fc/reports') {
        request._license = await validateLicense(request, env);
        response = await handleReportList(request, env);

      } else if (method === 'POST' && path === '/fc/report/generate') {
        request._license = await validateLicense(request, env);
        response = await handleReportGenerate(request, env);

      } else if (method === 'POST' && /^\/fc\/report\/[^/]+\/lock$/.test(path)) {
        const reportId = path.split('/')[3];
        request._license = await validateLicense(request, env);
        response = await handleReportLock(request, env, reportId);

      } else if (method === 'POST' && /^\/fc\/report\/[^/]+\/send$/.test(path)) {
        const reportId = path.split('/')[3];
        request._license = await validateLicense(request, env);
        response = await handleReportSend(request, env, reportId);

      } else if (method === 'POST' && /^\/fc\/report\/[^/]+\/regenerate$/.test(path)) {
        const reportId = path.split('/')[3];
        request._license = await validateLicense(request, env);
        response = await handleReportRegenerate(request, env, reportId);

      } else if (method === 'GET' && /^\/fc\/report\/[^/]+\/versions$/.test(path)) {
        const reportId = path.split('/')[3];
        request._license = await validateLicense(request, env);
        response = await handleReportVersions(request, env, reportId);

      // ── Style Learning (T3) ──────────────────────────────────────────────
      } else if (method === 'POST' && path === '/fc/style/upload') {
        const license = await validateLicense(request, env);
        await requireTier(license, 'T3');
        response = await handleStyleUpload(request, env, license);

      } else if (method === 'GET' && path === '/fc/style/list') {
        const license = await validateLicense(request, env);
        await requireTier(license, 'T3');
        response = await handleStyleList(request, env, license);

      } else if (method === 'DELETE' && path.startsWith('/fc/style/')) {
        const sampleId = path.slice('/fc/style/'.length);
        const license = await validateLicense(request, env);
        await requireTier(license, 'T3');
        response = await handleStyleDelete(request, env, license, sampleId);

      // ── Demo seed ────────────────────────────────────────────────────────
      } else if (method === 'POST' && path === '/fc/demo/seed') {
        const license = await validateLicense(request, env);
        const mapping = await env.DB.prepare(
          'SELECT * FROM fc_license_mapping WHERE license_id=? LIMIT 1'
        ).bind(license.key).first();
        if (!mapping) return err('FC workspace not provisioned. Run /fc/provision first.', 409);
        response = json(await seedDemoData(env, license, mapping));

      // ── Phase 1.1 fixtures ───────────────────────────────────────────────
      } else if (method === 'POST' && path === '/fc/fixtures/seed') {
        const license = await validateLicense(request, env);
        const mapping = await env.DB.prepare(
          'SELECT * FROM fc_license_mapping WHERE license_id=? LIMIT 1'
        ).bind(license.key).first();
        if (!mapping) return err('FC workspace not provisioned. Run /fc/provision first.', 409);
        response = json(await seedFixtures(env, license, mapping));

      // ── Photo media (audio / image) ──────────────────────────────────────
      } else if (method === 'GET' && path.match(/^\/fc\/photo\/[^/]+\/audio$/)) {
        const photoId = path.split('/')[3];
        const license = await validateLicense(request, env);
        response = await handlePhotoAudio(request, env, license, photoId);

      } else if (method === 'GET' && path.match(/^\/fc\/photo\/[^/]+\/image$/)) {
        const photoId = path.split('/')[3];
        const license = await validateLicense(request, env);
        response = await handlePhotoImage(request, env, license, photoId);

      // ── File download (time-limited, no auth header required) ────────────
      } else if (method === 'GET' && path === '/fc/dl') {
        response = await handleFileDownload(request, env);

      // ── Health ───────────────────────────────────────────────────────────
      } else if (method === 'GET' && path === '/fc/health') {
        response = json({ ok: true, service: 'ocos-fc', ts: new Date().toISOString() });

      } else {
        response = err('Not found', 404);
      }

      return withCors(response);
    } catch (e) {
      if (e.status) return withCors(err(e.message, e.status));
      console.error('FC worker error:', e);
      return withCors(err(e.message || 'Internal error', 500));
    }
  },
};
