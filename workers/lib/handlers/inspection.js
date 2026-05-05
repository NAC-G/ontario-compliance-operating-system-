/**
 * POST /fc/inspection        — create inspection record
 * POST /fc/inspection/:id/signoff — append signature
 */

import { requireLicenseMapping } from '../db.js';
import { makeClient } from '../notion.js';
import { putObject } from '../r2.js';

export async function handleInspectionCreate(request, env) {
  const license = request._license;
  const mapping = await requireLicenseMapping(env.DB, license.id);
  const body = await request.json();

  const {
    title, type, siteId, date, leadId,
    attendeeIds = [], checklistId, topicReference, notes,
  } = body;

  if (!title || !type || !siteId) {
    return json({ error: 'title, type, siteId required' }, 400);
  }

  const notion = makeClient(env.NOTION_TOKEN);

  const props = {
    'Inspection Title': { title: [{ text: { content: title } }] },
    'Type': { select: { name: type } },
    'Site': { relation: [{ id: siteId }] },
    'Status': { select: { name: 'Draft' } },
  };

  if (date) props['Date'] = { date: { start: date } };
  if (leadId) props['Lead'] = { relation: [{ id: leadId }] };
  if (attendeeIds.length) props['Attendees'] = { relation: attendeeIds.map(id => ({ id })) };
  if (checklistId) props['Checklist'] = { relation: [{ id: checklistId }] };
  if (topicReference) props['Topic Reference'] = { rich_text: [{ text: { content: topicReference } }] };
  if (notes) props['Notes'] = { rich_text: [{ text: { content: notes } }] };

  const page = await notion.post('/pages', {
    parent: { database_id: mapping.inspections_db_id },
    properties: props,
  });

  return json({ inspectionId: page.id }, 201);
}

export async function handleInspectionSignoff(request, env, inspectionId) {
  const license = request._license;
  await requireLicenseMapping(env.DB, license.id);

  const formData = await request.formData();
  const sigFile = formData.get('signature');
  const meta = JSON.parse(formData.get('metadata') || '{}');
  const { workerId, method = 'Drawn Sig', timestamp } = meta;

  if (!sigFile && !meta.pin) {
    return json({ error: 'signature file or PIN required' }, 400);
  }

  const notion = makeClient(env.NOTION_TOKEN);

  // Upload signature image to R2
  let sigUrl = null;
  if (sigFile) {
    const key = `${license.id}/signatures/${inspectionId}-${workerId || 'anon'}-${Date.now()}.png`;
    await putObject(env.FC_PHOTOS, key, await sigFile.arrayBuffer(), 'image/png');
    sigUrl = key;
  }

  // Fetch existing page to update
  const existing = await notion.get(`/pages/${inspectionId}`);
  const existingNotes = existing.properties?.['Notes']?.rich_text?.[0]?.plain_text || '';

  const sigEntry = JSON.stringify({
    workerId: workerId || 'unknown',
    method,
    timestamp: timestamp || new Date().toISOString(),
    sigR2Key: sigUrl,
    pin: meta.pin ? '[PIN]' : undefined,
  });

  await notion.patch(`/pages/${inspectionId}`, {
    properties: {
      'Notes': {
        rich_text: [{
          text: {
            content: existingNotes
              ? `${existingNotes}\n\nSIGNOFF: ${sigEntry}`
              : `SIGNOFF: ${sigEntry}`,
          },
        }],
      },
    },
  });

  return json({ ok: true, inspectionId });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status, headers: { 'Content-Type': 'application/json' },
  });
}
