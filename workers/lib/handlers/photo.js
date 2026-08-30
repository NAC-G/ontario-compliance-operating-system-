/**
 * POST /fc/photo
 * Multipart: file (image), metadata (JSON blob).
 * Hash BEFORE any processing. Upload to R2. Create FC-Photos Notion record.
 */

import { sha256Hex } from '../hash.js';
import { photoKey, voiceKey, putObject } from '../r2.js';
import { resolveOhsaRefs, getSeverityDefault, getAutoStatus } from '../taxonomy.js';
import { getLicenseMapping } from '../db.js';
import { makeClient } from '../notion.js';

export async function handlePhotoUpload(request, env) {
  const license = request._license;
  const formData = await request.formData();

  const photoFile = formData.get('photo');
  if (!photoFile) return json({ error: 'photo file required' }, 400);

  const metaRaw = formData.get('metadata');
  const meta = metaRaw ? JSON.parse(metaRaw) : {};

  // NB: field names here must match what pwa/app.js's filePhoto() actually
  // sends (severity/status/deviceInfo) — this previously destructured
  // severityOverride/statusOverride/deviceId, which the client never sends,
  // so the user's chosen severity/status were silently discarded in favor
  // of tag-based auto-defaults every time, and device info was never saved.
  const {
    siteId,
    capturedAt,
    geoLat,
    geoLng,
    gps,
    deviceInfo,
    tags = [],
    status: statusOverride,
    severity: severityOverride,
    inspectionId,
    capturedBy,
    captureSource = 'Live',
    notes,
    transcription,
    capturedByName,
    pairedWithId,
  } = meta;

  // Accept gps: { lat, lng } from PWA as well as flat geoLat/geoLng
  const resolvedLat = geoLat != null ? geoLat : gps?.lat;
  const resolvedLng = geoLng != null ? geoLng : gps?.lng;

  if (!siteId) return json({ error: 'siteId required in metadata' }, 400);

  const mapping = await getLicenseMapping(env.DB, license.key);
  if (!mapping) return json({ error: 'FC workspace not provisioned for this license' }, 409);

  // Hash original bytes BEFORE any processing — chain of custody
  const photoBuf = await photoFile.arrayBuffer();
  const hash = await sha256Hex(photoBuf);

  // Generate photo ID
  const photoId = `FC-P-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const ext = (photoFile.type || 'image/jpeg').split('/')[1] || 'jpg';
  const r2Key = photoKey(license.key, siteId, photoId, ext);

  await putObject(env.FC_PHOTOS, r2Key, photoBuf, photoFile.type || 'image/jpeg');

  // Resolve OHSA references and auto-defaults from tags
  const ohsaRefs = resolveOhsaRefs(tags).join(', ');
  const severity = severityOverride || getSeverityDefault(tags);
  const status = statusOverride || getAutoStatus(tags);

  // Handle optional voice note upload (if included as separate field)
  let voiceR2Key = null;
  const voiceFile = formData.get('voice');
  if (voiceFile) {
    // voiceNoteId isn't something the client ever sends (filePhoto() sends
    // a `voiceNote` field for something else entirely, not a pre-assigned
    // R2 key id) — this used to reference an undefined variable removed
    // during an earlier field-name cleanup, crashing with a ReferenceError
    // (500) on every photo upload that included a voice recording.
    const vId = `FC-V-${Date.now()}`;
    voiceR2Key = voiceKey(license.key, siteId, vId);
    await putObject(env.FC_VOICE, voiceR2Key, await voiceFile.arrayBuffer(), 'audio/mp4');
  }

  // Build caption (first 80 chars of voice note transcript if available, else empty)
  const caption = meta.caption
    ? meta.caption.slice(0, 80)
    : `Photo at ${new Date(capturedAt || Date.now()).toUTCString()}`;

  // Create Notion record. Uses the shared client (lib/notion.js), which
  // throws on a non-ok response — the handler previously rolled its own
  // fetch-and-.json() client that never checked res.ok, so a rejected
  // write (e.g. an unknown property, a bad relation id) still returned
  // page.id === undefined and this endpoint still answered 201 "success."
  // The photo/voice bytes are already safely in R2 (chain of custody
  // preserved) by this point even if the Notion record fails below.
  const notion = makeClient(env.NOTION_TOKEN);
  let page;
  try {
    page = await notion.post('/pages', {
      parent: { database_id: mapping.photos_db_id },
      properties: {
        'Caption': { title: [{ text: { content: caption } }] },
        'Site': { relation: [{ id: siteId }] },
        'Captured At': capturedAt ? { date: { start: capturedAt } } : undefined,
        'Captured By': capturedBy ? { relation: [{ id: capturedBy }] } : undefined,
        'Geo Lat': resolvedLat != null ? { number: parseFloat(resolvedLat) } : undefined,
        'Geo Lng': resolvedLng != null ? { number: parseFloat(resolvedLng) } : undefined,
        'Device ID': deviceInfo ? { rich_text: [{ text: { content: String(deviceInfo).slice(0, 200) } }] } : undefined,
        'Tags': { multi_select: tags.map(t => ({ name: t })) },
        'OHSA References': { rich_text: [{ text: { content: ohsaRefs } }] },
        'Status': { select: { name: status } },
        'Severity': { select: { name: severity } },
        'Inspection': inspectionId ? { relation: [{ id: inspectionId }] } : undefined,
        'Hash': { rich_text: [{ text: { content: hash } }] },
        'Notes': notes ? { rich_text: [{ text: { content: String(notes).slice(0, 2000) } }] } : undefined,
        'Transcription': transcription ? { rich_text: [{ text: { content: String(transcription).slice(0, 2000) } }] } : undefined,
        'Voice Key': voiceR2Key ? { rich_text: [{ text: { content: voiceR2Key } }] } : undefined,
        'Photo Key': { rich_text: [{ text: { content: r2Key } }] },
        'Captured By Name': capturedByName ? { rich_text: [{ text: { content: capturedByName } }] } : undefined,
      },
    });
  } catch (e) {
    // Log so `wrangler tail` shows the real Notion rejection detail without
    // needing a manual curl reproduction every time this happens.
    console.error('Photo Notion write failed:', e.message || e);
    return json({ error: 'Failed to create photo record', detail: String(e.message || e), r2Key }, 502);
  }

  // Before/after pairing — best-effort, after the main record is safely
  // saved. Confirmed empirically (Pair: Before and Pair: After are each
  // an independent, self-syncing two-way Notion relation — NOT cross-linked
  // to each other): patching 'Pair: Before' on just the new "after" photo
  // is enough; Notion automatically mirrors it onto the "before" photo's
  // own 'Pair: Before' too. Patching 'Pair: After' as well (tried first)
  // does NOT create the intended before->after / after->before cross-link —
  // it independently self-syncs the same way, leaving both photos with
  // both properties pointing at each other, which is redundant and
  // confuses the client's before-vs-after label logic. A failure here
  // doesn't fail the upload; the photo itself is already saved by now.
  if (pairedWithId) {
    try {
      await notion.patch(`/pages/${page.id}`, {
        properties: { 'Pair: Before': { relation: [{ id: pairedWithId }] } },
      });
    } catch (e) {
      console.error('Before/after pairing failed (photo still saved):', e.message || e);
    }
  }

  return json({
    photoId: page.id,
    hash,
    r2Key,
    status,
    severity,
    ohsaRefs,
  }, 201);
}

/**
 * PATCH /fc/photo/:id
 * Body (JSON, all optional): { caption, tags, severity, status, notes }.
 * Only the properties actually sent are touched.
 */
export async function handlePhotoUpdate(request, env, photoId) {
  const license = request._license;
  const mapping = await getLicenseMapping(env.DB, license.key);
  if (!mapping) return json({ error: 'FC workspace not provisioned for this license' }, 409);

  const body = await request.json().catch(() => ({}));
  const { caption, tags, severity, status, notes } = body;

  const properties = {};
  if (caption !== undefined) {
    properties['Caption'] = { title: [{ text: { content: String(caption).slice(0, 200) } }] };
  }
  if (Array.isArray(tags)) {
    properties['Tags'] = { multi_select: tags.map(t => ({ name: t })) };
    properties['OHSA References'] = { rich_text: [{ text: { content: resolveOhsaRefs(tags).join(', ') } }] };
  }
  if (severity !== undefined) properties['Severity'] = { select: { name: severity } };
  if (status !== undefined) properties['Status'] = { select: { name: status } };
  if (notes !== undefined) {
    properties['Notes'] = { rich_text: [{ text: { content: String(notes).slice(0, 2000) } }] };
  }

  if (Object.keys(properties).length === 0) return json({ error: 'Nothing to update' }, 400);

  const notion = makeClient(env.NOTION_TOKEN);
  try {
    await notion.patch(`/pages/${photoId}`, { properties });
  } catch (e) {
    console.error('Photo update failed:', e.message || e);
    return json({ error: 'Failed to update photo', detail: String(e.message || e) }, 502);
  }

  return json({ ok: true, photoId });
}

/**
 * DELETE /fc/photo/:id
 * Archives the Notion record (Notion's own trash — recoverable there, and
 * automatically excluded from GET /fc/site/:id's query going forward) —
 * deliberately not a hard delete. This is a compliance/evidence tool, so
 * "delete" here means "remove from view," not "destroy the record." The
 * R2 photo/voice bytes are left untouched for the same reason.
 */
export async function handlePhotoDelete(request, env, photoId) {
  const license = request._license;
  const mapping = await getLicenseMapping(env.DB, license.key);
  if (!mapping) return json({ error: 'FC workspace not provisioned for this license' }, 409);

  const notion = makeClient(env.NOTION_TOKEN);
  try {
    await notion.patch(`/pages/${photoId}`, { archived: true });
  } catch (e) {
    console.error('Photo delete failed:', e.message || e);
    return json({ error: 'Failed to delete photo', detail: String(e.message || e) }, 502);
  }

  return json({ ok: true, photoId });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status, headers: { 'Content-Type': 'application/json' },
  });
}
