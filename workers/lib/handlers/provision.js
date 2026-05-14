/**
 * POST /fc/provision
 * Internal endpoint — called by nacosapp on checkout.session.completed.
 * Authenticated via X-FC-Internal shared secret.
 *
 * Body: { licenseId, tier, clientName, clientLicensePageId? }
 */

import { validateInternalSecret } from '../auth.js';
import { makeClient, ensureFCModulePage, ensureClientLicenseBrandingColumns, provisionFCDatabases } from '../notion.js';
import CHECKLISTS from '../checklists/index.js';

export async function handleProvision(request, env) {
  await validateInternalSecret(request, env);

  const { licenseId, tier, clientName, clientLicensePageId } = await request.json();
  if (!licenseId || !tier) {
    return json({ error: 'licenseId and tier required' }, 400);
  }

  // Idempotency: if already provisioned, return cached result
  const idempKey = `provision:${licenseId}`;
  const cached = await env.DB.prepare('SELECT result FROM fc_idempotency WHERE key=?').bind(idempKey).first();
  if (cached) return json(JSON.parse(cached.result));

  const notion = makeClient(env.NOTION_TOKEN);
  const inHousePageId = env.IN_HOUSE_PAGE_ID;
  const clientLicensesCollectionId = env.CLIENT_LICENSES_COLLECTION_ID;

  // Step 1: ensure FC Module container page exists
  const fcModulePageId = await ensureFCModulePage(notion, inHousePageId);

  // Step 2: ensure Client Licenses DB has branding columns (idempotent, non-fatal)
  let accessibleClientLicensesDbId = null;
  try {
    await ensureClientLicenseBrandingColumns(notion, clientLicensesCollectionId);
    accessibleClientLicensesDbId = clientLicensesCollectionId;
  } catch (e) {
    console.warn('PROVISION: skipped branding columns (integration lacks Client Licenses access):', e.message);
  }

  // Step 3: create 7 FC databases for this client
  const dbs = await provisionFCDatabases(notion, {
    fcModulePageId,
    clientLicensesDbId: accessibleClientLicensesDbId,
    licenseId,
    tier,
    clientName: clientName || '',
  });

  // Step 4: seed 8 default checklists into FC-Checklists
  await seedChecklists(notion, dbs.checklists);

  // Step 5: persist mapping to D1
  await env.DB.prepare(`
    INSERT INTO fc_license_mapping
      (license_id, tier, client_page_id, sites_db_id, photos_db_id, inspections_db_id,
       workers_db_id, reports_db_id, checklists_db_id, style_samples_db_id, provisioned_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?)
  `).bind(
    licenseId, tier, dbs.clientPage, dbs.sites, dbs.photos,
    dbs.inspections, dbs.workers, dbs.reports, dbs.checklists,
    dbs.styleSamples || null, new Date().toISOString(),
  ).run();

  const result = { ok: true, licenseId, tier, dbs };

  // Cache for idempotency
  await env.DB.prepare('INSERT INTO fc_idempotency (key, result, created_at) VALUES (?,?,?)')
    .bind(idempKey, JSON.stringify(result), new Date().toISOString())
    .run();

  return json(result);
}

async function seedChecklists(notion, checklistsDbId) {
  for (const cl of CHECKLISTS) {
    await notion.post('/pages', {
      parent: { database_id: checklistsDbId },
      properties: {
        'Checklist Title': { title: [{ text: { content: cl.title } }] },
        'Category': { select: { name: cl.category } },
        'Items': { rich_text: [{ text: { content: JSON.stringify(cl.items) } }] },
        'Required Frequency': { select: { name: cl.frequency } },
        'Applies To Site Types': { multi_select: cl.site_types.map(s => ({ name: s })) },
        'Regulatory Anchors': { multi_select: cl.regulatory_anchors.map(r => ({ name: r })) },
        'Active?': { checkbox: true },
        'Default?': { checkbox: true },
      },
    });
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
