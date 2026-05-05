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

const ALLOWED_ORIGINS = [
  'https://field.naturalalternatives.ca',
  'https://naturalalternatives.ca',
  'https://www.naturalalternatives.ca',
  'https://app.naturalalternatives.ca',
];

function corsHeaders(request, env) {
  const origin = request?.headers?.get('Origin') || '';
  const allowed = ALLOWED_ORIGINS.includes(origin)
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
        await validateLicense(request, env);
        response = await handlePhotoUpload(request, env);

      // ── Site ─────────────────────────────────────────────────────────────
      } else if (method === 'GET' && path.startsWith('/fc/site/')) {
        const siteId = path.slice('/fc/site/'.length);
        await validateLicense(request, env);
        response = await handleSiteGet(request, env, siteId);

      // ── Inspection ───────────────────────────────────────────────────────
      } else if (method === 'POST' && path === '/fc/inspection') {
        await validateLicense(request, env);
        response = await handleInspectionCreate(request, env);

      } else if (method === 'POST' && /^\/fc\/inspection\/[^/]+\/signoff$/.test(path)) {
        const inspectionId = path.split('/')[3];
        await validateLicense(request, env);
        response = await handleInspectionSignoff(request, env, inspectionId);

      // ── Checklist ────────────────────────────────────────────────────────
      } else if (method === 'GET' && path.startsWith('/fc/checklist/')) {
        const checklistId = path.slice('/fc/checklist/'.length);
        await validateLicense(request, env);
        response = await handleChecklistGet(request, env, checklistId);

      // ── AI summarize ─────────────────────────────────────────────────────
      } else if (method === 'POST' && path === '/fc/ai/summarize') {
        await validateLicense(request, env);
        response = await handleAiSummarize(request, env);

      // ── Reports ──────────────────────────────────────────────────────────
      } else if (method === 'POST' && path === '/fc/report/generate') {
        await validateLicense(request, env);
        response = await handleReportGenerate(request, env);

      } else if (method === 'POST' && /^\/fc\/report\/[^/]+\/lock$/.test(path)) {
        const reportId = path.split('/')[3];
        await validateLicense(request, env);
        response = await handleReportLock(request, env, reportId);

      } else if (method === 'POST' && /^\/fc\/report\/[^/]+\/send$/.test(path)) {
        const reportId = path.split('/')[3];
        await validateLicense(request, env);
        response = await handleReportSend(request, env, reportId);

      } else if (method === 'POST' && /^\/fc\/report\/[^/]+\/regenerate$/.test(path)) {
        const reportId = path.split('/')[3];
        await validateLicense(request, env);
        response = await handleReportRegenerate(request, env, reportId);

      } else if (method === 'GET' && /^\/fc\/report\/[^/]+\/versions$/.test(path)) {
        const reportId = path.split('/')[3];
        await validateLicense(request, env);
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
      return withCors(err('Internal error', 500));
    }
  },
};
