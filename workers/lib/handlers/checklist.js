/**
 * GET /fc/checklist/:id
 * Returns checklist template — custom Notion records or seeded defaults.
 * :id can be a Notion page ID or one of the default IDs (FC-CL-001 … FC-CL-008).
 */

import CHECKLISTS from '../checklists/index.js';
import { makeClient } from '../notion.js';
import { requireLicenseMapping } from '../db.js';

const DEFAULT_MAP = Object.fromEntries(CHECKLISTS.map(c => [c.id, c]));

export async function handleChecklistGet(request, env, checklistId) {
  const license = request._license;

  // Serve bundled defaults without a Notion round-trip
  if (DEFAULT_MAP[checklistId]) {
    return json(DEFAULT_MAP[checklistId]);
  }

  await requireLicenseMapping(env.DB, license.id);
  const notion = makeClient(env.NOTION_TOKEN);

  const page = await notion.get(`/pages/${checklistId}`);
  const props = page.properties || {};

  return json({
    id: page.id,
    title: props['Checklist Title']?.title?.[0]?.plain_text || '',
    category: props['Category']?.select?.name || '',
    frequency: props['Required Frequency']?.select?.name || '',
    site_types: (props['Applies To Site Types']?.multi_select || []).map(s => s.name),
    regulatory_anchors: (props['Regulatory Anchors']?.multi_select || []).map(r => r.name),
    active: props['Active?']?.checkbox ?? true,
    default: props['Default?']?.checkbox ?? false,
    items: safeParseItems(props['Items']?.rich_text?.[0]?.plain_text),
  });
}

function safeParseItems(raw) {
  try { return JSON.parse(raw || '[]'); } catch { return []; }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status, headers: { 'Content-Type': 'application/json' },
  });
}
