/**
 * GET /fc/site/:id
 * Returns site record + recent photos + open hazard count.
 *
 * POST /fc/site
 * Creates a new site. Body (JSON): { name, address? }.
 */

import { requireLicenseMapping } from '../db.js';
import { makeClient } from '../notion.js';

export async function handleSiteGet(request, env, siteId) {
  const license = request._license;
  await requireLicenseMapping(env.DB, license.key);

  const notion = makeClient(env.NOTION_TOKEN);

  const [sitePage, photosRes] = await Promise.all([
    notion.get(`/pages/${siteId}`),
    notion.post('/databases/' + (await getPhotosDbId(env.DB, license.key)) + '/query', {
      filter: { property: 'Site', relation: { contains: siteId } },
      sorts: [{ property: 'Captured At', direction: 'descending' }],
      page_size: 50,
    }),
  ]);

  const photos = photosRes.results || [];
  const openHazards = photos.filter(p =>
    p.properties?.['Status']?.select?.name === 'Hazard - Open'
  ).length;

  return json({
    tier: license.tier || 'T2',
    site: {
      id: sitePage.id,
      name: sitePage.properties?.['Site Name']?.title?.[0]?.plain_text || '',
      address: sitePage.properties?.['Address']?.rich_text?.[0]?.plain_text || '',
      geocode: sitePage.properties?.['Geocode']?.rich_text?.[0]?.plain_text || '',
      status: sitePage.properties?.['Status']?.select?.name || '',
      siteType: sitePage.properties?.['Site Type']?.select?.name || '',
      wahSite: sitePage.properties?.['WAH Site?']?.checkbox || false,
    },
    photoCount: photos.length,
    openHazards,
    photos: photos.slice(0, 20).map(p => {
      const photoKey = p.properties?.['Photo Key']?.rich_text?.[0]?.plain_text || '';
      const workerUrl = env.FC_WORKER_URL || 'https://ocos-fc.naturalalternatives.ca';
      const thumbnailUrl = photoKey
        ? `${workerUrl}/fc/dl?key=${encodeURIComponent(photoKey)}&expires=${Date.now() + 3600000}`
        : null;
      return {
        id: p.id,
        caption: p.properties?.['Caption']?.title?.[0]?.plain_text || '',
        status: p.properties?.['Status']?.select?.name || '',
        severity: p.properties?.['Severity']?.select?.name || '',
        capturedAt: p.properties?.['Captured At']?.date?.start || null,
        tags: (p.properties?.['Tags']?.multi_select || []).map(t => t.name),
        ohsaRefs: p.properties?.['OHSA References']?.rich_text?.[0]?.plain_text || '',
        hash: p.properties?.['Hash']?.rich_text?.[0]?.plain_text || '',
        capturedByName: p.properties?.['Captured By Name']?.rich_text?.[0]?.plain_text || '',
        geoLat: p.properties?.['Geo Lat']?.number ?? null,
        geoLng: p.properties?.['Geo Lng']?.number ?? null,
        notes: p.properties?.['Notes']?.rich_text?.[0]?.plain_text || '',
        transcription: p.properties?.['Transcription']?.rich_text?.[0]?.plain_text || '',
        voiceKey: p.properties?.['Voice Key']?.rich_text?.[0]?.plain_text || '',
        photoKey,
        thumbnailUrl,
        pairBeforeId: (p.properties?.['Pair: Before']?.relation || [])[0]?.id || null,
        pairAfterId: (p.properties?.['Pair: After']?.relation || [])[0]?.id || null,
      };
    }),
  });
}

export async function handleSiteCreate(request, env) {
  const license = request._license;
  const mapping = await requireLicenseMapping(env.DB, license.key);

  const body = await request.json().catch(() => ({}));
  const name = (body.name || '').trim();
  if (!name) return json({ error: 'name required' }, 400);
  const address = (body.address || '').trim();

  const notion = makeClient(env.NOTION_TOKEN);
  let page;
  try {
    page = await notion.post('/pages', {
      parent: { database_id: mapping.sites_db_id },
      properties: {
        'Site Name': { title: [{ text: { content: name } }] },
        'Address': address ? { rich_text: [{ text: { content: address } }] } : undefined,
        'Status': { select: { name: 'Active' } },
        'Site Type': { select: { name: 'Residential' } },
        'WAH Site?': { checkbox: false },
      },
    });
  } catch (e) {
    console.error('Site Notion write failed:', e.message || e);
    return json({ error: 'Failed to create site', detail: String(e.message || e) }, 502);
  }

  return json({
    id: page.id,
    name,
    address,
    status: 'Active',
    siteType: 'Residential',
  }, 201);
}

async function getPhotosDbId(db, licenseId) {
  const m = await db.prepare('SELECT photos_db_id FROM fc_license_mapping WHERE license_id=?').bind(licenseId).first();
  return m?.photos_db_id;
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status, headers: { 'Content-Type': 'application/json' },
  });
}
