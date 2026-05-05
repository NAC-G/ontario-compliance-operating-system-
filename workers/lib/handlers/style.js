/**
 * Style Learning endpoints (T3 only):
 *   POST   /fc/style/upload  — accept PDF/DOCX/TXT, extract text, store FC-StyleSamples
 *   GET    /fc/style/list    — list active style samples for license
 *   DELETE /fc/style/:id     — soft-delete (Active? = false)
 */

import { requireLicenseMapping } from '../db.js';
import { makeClient } from '../notion.js';
import { styleKey, putObject } from '../r2.js';

const MAX_ACTIVE_SAMPLES = 10;

export async function handleStyleUpload(request, env, license) {
  const mapping = await requireLicenseMapping(env.DB, license.id);
  if (!mapping.style_samples_db_id) {
    return json({ error: 'Style Learning not provisioned for this license' }, 409);
  }

  const formData = await request.formData();
  const file = formData.get('file');
  if (!file) return json({ error: 'file required' }, 400);

  const meta = JSON.parse(formData.get('metadata') || '{}');
  const { reportType, siteTypes = ['All'], qualityScore = 'Use', voiceNotes = '' } = meta;

  const mimeType = file.type || '';
  const fileName = file.name || 'sample';
  const ext = fileName.split('.').pop().toLowerCase();

  if (!['pdf', 'docx', 'txt', 'md'].includes(ext)) {
    return json({
      error: 'We can\'t read this file.',
      detail: 'Send a PDF, Word document, or plain text. Images of reports won\'t work yet.',
    }, 415);
  }

  // Check active sample count
  const notion = makeClient(env.NOTION_TOKEN);
  const activeCount = await countActiveSamples(notion, mapping.style_samples_db_id);
  if (activeCount >= MAX_ACTIVE_SAMPLES) {
    return json({
      error: 'You\'ve hit your sample limit.',
      detail: `T3 includes ${MAX_ACTIVE_SAMPLES} active style samples. Pause one to add another.`,
    }, 422);
  }

  const fileBytes = await file.arrayBuffer();

  // Extract text
  let extractedText = '';
  let wordCount = 0;
  try {
    extractedText = await extractText(fileBytes, ext, env);
    wordCount = extractedText.split(/\s+/).filter(Boolean).length;
  } catch (e) {
    console.error('Text extraction failed:', e);
    return json({ error: 'Text extraction failed', detail: e.message }, 500);
  }

  // Store original in R2
  const sampleId = `FC-SS-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const r2Key = styleKey(license.id, sampleId, ext);
  await putObject(env.FC_STYLE, r2Key, fileBytes, mimeType || 'application/octet-stream');

  // Create FC-StyleSamples Notion record
  const props = {
    'Sample Title': { title: [{ text: { content: fileName.replace(`.${ext}`, '') } }] },
    'Extracted Text': { rich_text: [{ text: { content: extractedText.slice(0, 2000) } }] },
    'Word Count': { number: wordCount },
    'Quality Score': { select: { name: qualityScore } },
    'Active?': { checkbox: true },
    'Times Used': { number: 0 },
    'Site Type': { multi_select: siteTypes.map(s => ({ name: s })) },
  };
  if (reportType) props['Report Type'] = { select: { name: reportType } };
  if (voiceNotes) props['Voice Notes'] = { rich_text: [{ text: { content: voiceNotes } }] };

  const page = await notion.post('/pages', {
    parent: { database_id: mapping.style_samples_db_id },
    properties: props,
  });

  return json({
    sampleId: page.id,
    wordCount,
    qualityScore,
    message: `Sample added. ${wordCount} words extracted.`,
  }, 201);
}

export async function handleStyleList(request, env, license) {
  const mapping = await requireLicenseMapping(env.DB, license.id);
  if (!mapping.style_samples_db_id) return json({ samples: [] });

  const notion = makeClient(env.NOTION_TOKEN);
  const res = await notion.post(`/databases/${mapping.style_samples_db_id}/query`, {
    filter: { property: 'Active?', checkbox: { equals: true } },
    sorts: [{ property: 'Uploaded At', direction: 'descending' }],
  });

  const samples = (res.results || []).map(p => {
    const props = p.properties || {};
    return {
      id: p.id,
      title: props['Sample Title']?.title?.[0]?.plain_text || '',
      wordCount: props['Word Count']?.number || 0,
      reportType: props['Report Type']?.select?.name || '',
      siteTypes: (props['Site Type']?.multi_select || []).map(s => s.name),
      qualityScore: props['Quality Score']?.select?.name || '',
      timesUsed: props['Times Used']?.number || 0,
      active: props['Active?']?.checkbox || false,
      uploadedAt: props['Uploaded At']?.created_time || null,
    };
  });

  return json({ samples, activeCount: samples.length, maxAllowed: MAX_ACTIVE_SAMPLES });
}

export async function handleStyleDelete(request, env, license, sampleId) {
  const mapping = await requireLicenseMapping(env.DB, license.id);
  if (!mapping.style_samples_db_id) return json({ error: 'Style Learning not provisioned' }, 409);

  const notion = makeClient(env.NOTION_TOKEN);
  await notion.patch(`/pages/${sampleId}`, {
    properties: { 'Active?': { checkbox: false } },
  });

  return json({ ok: true, sampleId, active: false });
}

// ── Text extraction ───────────────────────────────────────────────────────────

async function extractText(fileBytes, ext, env) {
  if (ext === 'txt' || ext === 'md') {
    return new TextDecoder().decode(fileBytes);
  }

  if (ext === 'pdf') {
    // pdf-parse — Worker-compatible
    const pdfParse = (await import('pdf-parse')).default;
    const result = await pdfParse(Buffer.from(fileBytes));
    return result.text || '';
  }

  if (ext === 'docx') {
    const mammoth = (await import('mammoth')).default;
    const result = await mammoth.extractRawText({ arrayBuffer: fileBytes });
    return result.value || '';
  }

  throw new Error(`Unsupported file type: ${ext}`);
}

async function countActiveSamples(notion, dbId) {
  const res = await notion.post(`/databases/${dbId}/query`, {
    filter: { property: 'Active?', checkbox: { equals: true } },
    page_size: 1,
  });
  return res.results?.length === 1 && res.next_cursor ? MAX_ACTIVE_SAMPLES : (res.results?.length || 0);
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status, headers: { 'Content-Type': 'application/json' },
  });
}
