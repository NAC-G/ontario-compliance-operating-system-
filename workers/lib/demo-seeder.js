/**
 * Demo data seeder for OCOS Field Compliance.
 * Creates 1 site, 2 workers, 6 photos, 1 toolbox talk, 1 locked PDF report.
 * Idempotent — guarded by fc_idempotency key `demo_seed:{licenseId}`.
 *
 * Called via POST /fc/demo/seed after license validation + mapping check.
 * Makes the workspace look like a real Cornwall, ON residential site.
 */

import { makeClient } from './notion.js';
import { generateReport } from './pdf-generator.js';
import { sha256Hex } from './hash.js';
import { photoKey, reportKey, putObject } from './r2.js';
import { checkIdempotency, setIdempotency, recordAuditIndex } from './db.js';

// Pre-written realistic inspection summary (skip Claude API call in seeder — fast, predictable, offline-safe)
const DEMO_AI_BODY =
  'Site walkthrough conducted at Demo Site — 4330 Billy Bill Rd, Cornwall ON between April 28–30, 2026. ' +
  'This toolbox talk addressed Working at Heights procedures and fall protection requirements under OReg 213/91 ' +
  'Part III. Two workers attended and signed off on receipt of instruction.\n\n' +

  'A critical fall hazard was identified on the east scaffold deck at the 4th lift: guardrails absent along the ' +
  'leading edge at approximately 5.5 m AGL. Flagged under OReg 213/91 s.26 and OHSA s.25(2)(a). No work at heights ' +
  'above 3 m may resume at that elevation until compliant guardrailing is installed or an approved personal fall ' +
  'arrest system is in use by each exposed worker.\n\n' +

  'A WHMIS labelling deficiency was noted at the mixer station: a secondary container of concrete dissolver carried ' +
  'a hand-written label only, without a WHMIS GHS-compliant label or SDS accessible on-site. Corrective action ' +
  'required under OHSA s.38 and WHMIS 2015 before further use of the product. A slip-and-trip hazard at grid B-6 ' +
  '(rebar offcuts and form lumber on the main access path) was identified and corrected within the same shift — ' +
  'rebar binned, lumber staged to the designated laydown zone. All PPE was observed compliant at point of entry. ' +
  'Extension ladder at the north wall inspected and confirmed compliant with OReg 213/91 s.73.';

const DEMO_PHOTOS = [
  {
    slug: 'wah-guardrail-missing',
    caption: 'Guardrail absent — east scaffold deck, 4th lift (~5.5 m AGL)',
    tags: ['WAH-3M', 'FP-GUARDRAIL-MISSING'],
    ohsa: 'OReg 213/91 s.26, OHSA s.25(2)(a)',
    status: 'Hazard - Open',
    severity: 'Critical',
    capturedAt: '2026-04-28T08:14:00Z',
    geoLat: 45.02890,
    geoLng: -74.78310,
    capturedByIndex: 0,   // craig
  },
  {
    slug: 'ppe-entry-check',
    caption: 'PPE entry check — hard hats, hi-vis vests, CSA steel-toed boots — all crew compliant',
    tags: ['PPE-COMPLIANT'],
    ohsa: 'OHSA s.25(1)(b)',
    status: 'Routine',
    severity: 'Low',
    capturedAt: '2026-04-28T08:22:00Z',
    geoLat: 45.02891,
    geoLng: -74.78312,
    capturedByIndex: 0,   // craig
  },
  {
    slug: 'ladder-pre-shift',
    caption: '24 ft fibreglass extension ladder — pre-shift inspection, north wall, 4:1 ratio set',
    tags: ['LADDER-INSPECT'],
    ohsa: 'OReg 213/91 s.73',
    status: 'Inspection',
    severity: 'Info',
    capturedAt: '2026-04-29T07:55:00Z',
    geoLat: 45.02889,
    geoLng: -74.78308,
    capturedByIndex: 1,   // demo worker
  },
  {
    slug: 'whmis-label-missing',
    caption: 'Secondary container — concrete dissolver, hand-written label only, no WHMIS GHS label on-site',
    tags: ['WHMIS-LABEL-MISSING', 'WHMIS-GHS7'],
    ohsa: 'OHSA s.38, WHMIS 2015',
    status: 'Hazard - Open',
    severity: 'Med',
    capturedAt: '2026-04-29T10:42:00Z',
    geoLat: 45.02887,
    geoLng: -74.78315,
    capturedByIndex: 0,   // craig
  },
  {
    slug: 'hk-slip-trip-before',
    caption: 'Slip-trip hazard — rebar offcuts and form lumber on main access path, grid B-6 (BEFORE)',
    tags: ['HOUSE-SLIP-TRIP', 'HOUSE-DEBRIS'],
    ohsa: 'OHSA s.25(1)(c)',
    status: 'Hazard - Open',
    severity: 'Med',
    capturedAt: '2026-04-30T09:08:00Z',
    geoLat: 45.02892,
    geoLng: -74.78319,
    capturedByIndex: 1,   // demo worker
  },
  {
    slug: 'hk-slip-trip-after',
    caption: 'Access path cleared — rebar binned, lumber staged to designated laydown zone (AFTER)',
    tags: ['HOUSE-SLIP-TRIP'],
    ohsa: 'OHSA s.25(1)(c)',
    status: 'Hazard - Corrected',
    severity: 'Low',
    capturedAt: '2026-04-30T14:33:00Z',
    geoLat: 45.02892,
    geoLng: -74.78319,
    capturedByIndex: 1,   // demo worker
  },
];

