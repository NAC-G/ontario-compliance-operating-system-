/**
 * GET /fc/site/:id
 * Returns site record + recent photos + open hazard count.
 *
 * POST /fc/site
 * Creates a new site. Body (JSON): { name, address? }.
 */

import { requireLicenseMapping } from '../db.js';
import { makeClient } from '../notion.js';
import { deriveThumbKey } from '../r2.js';

const PAGE_SIZE = 20;

function mapPhoto(p, env) {
  const photoKey = p.properties?.['Photo Key']?.rich_text?.[0]?.plain_text || '';
  const workerUrl = env.FC_WORKER_URL || 'https://ocos-fc.naturalalternatives.ca';
  const expires = Date.now() + 3600000;
  const signedUrlFor = key => `${workerUrl}/fc/dl?key=${encodeURIComponent(key)}&expires=${expires}`;
  // thumbnailUrl points at the small resized copy (see modules/image.js,
  // client-side) — not every photo has one (older uploads, or generation
  // failed at capture time), so the grid's <img> falls back to imageUrl
  // (the full-resolution original) on a 404, rather than this doing an
  // extra R2 existence check per photo here.
  const imageUrl = photoKey ? signedUrlFor(photoKey) : null;
  const thumbnailUrl = photoKey ? signedUrlFor(deriveThumbKey(photoKey)) : null;
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
    imageUrl,
    pairBeforeId: (p.properties?.['Pair: Before']?.relation || [])[0]?.id || null,
    pairAfterId: (p.properties?.['Pair: After']?.relation || [])[0]?.id || null,
  };
}

export async function handleSiteGet(request, env, siteId) {
  const license = request._license;
  await requireLicenseMapping(env.DB, license.key);

  const url = new URL(request.url);
  const cursor = url.searchParams.get('cursor') || undefined;

  const notion = makeClient(env.NOTION_TOKEN);
  const photosDbId = await getPhotosDbId(env.DB, license.key);

  // On a "load more" request (cursor present), skip re-fetching the site
  // page and open-hazard count — those describe the whole site, not this
  // page of photos, and the client already has them from the first load.
  const [sitePage, photosRes] = await Promise.all([
    cursor ? Promise.resolve(null) : notion.get(`/pages/${siteId}`),
    notion.post(`/databases/${photosDbId}/query`, {
      filter: { property: 'Site', relation: { contains: siteId } },
      sorts: [{ property: 'Captured At', direction: 'descending' }],
      page_size: PAGE_SIZE,
      start_cursor: cursor,
    }),
  ]);

  const photos = photosRes.results || [];
  const mapped = photos.map(p => mapPhoto(p, env));

  if (cursor) {
    // "Load more" page — just the next batch of photos to append.
    return json({
      photos: mapped,
      hasMore: !!photosRes.has_more,
      nextCursor: photosRes.next_cursor || null,
    });
  }

  // First page — also need the total open-hazard count across the whole
  // site (not just this page), which needs its own lightweight query
  // (only the Status property matters, but Notion's API doesn't support
  // fetching a subset of properties, so this still pulls full pages —
  // still far cheaper than what a "load everything to count it" approach
  // would cost as a site grows).
  const openHazards = await countOpenHazards(notion, photosDbId, siteId);

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
    photoCount: mapped.length, // count of THIS page — client tracks the running total as more pages load
    openHazards,
    hasMore: !!photosRes.has_more,
    nextCursor: photosRes.next_cursor || null,
    photos: mapped,
  });
}

// Open-hazard count across the whole site, capped at a few pages so a
// very large site can't turn a routine page load into an unbounded scan.
async function countOpenHazards(notion, photosDbId, siteId) {
  let count = 0;
  let cursor;
  for (let i = 0; i < 5; i++) { // up to 500 photos scanned for the count
    const res = await notion.post(`/databases/${photosDbId}/query`, {
      filter: {
        and: [
          { property: 'Site', relation: { contains: siteId } },
          { property: 'Status', select: { equals: 'Hazard - Open' } },
        ],
      },
      page_size: 100,
      start_cursor: cursor,
    });
    count += (res.results || []).length;
    if (!res.has_more) break;
    cursor = res.next_cursor;
  }
  return count;
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
