/**
 * GET /fc/site/:id
 * Returns site record + recent photos + open hazard count.
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
    photos: photos.slice(0, 20).map(p => ({
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
      photoKey: p.properties?.['Photo Key']?.rich_text?.[0]?.plain_text || '',
      pairBeforeId: (p.properties?.['Pair: Before']?.relation || [])[0]?.id || null,
      pairAfterId: (p.properties?.['Pair: After']?.relation || [])[0]?.id || null,
    })),
  });
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
