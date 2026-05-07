/**
 * Report endpoints:
 *   POST /fc/report/generate
 *   POST /fc/report/:id/lock      ← hard rule: appendix-or-abort
 *   POST /fc/report/:id/send      ← multi-recipient, Send History append
 *   POST /fc/report/:id/regenerate
 *   GET  /fc/report/:id/versions
 */

import { requireLicenseMapping, recordAuditIndex } from '../db.js';
import { makeClient } from '../notion.js';
import { generateReport } from '../pdf-generator.js';
import { sha256Hex } from '../hash.js';
import { reportKey, putObject, getSignedUrl } from '../r2.js';
import { sendEmailMulti, buildSendHistoryEntry } from '../resend.js';

// ── Generate ──────────────────────────────────────────────────────────────────

export async function handleReportGenerate(request, env) {
  const license = request._license;
  const mapping = await requireLicenseMapping(env.DB, license.key);
  const body = await request.json();

  const {
    reportType, siteId, inspectionId,
    dateRangeStart, dateRangeEnd,
    photoIds = [],
    styleConditioned = false,
  } = body;

  if (!reportType || !siteId) return json({ error: 'reportType and siteId required' }, 400);

  const notion = makeClient(env.NOTION_TOKEN);

  // Fetch site
  const sitePage = await notion.get(`/pages/${siteId}`);
  const site = extractSite(sitePage);

  // Fetch photos
  const photos = await fetchPhotos(notion, mapping.photos_db_id, siteId, photoIds);

  // Fetch inspection if linked
  let inspection = null;
  if (inspectionId) {
    const inspPage = await notion.get(`/pages/${inspectionId}`);
    inspection = extractInspection(inspPage);
  }

  // Fetch sign-offs from inspection notes
  const signoffs = inspection ? extractSignoffs(inspection.notes) : [];

  // Collect regulatory anchors
  const regulatoryAnchors = [...new Set(photos.flatMap(p => (p.ohsaRefs || '').split(', ').filter(Boolean)))];

  // Branding: T3 reads from Client Licenses, T2 uses NAC defaults
  const branding = license.tier === 'T3'
    ? await fetchBranding(notion, env.CLIENT_LICENSES_COLLECTION_ID, license.key)
    : {};

  // Style samples: T3 only, Sonnet 4.6 when present
  let aiBody = '';
  let styleSamplesUsed = [];
  if (license.tier === 'T3' && mapping.style_samples_db_id) {
    const { samples, text: styleText } = await fetchStyleSamples(notion, mapping.style_samples_db_id, reportType, site.siteType);
    styleSamplesUsed = samples;
    aiBody = await generateAiBody(env, { reportType, site, inspection, photos, styleText, useStyleSamples: styleText.length > 0 });
  } else {
    aiBody = await generateAiBody(env, { reportType, site, inspection, photos, styleText: '', useStyleSamples: false });
  }

  // Build report metadata
  const reportId = `FC-R-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const reportMeta = {
    id: reportId,
    version: 1,
    generatedAt: new Date().toISOString(),
    generatedBy: body.generatedBy || 'OCOS Field',
    licenseId: license.key,
  };

  // Generate PDF (includes audit appendix)
  let pdfBytes;
  try {
    pdfBytes = await generateReport({
      reportType, site, inspection, photos, signoffs, regulatoryAnchors,
      branding, report: reportMeta,
      licenseeName: branding.companyName || license.client_name || '',
      aiBody,
    });
  } catch (e) {
    console.error('PDF generation failed:', e);
    return json({ error: 'Report generation failed', detail: e.message }, 500);
  }

  // Upload to R2
  const r2Key = reportKey(license.key, reportId, 1);
  await putObject(env.FC_REPORTS, r2Key, pdfBytes, 'application/pdf');
  const signedUrl = await getSignedUrl(env.FC_REPORTS, r2Key, 3600);

  // Create Notion FC-Reports record
  const reportProps = {
    'Report Title': { title: [{ text: { content: `${reportType} — ${site.name}` } }] },
    'Type': { select: { name: reportType } },
    'Site': { relation: [{ id: siteId }] },
    'Version': { number: 1 },
    'Photo Count': { number: photos.length },
    'Locked?': { checkbox: false },
    'Style-Conditioned?': { checkbox: styleSamplesUsed.length > 0 },
    'Branding Profile': { select: { name: license.tier === 'T3' && branding.companyName ? 'Client Custom' : 'NAC Default' } },
    'Audit Appendix Included?': { checkbox: true },
    'Recipients': { rich_text: [{ text: { content: '[]' } }] },
    'Send History': { rich_text: [{ text: { content: '[]' } }] },
  };
  if (dateRangeStart) reportProps['Date Range Start'] = { date: { start: dateRangeStart } };
  if (dateRangeEnd) reportProps['Date Range End'] = { date: { start: dateRangeEnd } };
  if (inspectionId) reportProps['Inspection'] = { relation: [{ id: inspectionId }] };
  if (styleSamplesUsed.length > 0) {
    reportProps['Style Samples Used'] = { relation: styleSamplesUsed.map(id => ({ id })) };
  }

  const reportPage = await notion.post('/pages', {
    parent: { database_id: mapping.reports_db_id },
    properties: reportProps,
  });

  return json({ reportId: reportPage.id, version: 1, signedUrl, pdfHash: null, locked: false }, 201);
}

// ── Lock ──────────────────────────────────────────────────────────────────────

export async function handleReportLock(request, env, reportId) {
  const license = request._license;
  const mapping = await requireLicenseMapping(env.DB, license.key);
  const notion = makeClient(env.NOTION_TOKEN);

  const reportPage = await notion.get(`/pages/${reportId}`);
  const props = reportPage.properties || {};

  if (props['Locked?']?.checkbox) {
    return json({ error: 'Report already locked', reportId }, 409);
  }

  // Check audit appendix — HARD RULE
  if (!props['Audit Appendix Included?']?.checkbox) {
    // Appendix was not set on generation — abort lock
    return json({
      error: 'LOCK_ABORTED: Audit appendix is missing from this report. Cannot produce a locked PDF without the Evidence & Audit Trail appendix. Regenerate the report to include it.',
      reportId,
    }, 422);
  }

  // Fetch PDF from R2 to compute hash
  const version = props['Version']?.number || 1;
  const siteId = props['Site']?.relation?.[0]?.id;
  const r2Key = reportKey(license.key, reportId, version);
  const r2Obj = await env.FC_REPORTS.get(r2Key);
  if (!r2Obj) return json({ error: 'PDF not found in storage' }, 404);

  const pdfBytes = await r2Obj.arrayBuffer();
  const pdfHash = await sha256Hex(pdfBytes);
  const lockedAt = new Date().toISOString();

  // Update Notion record
  await notion.patch(`/pages/${reportId}`, {
    properties: {
      'Locked?': { checkbox: true },
      'Locked At': { date: { start: lockedAt } },
      'PDF Hash': { rich_text: [{ text: { content: pdfHash } }] },
    },
  });

  // Record in D1 audit index
  await recordAuditIndex(env.DB, {
    reportId,
    reportNotionPageId: reportId,
    pdfHash,
    licenseId: license.key,
    siteId: siteId || '',
  });

  return json({ reportId, locked: true, pdfHash, lockedAt });
}

// ── Send ──────────────────────────────────────────────────────────────────────

export async function handleReportSend(request, env, reportId) {
  const license = request._license;
  await requireLicenseMapping(env.DB, license.key);
  const body = await request.json();

  const { recipients = [], channel = 'Resend Email' } = body;
  if (!recipients.length) return json({ error: 'recipients array required' }, 400);

  const notion = makeClient(env.NOTION_TOKEN);
  const reportPage = await notion.get(`/pages/${reportId}`);
  const props = reportPage.properties || {};

  // Auto-lock on first send
  if (!props['Locked?']?.checkbox) {
    const lockRes = await handleReportLock(
      { _license: license, headers: request.headers, url: request.url },
      env,
      reportId
    );
    if (!lockRes.ok && lockRes.status !== 200) {
      const lockData = await lockRes.json();
      return json({ error: 'Lock failed before send', detail: lockData.error }, 422);
    }
  }

  // Fetch signed URL for the PDF
  const version = props['Version']?.number || 1;
  const r2Key = reportKey(license.key, reportId, version);
  const signedUrl = await getSignedUrl(env.FC_REPORTS, r2Key, 86400);

  const reportTitle = props['Report Title']?.title?.[0]?.plain_text || 'OCOS Field Compliance Report';
  const siteName = ''; // could enrich

  const html = buildReportEmailHtml(reportTitle, siteName, signedUrl);

  const results = await sendEmailMulti(env, recipients, {
    subject: `${reportTitle} — OCOS Field Compliance`,
    html,
  });

  // Append to Send History (append-only)
  const existingSendHistory = safeParseJson(props['Send History']?.rich_text?.[0]?.plain_text, []);
  const entry = buildSendHistoryEntry(results, channel);
  existingSendHistory.push(entry);

  const existingRecipients = safeParseJson(props['Recipients']?.rich_text?.[0]?.plain_text, []);
  for (const r of results) {
    const existing = existingRecipients.find(e => e.email === r.email);
    if (existing) { existing.sent_at = r.sent_at; }
    else { existingRecipients.push({ email: r.email, role: r.role, sent_at: r.sent_at, opened_at: null }); }
  }

  await notion.patch(`/pages/${reportId}`, {
    properties: {
      'Send History': { rich_text: [{ text: { content: JSON.stringify(existingSendHistory) } }] },
      'Recipients': { rich_text: [{ text: { content: JSON.stringify(existingRecipients) } }] },
      'Sent Via': { multi_select: [{ name: channel }] },
    },
  });

  return json({ reportId, sent: results.length, results });
}

// ── Regenerate ────────────────────────────────────────────────────────────────

export async function handleReportRegenerate(request, env, reportId) {
  const license = request._license;
  const mapping = await requireLicenseMapping(env.DB, license.key);
  const body = await request.json();
  const notion = makeClient(env.NOTION_TOKEN);

  const reportPage = await notion.get(`/pages/${reportId}`);
  const props = reportPage.properties || {};

  if (!props['Locked?']?.checkbox) {
    return json({ error: 'Only locked reports can be regenerated as a new version. Overwrite the existing draft instead.' }, 409);
  }

  const currentVersion = props['Version']?.number || 1;
  const nextVersion = currentVersion + 1;
  const siteId = props['Site']?.relation?.[0]?.id;
  const reportType = props['Type']?.select?.name || 'Custom';

  // Re-use generate logic with next version
  const generateReq = new Request(request.url, {
    method: 'POST',
    headers: request.headers,
    body: JSON.stringify({ ...body, reportType, siteId }),
  });
  generateReq._license = license;

  const generated = await handleReportGenerate(generateReq, env);
  const genData = await generated.json();

  // Link new report back to parent (v1)
  await notion.patch(`/pages/${genData.reportId}`, {
    properties: {
      'Version': { number: nextVersion },
      'Parent Report': { relation: [{ id: reportId }] },
    },
  });

  return json({ reportId: genData.reportId, version: nextVersion, parentReportId: reportId });
}

// ── Versions ──────────────────────────────────────────────────────────────────

export async function handleReportVersions(request, env, reportId) {
  const license = request._license;
  await requireLicenseMapping(env.DB, license.key);
  const notion = makeClient(env.NOTION_TOKEN);

  // Walk the version chain
  const versions = [];
  let currentId = reportId;

  while (currentId) {
    const page = await notion.get(`/pages/${currentId}`);
    const props = page.properties || {};
    versions.push({
      id: page.id,
      version: props['Version']?.number || 1,
      locked: props['Locked?']?.checkbox || false,
      lockedAt: props['Locked At']?.date?.start || null,
      pdfHash: props['PDF Hash']?.rich_text?.[0]?.plain_text || null,
      sentVia: (props['Sent Via']?.multi_select || []).map(s => s.name),
    });
    // If this report has a Parent Report, there's an older version
    const parentId = props['Parent Report']?.relation?.[0]?.id;
    currentId = parentId && parentId !== currentId ? parentId : null;
  }

  return json({ reportId, versions: versions.reverse() });
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function extractSite(page) {
  const p = page.properties || {};
  return {
    id: page.id,
    name: p['Site Name']?.title?.[0]?.plain_text || '',
    address: p['Address']?.rich_text?.[0]?.plain_text || '',
    geocode: p['Geocode']?.rich_text?.[0]?.plain_text || '',
    siteType: p['Site Type']?.select?.name || '',
    wahSite: p['WAH Site?']?.checkbox || false,
  };
}

function extractInspection(page) {
  const p = page.properties || {};
  return {
    id: page.id,
    title: p['Inspection Title']?.title?.[0]?.plain_text || '',
    type: p['Type']?.select?.name || '',
    date: p['Date']?.date?.start || null,
    leadName: null,
    leadRole: null,
    notes: p['Notes']?.rich_text?.[0]?.plain_text || '',
    status: p['Status']?.select?.name || '',
    dateRangeStart: p['Date']?.date?.start || null,
    dateRangeEnd: p['Date']?.date?.end || null,
  };
}

function extractSignoffs(notesText) {
  if (!notesText) return [];
  const signoffs = [];
  const regex = /SIGNOFF: ({.*?})/g;
  let m;
  while ((m = regex.exec(notesText)) !== null) {
    try { signoffs.push(JSON.parse(m[1])); } catch { /* skip malformed */ }
  }
  return signoffs.map(s => ({
    workerId: s.workerId || '—',
    role: s.role || '—',
    method: s.method || '—',
    timestamp: s.timestamp || '—',
    ipPrefix: s.ipPrefix || '—',
  }));
}

async function fetchPhotos(notion, photosDbId, siteId, photoIds) {
  const filter = photoIds.length
    ? { or: photoIds.map(id => ({ property: 'Site', relation: { contains: id } })) }
    : { property: 'Site', relation: { contains: siteId } };

  const res = await notion.post(`/databases/${photosDbId}/query`, {
    filter,
    sorts: [{ property: 'Captured At', direction: 'ascending' }],
    page_size: 100,
  });

  return (res.results || []).map(p => {
    const props = p.properties || {};
    return {
      photoId: p.id,
      caption: props['Caption']?.title?.[0]?.plain_text || '',
      capturedAt: props['Captured At']?.date?.start || null,
      capturedAtLocal: null,
      geoLat: props['Geo Lat']?.number ?? null,
      geoLng: props['Geo Lng']?.number ?? null,
      deviceId: props['Device ID']?.rich_text?.[0]?.plain_text || null,
      tags: (props['Tags']?.multi_select || []).map(t => t.name),
      ohsaRefs: props['OHSA References']?.rich_text?.[0]?.plain_text || '',
      hash: props['Hash']?.rich_text?.[0]?.plain_text || '',
      status: props['Status']?.select?.name || '',
      severity: props['Severity']?.select?.name || '',
    };
  });
}

async function fetchBranding(notion, collectionId, licenseId) {
  // Query Client Licenses DB for this license
  const res = await notion.post(`/databases/${collectionId}/query`, {
    filter: { property: 'License Key', rich_text: { equals: licenseId } },
    page_size: 1,
  });
  const page = res.results?.[0];
  if (!page) return {};
  const p = page.properties || {};
  return {
    companyName: p['Branding: Company Name']?.rich_text?.[0]?.plain_text || '',
    primaryColour: p['Branding: Primary Colour']?.rich_text?.[0]?.plain_text || '',
    accentColour: p['Branding: Accent Colour']?.rich_text?.[0]?.plain_text || '',
    footerLine: p['Branding: Footer Line']?.rich_text?.[0]?.plain_text || '',
  };
}

async function fetchStyleSamples(notion, styleSamplesDbId, reportType, siteType) {
  const res = await notion.post(`/databases/${styleSamplesDbId}/query`, {
    filter: {
      and: [
        { property: 'Active?', checkbox: { equals: true } },
        { property: 'Quality Score', select: { equals: 'Use' } },
        { property: 'Report Type', select: { equals: reportType } },
      ],
    },
    sorts: [{ property: 'Times Used', direction: 'ascending' }],
    page_size: 3,
  });

  const pages = res.results || [];
  const samples = pages.map(p => p.id);
  const texts = pages.map(p => p.properties?.['Extracted Text']?.rich_text?.[0]?.plain_text || '');

  // Enforce 40k token cap (~160k char) — truncate longest first
  let combined = texts.join('\n\n---\n\n');
  while (combined.length > 160000 && texts.length > 0) {
    const longest = texts.reduce((a, b, i) => (b.length > texts[a].length ? i : a), 0);
    texts[longest] = texts[longest].slice(0, Math.max(0, texts[longest].length - 5000));
    combined = texts.join('\n\n---\n\n');
  }

  // Increment Times Used for each sample used
  for (const page of pages) {
    const used = page.properties?.['Times Used']?.number || 0;
    await notion.patch(`/pages/${page.id}`, {
      properties: { 'Times Used': { number: used + 1 } },
    }).catch(() => {}); // non-blocking
  }

  return { samples, text: combined };
}

async function generateAiBody(env, { reportType, site, inspection, photos, styleText, useStyleSamples }) {
  const model = useStyleSamples ? 'claude-sonnet-4-6' : 'claude-haiku-4-5-20251001';

  const systemPrompt = useStyleSamples
    ? `You are an Ontario construction safety compliance report writer. ` +
      `The following are examples of how this organisation writes reports of this type. ` +
      `Match the tone, structure, vocabulary, and level of detail:\n\n${styleText}`
    : `You are an Ontario construction safety compliance report writer. ` +
      `Write factual, plain-language compliance reports. Be specific. Cite OHSA sections where relevant.`;

  const photoSummary = photos.slice(0, 20).map(p =>
    `- ${p.caption || 'Photo'}: ${p.tags.join(', ')} | Severity: ${p.severity} | OHSA: ${p.ohsaRefs || '—'}`
  ).join('\n');

  const userPrompt = [
    `Write the inspection summary section for a ${reportType} report.`,
    `Site: ${site.name} (${site.siteType}).`,
    inspection ? `Inspection type: ${inspection.type}. Date: ${inspection.date || '—'}.` : '',
    `Photo evidence summary (${photos.length} photos):\n${photoSummary}`,
    `Write 2-4 concise paragraphs. Include findings, hazards noted, corrective actions, and regulatory references. No boilerplate headings.`,
  ].filter(Boolean).join('\n');

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model,
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });

  if (!res.ok) return 'Report body generation unavailable. Please add notes manually.';
  const data = await res.json();
  return data.content?.[0]?.text?.trim() || '';
}

function buildReportEmailHtml(reportTitle, siteName, pdfUrl) {
  return `<!DOCTYPE html><html><body style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
<div style="background:#080A07;padding:20px;border-radius:4px 4px 0 0">
  <span style="color:#5EE830;font-size:18px;font-weight:bold">OCOS Field Compliance</span>
</div>
<div style="border:1px solid #eee;border-top:none;padding:24px;border-radius:0 0 4px 4px">
  <h2 style="color:#080A07;margin-top:0">${reportTitle}</h2>
  ${siteName ? `<p style="color:#444">Site: <strong>${siteName}</strong></p>` : ''}
  <p style="color:#444">Your compliance report is ready. Click below to download the PDF.</p>
  <a href="${pdfUrl}" style="display:inline-block;background:#5EE830;color:#080A07;padding:12px 24px;border-radius:4px;text-decoration:none;font-weight:bold">Open Report</a>
  <p style="color:#888;font-size:12px;margin-top:24px">
    This report includes an Evidence &amp; Audit Trail appendix with SHA-256 cryptographic hashes for each photo.<br>
    Link expires in 24 hours. Download and store the PDF for your records.
  </p>
  <hr style="border:none;border-top:1px solid #eee">
  <p style="color:#aaa;font-size:11px">Generated by OCOS — Ontario Compliance Operating System · naturalalternatives.ca</p>
</div></body></html>`;
}

function safeParseJson(raw, fallback) {
  try { return JSON.parse(raw || 'null') || fallback; } catch { return fallback; }
}

// ── List ──────────────────────────────────────────────────────────────────────

export async function handleReportList(request, env) {
  const license = request._license;
  const mapping = await requireLicenseMapping(env.DB, license.key);
  const notion = makeClient(env.NOTION_TOKEN);
  const url = new URL(request.url);
  const siteId = url.searchParams.get('siteId');

  const filter = siteId
    ? { property: 'Site', relation: { contains: siteId } }
    : {};

  const res = await notion.post(`/databases/${mapping.reports_db_id}/query`, {
    ...(siteId ? { filter } : {}),
    sorts: [{ timestamp: 'created_time', direction: 'descending' }],
    page_size: 20,
  });

  const reports = (res.results || []).map(p => {
    const props = p.properties || {};
    return {
      id: p.id,
      title: props['Report Title']?.title?.[0]?.plain_text || 'Untitled',
      type: props['Type']?.select?.name || '',
      date: props['Date Range Start']?.date?.start || props['Date Range End']?.date?.start || null,
      version: props['Version']?.number || 1,
      locked: props['Locked?']?.checkbox || false,
      photoCount: props['Photo Count']?.number || 0,
    };
  });

  return json({ reports });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status, headers: { 'Content-Type': 'application/json' },
  });
}