export async function seedDemoData(env, license, mapping) {
  const idempKey = `demo_seed:${license.key}`;
  const existing = await checkIdempotency(env.DB, idempKey);
  if (existing) return existing;

  const notion = makeClient(env.NOTION_TOKEN);

  // ── 1. Site ────────────────────────────────────────────────────────────────
  const sitePage = await notion.post('/pages', {
    parent: { database_id: mapping.sites_db_id },
    properties: {
      'Site Name': { title: [{ text: { content: 'Demo Site — 4330 Billy Bill Rd, Cornwall ON' } }] },
      'Address':  { rich_text: [{ text: { content: '4330 Billy Bill Rd, Cornwall, ON K6H 5R6' } }] },
      'Geocode':  { rich_text: [{ text: { content: '45.02890, -74.78310' } }] },
      'Status':   { select: { name: 'Active' } },
      'Site Type': { select: { name: 'Residential' } },
      'WAH Site?': { checkbox: true },
    },
  });
  const siteId = sitePage.id;

  // ── 2. Workers ─────────────────────────────────────────────────────────────
  const [craigPage, demoWorkerPage] = await Promise.all([
    notion.post('/pages', {
      parent: { database_id: mapping.workers_db_id },
      properties: {
        'Name': { title: [{ text: { content: 'Craig MacIntosh' } }] },
        'Role': { select: { name: 'Supervisor' } },
        'Sites': { relation: [{ id: siteId }] },
        'WAH Trained?': { checkbox: true },
        'WAH Cert Expiry': { date: { start: '2027-03-15' } },
        'WHMIS Trained?': { checkbox: true },
        'WHMIS Refresh Due': { date: { start: '2027-01-10' } },
        'Sign-off Method': { select: { name: 'Drawn Sig' } },
        'Active?': { checkbox: true },
      },
    }),
    notion.post('/pages', {
      parent: { database_id: mapping.workers_db_id },
      properties: {
        'Name': { title: [{ text: { content: 'Demo Worker' } }] },
        'Role': { select: { name: 'Worker' } },
        'Sites': { relation: [{ id: siteId }] },
        'WAH Trained?': { checkbox: true },
        'WAH Cert Expiry': { date: { start: '2026-11-20' } },
        'WHMIS Trained?': { checkbox: true },
        'WHMIS Refresh Due': { date: { start: '2026-10-01' } },
        'Sign-off Method': { select: { name: 'Drawn Sig' } },
        'Active?': { checkbox: true },
      },
    }),
  ]);
  const workerIds = [craigPage.id, demoWorkerPage.id];

  // ── 3. Photos ──────────────────────────────────────────────────────────────
  const photoIds = [];
  const photoHashes = [];

  for (const [i, spec] of DEMO_PHOTOS.entries()) {
    const photoBytes = buildPlaceholderBytes(i, spec.slug);
    const hash = await sha256Hex(photoBytes);
    photoHashes.push(hash);

    const r2PhotoId = `DEMO-P-${String(i + 1).padStart(2, '0')}-${spec.slug}`;
    const key = photoKey(license.key, siteId, r2PhotoId, 'jpg');
    try {
      await putObject(env.FC_PHOTOS, key, photoBytes, 'image/jpeg');
    } catch { /* R2 optional in local dev */ }

    const photoPage = await notion.post('/pages', {
      parent: { database_id: mapping.photos_db_id },
      properties: {
        'Caption':         { title: [{ text: { content: spec.caption } }] },
        'Site':            { relation: [{ id: siteId }] },
        'Captured At':     { date: { start: spec.capturedAt } },
        'Captured By':     { relation: [{ id: workerIds[spec.capturedByIndex] }] },
        'Geo Lat':         { number: spec.geoLat },
        'Geo Lng':         { number: spec.geoLng },
        'Device ID':       { rich_text: [{ text: { content: 'DEMO-DEVICE-001' } }] },
        'Tags':            { multi_select: spec.tags.map(t => ({ name: t })) },
        'OHSA References': { rich_text: [{ text: { content: spec.ohsa } }] },
        'Status':          { select: { name: spec.status } },
        'Severity':        { select: { name: spec.severity } },
        'Hash':            { rich_text: [{ text: { content: hash } }] },
        'Photo Key':       { rich_text: [{ text: { content: key } }] },
      },
    });
    photoIds.push(photoPage.id);
  }

  // Pair before/after on the corrected housekeeping photo
  await notion.patch(`/pages/${photoIds[5]}`, {
    properties: { 'Pair: Before': { relation: [{ id: photoIds[4] }] } },
  }).catch(() => {});

  // ── 4. Toolbox Talk Inspection (with embedded sign-offs) ───────────────────
  const signoffTs1 = '2026-04-30T10:15:00Z';
  const signoffTs2 = '2026-04-30T10:16:00Z';
  const inspectionNotes = [
    'Toolbox talk conducted April 30, 2026 — 10:00 AM. Duration: approx. 18 minutes.',
    'Topic: Working at Heights & Fall Protection per OReg 213/91 Part III.',
    '',
    'Items covered:',
    '• Guardrail installation requirements (s.26) — height threshold, top rail / mid rail / toe board',
    '• Personal fall arrest system inspection and donning (s.26.1–26.9)',
    '• Competency requirements for WAH workers (OHSA s.25(2)(a))',
    '• 3-point contact on ladders, angle check, footing inspection (OReg 213/91 s.73)',
    '• Scaffold daily inspection — who signs off, what to look for (OReg 213/91 Part III)',
    '',
    'Open items raised:',
    '• East scaffold, 4th lift — guardrail absent. Work order raised. No WAH work until corrected.',
    '• WHMIS label deficiency at mixer station — owner to resolve by EOD.',
    '',
    `SIGNOFF: {"workerId":"${workerIds[0]}","role":"Supervisor","method":"Drawn Sig","timestamp":"${signoffTs1}","ipPrefix":"172.56."}`,
    `SIGNOFF: {"workerId":"${workerIds[1]}","role":"Worker","method":"Drawn Sig","timestamp":"${signoffTs2}","ipPrefix":"172.56."}`,
  ].join('\n');

  const inspectionPage = await notion.post('/pages', {
    parent: { database_id: mapping.inspections_db_id },
    properties: {
      'Inspection Title': { title: [{ text: { content: 'Working at Heights & Fall Protection — Toolbox Talk' } }] },
      'Type':     { select: { name: 'Toolbox Talk' } },
      'Site':     { relation: [{ id: siteId }] },
      'Date':     { date: { start: '2026-04-30' } },
      'Topic Reference': { rich_text: [{ text: { content: 'OReg 213/91 Part III — Working at Heights; guardrail, PFAS, competency' } }] },
      'Notes':    { rich_text: [{ text: { content: inspectionNotes } }] },
      'Status':   { select: { name: 'Complete' } },
    },
  });
  const inspectionId = inspectionPage.id;

  // ── 5. Generate + Lock PDF Report ─────────────────────────────────────────
  const generatedAt = '2026-05-01T09:00:00Z';
  const lockedAt    = '2026-05-01T09:02:00Z';

  const siteObj = {
    id: siteId,
    name: 'Demo Site — 4330 Billy Bill Rd, Cornwall ON',
    address: '4330 Billy Bill Rd, Cornwall, ON K6H 5R6',
    geocode: '45.02890, -74.78310',
    siteType: 'Residential',
    wahSite: true,
  };

  const inspectionObj = {
    id: inspectionId,
    title: 'Working at Heights & Fall Protection — Toolbox Talk',
    type: 'Toolbox Talk',
    date: '2026-04-30',
    leadName: 'Craig MacIntosh',
    leadRole: 'Owner / Supervisor',
    notes: inspectionNotes,
    status: 'Complete',
    dateRangeStart: '2026-04-28',
    dateRangeEnd: '2026-04-30',
  };

  const photoRecords = DEMO_PHOTOS.map((spec, i) => ({
    photoId:        photoIds[i],
    caption:        spec.caption,
    capturedAt:     spec.capturedAt,
    capturedAtLocal: spec.capturedAt.replace('T', ' ').replace('Z', ' UTC'),
    geoLat:         spec.geoLat,
    geoLng:         spec.geoLng,
    deviceId:       'DEMO-DEVICE-001',
    tags:           spec.tags,
    ohsaRefs:       spec.ohsa,
    hash:           photoHashes[i],
    status:         spec.status,
    severity:       spec.severity,
  }));

  const signoffs = [
    { workerId: workerIds[0], role: 'Supervisor', method: 'Drawn Sig', timestamp: signoffTs1, ipPrefix: '172.56.' },
    { workerId: workerIds[1], role: 'Worker',     method: 'Drawn Sig', timestamp: signoffTs2, ipPrefix: '172.56.' },
  ];

  const regulatoryAnchors = [
    'OReg 213/91 s.26',
    'OReg 213/91 Part III',
    'OReg 213/91 s.73',
    'OHSA s.25(2)(a)',
    'OHSA s.25(1)(b)',
    'OHSA s.25(1)(c)',
    'OHSA s.38',
    'WHMIS 2015',
  ];

  // Create Notion report page first to obtain the page ID for the R2 key
  const reportPage = await notion.post('/pages', {
    parent: { database_id: mapping.reports_db_id },
    properties: {
      'Report Title': { title: [{ text: { content: 'Toolbox Talk Record — Demo Site, Apr 28–30 2026' } }] },
      'Type':         { select: { name: 'Toolbox Talk Record' } },
      'Site':         { relation: [{ id: siteId }] },
      'Inspection':   { relation: [{ id: inspectionId }] },
      'Version':      { number: 1 },
      'Photo Count':  { number: photoIds.length },
      'Date Range Start': { date: { start: '2026-04-28' } },
      'Date Range End':   { date: { start: '2026-04-30' } },
      'Locked?':      { checkbox: false },
      'PDF Hash':     { rich_text: [{ text: { content: '' } }] },
      'Recipients':   { rich_text: [{ text: { content: '[]' } }] },
      'Send History': { rich_text: [{ text: { content: '[]' } }] },
      'Audit Appendix Included?': { checkbox: true },
      'Branding Profile': { select: { name: 'NAC Default' } },
      'Style-Conditioned?': { checkbox: false },
    },
  });
  const reportNotionId = reportPage.id;

  const reportMeta = {
    id: reportNotionId,
    version: 1,
    generatedAt,
    generatedBy: 'OCOS Demo Seeder',
    licenseId: license.key,
  };

  let pdfHash = 'demo-pdf-unavailable';
  let locked = false;

  try {
    const pdfBytes = await generateReport({
      reportType: 'Toolbox Talk Record',
      site:       siteObj,
      inspection: inspectionObj,
      photos:     photoRecords,
      signoffs,
      regulatoryAnchors,
      branding:   {},
      report:     reportMeta,
      licenseeName: license.client_name || 'Demo Licensee',
      aiBody:     DEMO_AI_BODY,
    });

    pdfHash = await sha256Hex(pdfBytes.buffer);
    const r2Key = reportKey(license.key, reportNotionId, 1);
    await putObject(env.FC_REPORTS, r2Key, pdfBytes, 'application/pdf');
    locked = true;
  } catch (e) {
    console.error('[demo-seeder] PDF generation failed:', e.message);
  }

  // Update Notion page with final lock status
  const lockPatch = {
    'PDF Hash': { rich_text: [{ text: { content: pdfHash } }] },
    'Locked?':  { checkbox: locked },
  };
  if (locked) lockPatch['Locked At'] = { date: { start: lockedAt } };
  await notion.patch(`/pages/${reportNotionId}`, { properties: lockPatch });

  if (locked) {
    await recordAuditIndex(env.DB, {
      reportId: reportNotionId,
      reportNotionPageId: reportNotionId,
      pdfHash,
      licenseId: license.key,
      siteId,
    });
  }

  const result = {
    ok: true,
    seeded: true,
    siteId,
    workerIds: { craig: workerIds[0], demoWorker: workerIds[1] },
    photoIds,
    inspectionId,
    reportId: reportNotionId,
    reportLocked: locked,
    pdfHash,
  };

  await setIdempotency(env.DB, idempKey, result);
  return result;
}

// Unique placeholder bytes per photo — gives each a distinct SHA-256
function buildPlaceholderBytes(index, slug) {
  return new TextEncoder().encode(`OCOS-DEMO-PHOTO:${index}:${slug}:Cornwall-ON:2026`).buffer;
}
