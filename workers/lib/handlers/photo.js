/**
 * POST /fc/photo
 * Multipart: file (image), metadata (JSON blob).
 * Hash BEFORE any processing. Upload to R2. Create FC-Photos Notion record.
 */

import { sha256Hex } from '../hash.js';
import { photoKey, voiceKey, putObject } from '../r2.js';
import { resolveOhsaRefs, getSeverityDefault, getAutoStatus } from '../taxonomy.js';
import { getLicenseMapping } from '../db.js';

export async function handlePhotoUpload(request, env) {
  const license = request._license;
  const formData = await request.formData();

  const photoFile = formData.get('photo');
  if (!photoFile) return json({ error: 'photo file required' }, 400);

  const metaRaw = formData.get('metadata');
  const meta = metaRaw ? JSON.parse(metaRaw) : {};

  const {
    siteId,
    capturedAt,
    geoLat,
    geoLng,
    gps,
    deviceId,
    tags = [],
    statusOverride,
    severityOverride,
    voiceNoteId,
    inspectionId,
    capturedBy,
    captureSource = 'Live',
  } = meta;

  // Accept gps: { lat, lng } from PWA as well as flat geoLat/geoLng
  const resolvedLat = geoLat != null ? geoLat : gps?.lat;
  const resolvedLng = geoLng != null ? geoLng : gps?.lng;

  if (!siteId) return json({ error: 'siteId required in metadata' }, 400);

  const mapping = await getLicenseMapping(env.DB, license.id);
  if (!mapping) return json({ error: 'FC workspace not provisioned for this license' }, 409);

  // Hash original bytes BEFORE any processing — chain of custody
  const photoBuf = await photoFile.arrayBuffer();
  const hash = await sha256Hex(photoBuf);

  // Generate photo ID
  const photoId = `FC-P-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const ext = (photoFile.type || 'image/jpeg').split('/')[1] || 'jpg';
  const r2Key = photoKey(license.id, siteId, photoId, ext);

  await putObject(env.FC_PHOTOS, r2Key, photoBuf, photoFile.type || 'image/jpeg');

  // Resolve OHSA references and auto-defaults from tags
  const ohsaRefs = resolveOhsaRefs(tags).join(', ');
  const severity = severityOverride || getSeverityDefault(tags);
  const status = statusOverride || getAutoStatus(tags);

  // Handle optional voice note upload (if included as separate field)
  let voiceR2Key = null;
  const voiceFile = formData.get('voice');
  if (voiceFile) {
    const vId = voiceNoteId || `FC-V-${Date.now()}`;
    voiceR2Key = voiceKey(license.id, siteId, vId);
    await putObject(env.FC_VOICE, voiceR2Key, await voiceFile.arrayBuffer(), 'audio/mp4');
  }

  // Build caption (first 80 chars of voice note transcript if available, else empty)
  const caption = meta.caption
    ? meta.caption.slice(0, 80)
    : `Photo at ${new Date(capturedAt || Date.now()).toUTCString()}`;

  // Create Notion record
  const notion = makeNotionClient(env.NOTION_TOKEN);
  const page = await notion.post('/pages', {
    parent: { database_id: mapping.photos_db_id },
    properties: {
      'Caption': { title: [{ text: { content: caption } }] },
      'Site': { relation: [{ id: siteId }] },
      'Captured At': capturedAt ? { date: { start: capturedAt } } : undefined,
      'Captured By': capturedBy ? { relation: [{ id: capturedBy }] } : undefined,
      'Geo Lat': resolvedLat != null ? { number: parseFloat(resolvedLat) } : undefined,
      'Geo Lng': resolvedLng != null ? { number: parseFloat(resolvedLng) } : undefined,
      'Device ID': deviceId ? { rich_text: [{ text: { content: String(deviceId) } }] } : undefined,
      'Capture Source': { select: { name: captureSource } },
      'Tags': { multi_select: tags.map(t => ({ name: t })) },
      'OHSA References': { rich_text: [{ text: { content: ohsaRefs } }] },
      'Status': { select: { name: status } },
      'Severity': { select: { name: severity } },
      'Inspection': inspectionId ? { relation: [{ id: inspectionId }] } : undefined,
      'Hash': { rich_text: [{ text: { content: hash } }] },
    },
  });

  return json({
    photoId: page.id,
    hash,
    r2Key,
    status,
    severity,
    ohsaRefs,
  }, 201);
}

function makeNotionClient(token) {
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Notion-Version': '2022-06-28',
  };
  return {
    post: (path, body) => fetch(`https://api.notion.com/v1${path}`, {
      method: 'POST', headers, body: JSON.stringify(body),
    }).then(r => r.json()),
  };
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status, headers: { 'Content-Type': 'application/json' },
  });
}
