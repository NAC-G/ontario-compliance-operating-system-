/**
 * Phase 1.1 Test Fixtures — seed-fixtures.js
 *
 * Creates a deterministic, verifiable test workspace:
 *   1 site, 2 workers, 5 photos (mixed tags/status), 1 toolbox talk
 *   Report A — unlocked v1 (regenerable draft)
 *   Report B — locked v1 (with 3-recipient Send History)
 *   Report C — v2 linked to Report B as Parent Report
 *   3 active style samples + 1 inactive (T3 path, skipped if not provisioned)
 *   End-to-end hash verify: sha256(Report_B_pdf) === Report_B.PDF_Hash in Notion
 *
 * Idempotent — guarded by fc_idempotency key `fixtures_v1:{licenseId}`.
 * Triggered via POST /fc/fixtures/seed (validated + mapping-checked in worker).
 */

import { makeClient } from './notion.js';
import { generateReport } from './pdf-generator.js';
import { sha256Hex } from './hash.js';
import { photoKey, reportKey, putObject } from './r2.js';
import { checkIdempotency, setIdempotency, recordAuditIndex } from './db.js';

const FIXTURE_PHOTOS = [
  {
    slug: 'wah-guardrail-open',
    caption: 'Guardrail absent — east scaffold deck 4th lift, approx 5.5 m AGL',
    tags: ['WAH-3M', 'FP-GUARDRAIL-MISSING'],
    ohsa: 'OReg 213/91 s.26, OHSA s.25(2)(a)',
    status: 'Hazard - Open',
    severity: 'Critical',
    capturedAt: '2026-04-28T08:14:00Z',
    geoLat: 45.02890,
    geoLng: -74.78310,
    capturedByIndex: 0,
  },
  {
    slug: 'ppe-entry-compliant',
    caption: 'PPE entry check — hard hats, hi-vis vests, CSA steel-toed boots, all crew compliant',
    tags: ['PPE-COMPLIANT'],
    ohsa: 'OHSA s.25(1)(b)',
    status: 'Routine',
    severity: 'Low',
    capturedAt: '2026-04-28T08:22:00Z',
    geoLat: 45.02891,
    geoLng: -74.78312,
    capturedByIndex: 0,
  },
  {
    slug: 'ladder-pre-shift',
    caption: '24 ft fibreglass extension ladder — pre-shift inspection, north wall, 4:1 ratio confirmed',
    tags: ['LADDER-INSPECT'],
    ohsa: 'OReg 213/91 s.73',
    status: 'Inspection',
    severity: 'Info',
    capturedAt: '2026-04-29T07:55:00Z',
    geoLat: 45.02889,
    geoLng: -74.78308,
    capturedByIndex: 1,
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
    capturedByIndex: 0,
  },
  {
    slug: 'hk-slip-trip-corrected',
    caption: 'Access path cleared — rebar binned, lumber staged to designated laydown zone (AFTER)',
    tags: ['HOUSE-SLIP-TRIP'],
    ohsa: 'OHSA s.25(1)(c)',
    status: 'Hazard - Corrected',
    severity: 'Low',
    capturedAt: '2026-04-30T14:33:00Z',
    geoLat: 45.02892,
    geoLng: -74.78319,
    capturedByIndex: 1,
  },
];

const FIXTURE_AI_BODY =
  'Fixture inspection walkthrough at Test Site — Cornwall ON, April 28–30 2026. ' +
  'Toolbox talk covered Working at Heights (OReg 213/91 Part III) and WHMIS 2015 ' +
  'labelling obligations. Two workers attended and signed off.\n\n' +
  'Critical WAH deficiency on east scaffold deck (4th lift, ~5.5 m AGL): guardrail absent ' +
  'along leading edge. Work-at-heights above 3 m suspended pending compliant installation ' +
  '(OReg 213/91 s.26, OHSA s.25(2)(a)). WHMIS labelling deficiency at mixer station — ' +
  'secondary container lacked a GHS-compliant label; corrective action required before ' +
  'further use (OHSA s.38). Housekeeping hazard (slip-trip, grid B-6) identified and ' +
  'resolved within the same shift. PPE observed compliant at point of entry; extension ' +
  'ladder confirmed compliant (OReg 213/91 s.73).';

const FIXTURE_STYLE_SAMPLES = [
  {
    title: 'Toolbox Talk — WAH Template',
    text: 'Working at Heights toolbox talks should open with the regulatory threshold (3 m under OReg 213/91), confirm PFAS inspection, and note any outstanding hazards with corrective deadlines.',
    reportType: 'Toolbox Talk Record',
    siteTypes: ['Residential', 'Commercial'],
    qualityScore: 'Use',
    active: true,
  },
  {
    title: 'JHSC Meeting — Standard Format',
    text: 'JHSC minutes must record: quorum confirmation, agenda items, action owners, target dates. Reference OHSA s.9(20) for required inspection frequency.',
    reportType: 'JHSC Meeting Record',
    siteTypes: ['All'],
    qualityScore: 'Use',
    active: true,
  },
  {
    title: 'Incident Investigation — Root Cause Format',
    text: 'Incident reports require: immediate cause, root cause (systemic), contributing factors, corrective actions with target dates and responsible parties. Cite OHSA s.51–53 for reportable incidents.',
    reportType: 'Incident Investigation',
    siteTypes: ['All'],
    qualityScore: 'Use',
    active: true,
  },
  {
    title: 'Outdated Template (do not use)',
    text: 'Legacy format — superseded by v2 template in Q1 2025. Kept for reference only.',
    reportType: 'Toolbox Talk Record',
    siteTypes: ['All'],
    qualityScore: 'Review',
    active: false,
  },
];

const SEND_RECIPIENTS = [
  { email: 'supervisor@fixture-test.example', role: 'Supervisor' },
  { email: 'safety@fixture-test.example',     role: 'Safety Manager' },
  { email: 'client@fixture-test.example',     role: 'Client' },
];

export async function seedFixtures(env, license, mapping) {
  const idempKey = `fixtures_v1:${license.key}`;
  const existing = await checkIdempotency(env.DB, idempKey);
  if (existing) return existing;

  const notion = makeClient(env.NOTION_TOKEN);

  // ── 1. Site ────────────────────────────────────────────────────────────────
  const sitePage = await notion.post('/pages', {
    parent: { database_id: mapping.sites_db_id },
    properties: {
      'Site Name': { title: [{ text: { content: 'Fixture Site — Cornwall ON (Phase 1.1)' } }] },
      'Address':   { rich_text: [{ text: { content: '100 Test St, Cornwall, ON K6H 0A1' } }] },
      'Geocode':   { rich_text: [{ text: { content: '45.02900, -74.78300' } }] },
      'Status':    { select: { name: 'Active' } },
      'Site Type': { select: { name: 'Residential' } },
      'WAH Site?': { checkbox: true },
    },
  });
  const siteId = sitePage.id;

  // ── 2. Workers ─────────────────────────────────────────────────────────────
  const [supervisorPage, workerPage] = await Promise.all([
    notion.post('/pages', {
      parent: { database_id: mapping.workers_db_id },
      properties: {
        'Name':             { title: [{ text: { content: 'Fixture Supervisor' } }] },
        'Role':             { select: { name: 'Supervisor' } },
        'Sites':            { relation: [{ id: siteId }] },
        'WAH Trained?':     { checkbox: true },
        'WAH Cert Expiry':  { date: { start: '2027-06-01' } },
        'WHMIS Trained?':   { checkbox: true },
        'WHMIS Refresh Due':{ date: { start: '2027-03-01' } },
        'Sign-off Method':  { select: { name: 'Drawn Sig' } },
        'Active?':          { checkbox: true },
      },
    }),
    notion.post('/pages', {
      parent: { database_id: mapping.workers_db_id },
      properties: {
        'Name':             { title: [{ text: { content: 'Fixture Worker' } }] },
        'Role':             { select: { name: 'Worker' } },
        'Sites':            { relation: [{ id: siteId }] },
        'WAH Trained?':     { checkbox: true },
        'WAH Cert Expiry':  { date: { start: '2026-12-15' } },
        'WHMIS Trained?':   { checkbox: true },
        'WHMIS Refresh Due':{ date: { start: '2026-11-01' } },
        'Sign-off Method':  { select: { name: 'Drawn Sig' } },
        'Active?':          { checkbox: true },
      },
    }),
  ]);
  const workerIds = [supervisorPage.id, workerPage.id];

  // ── 3. Photos (5, mixed status) ────────────────────────────────────────────
  const photoIds = [];
  const photoHashes = [];

  for (const [i, spec] of FIXTURE_PHOTOS.entries()) {
    const photoBytes = buildPlaceholderBytes(i, spec.slug, 'fixture-v1');
    const hash = await sha256Hex(photoBytes);
    photoHashes.push(hash);

    const r2PhotoId = `FX-P-${String(i + 1).padStart(2, '0')}-${spec.slug}`;
    try {
      const key = photoKey(license.key, siteId, r2PhotoId, 'jpg');
      await putObject(env.FC_PHOTOS, key, photoBytes, 'image/jpeg');
    } catch { /* R2 optional */ }

    const photoPage = await notion.post('/pages', {
      parent: { database_id: mapping.photos_db_id },
      properties: {
        'Caption':         { title: [{ text: { content: spec.caption } }] },
        'Site':            { relation: [{ id: siteId }] },
        'Captured At':     { date: { start: spec.capturedAt } },
        'Captured By':     { relation: [{ id: workerIds[spec.capturedByIndex] }] },
        'Geo Lat':         { number: spec.geoLat },
        'Geo Lng':         { number: spec.geoLng },
        'Device ID':       { rich_text: [{ text: { content: 'FX-DEVICE-001' } }] },
        'Tags':            { multi_select: spec.tags.map(t => ({ name: t })) },
        'OHSA References': { rich_text: [{ text: { content: spec.ohsa } }] },
        'Status':          { select: { name: spec.status } },
        'Severity':        { select: { name: spec.severity } },
        'Hash':            { rich_text: [{ text: { content: hash } }] },
      },
    });
    photoIds.push(photoPage.id);
  }

  // ── 4. Toolbox Talk Inspection ─────────────────────────────────────────────
  const signoffTs1 = '2026-04-30T10:15:00Z';
  const signoffTs2 = '2026-04-30T10:16:00Z';
  const inspectionNotes = [
    'Fixture toolbox talk — April 30 2026, 10:00 AM. Duration: ~18 min.',
    'Topic: Working at Heights & Fall Protection (OReg 213/91 Part III) + WHMIS 2015.',
    '',
    'Items covered:',
    '• Guardrail installation requirements (s.26)',
    '• Personal fall arrest system inspection (s.26.1–26.9)',
    '• WHMIS labelling obligations (OHSA s.38)',
    '• Ladder competency and angle check (OReg 213/91 s.73)',
    '',
    `SIGNOFF: {"workerId":"${workerIds[0]}","role":"Supervisor","method":"Drawn Sig","timestamp":"${signoffTs1}","ipPrefix":"172.56."}`,
    `SIGNOFF: {"workerId":"${workerIds[1]}","role":"Worker","method":"Drawn Sig","timestamp":"${signoffTs2}","ipPrefix":"172.56."}`,
  ].join('\n');

  const inspectionPage = await notion.post('/pages', {
    parent: { database_id: mapping.inspections_db_id },
    properties: {
      'Inspection Title': { title: [{ text: { content: 'WAH & Fall Protection — Fixture Toolbox Talk' } }] },
      'Type':   { select: { name: 'Toolbox Talk' } },
      'Site':   { relation: [{ id: siteId }] },
      'Date':   { date: { start: '2026-04-30' } },
      'Topic Reference': { rich_text: [{ text: { content: 'OReg 213/91 Part III — WAH, guardrail, PFAS, competency; WHMIS 2015' } }] },
      'Notes':  { rich_text: [{ text: { content: inspectionNotes } }] },
      'Status': { select: { name: 'Complete' } },
    },
  });
  const inspectionId = inspectionPage.id;

  const siteObj = {
    id: siteId,
    name: 'Fixture Site — Cornwall ON (Phase 1.1)',
    address: '100 Test St, Cornwall, ON K6H 0A1',
    geocode: '45.02900, -74.78300',
    siteType: 'Residential',
    wahSite: true,
  };

  const inspectionObj = {
    id: inspectionId,
    title: 'WAH & Fall Protection — Fixture Toolbox Talk',
    type: 'Toolbox Talk',
    date: '2026-04-30',
    leadName: 'Fixture Supervisor',
    leadRole: 'Supervisor',
    notes: inspectionNotes,
    status: 'Complete',
    dateRangeStart: '2026-04-28',
    dateRangeEnd: '2026-04-30',
  };

  const photoRecords = FIXTURE_PHOTOS.map((spec, i) => ({
    photoId:          photoIds[i],
    caption:          spec.caption,
    capturedAt:       spec.capturedAt,
    capturedAtLocal:  spec.capturedAt.replace('T', ' ').replace('Z', ' UTC'),
    geoLat:           spec.geoLat,
    geoLng:           spec.geoLng,
    deviceId:         'FX-DEVICE-001',
    tags:             spec.tags,
    ohsaRefs:         spec.ohsa,
    hash:             photoHashes[i],
    status:           spec.status,
    severity:         spec.severity,
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

  const commonReportArgs = {
    reportType: 'Toolbox Talk Record',
    site: siteObj,
    inspection: inspectionObj,
    photos: photoRecords,
    signoffs,
    regulatoryAnchors,
    branding: {},
    licenseeName: license.client_name || 'Fixture Licensee',
    aiBody: FIXTURE_AI_BODY,
  };

  // ── 5. Report A — unlocked draft (regenerable) ─────────────────────────────
  const reportAId = `FX-R-A-001`;
  const reportAGeneratedAt = '2026-05-01T09:00:00Z';
  let reportANotionId;
  let reportAPdfHash = null;

  try {
    const pdfA = await generateReport({
      ...commonReportArgs,
      report: { id: reportAId, version: 1, generatedAt: reportAGeneratedAt, generatedBy: 'OCOS Fixture Seeder', licenseId: license.key },
    });
    reportAPdfHash = await sha256Hex(pdfA.buffer || pdfA);
    try {
      await putObject(env.FC_REPORTS, reportKey(license.key, reportAId, 1), pdfA, 'application/pdf');
    } catch { /* R2 optional */ }
  } catch (e) {
    console.error('[seed-fixtures] Report A PDF generation failed:', e.message);
  }

  const reportAPage = await notion.post('/pages', {
    parent: { database_id: mapping.reports_db_id },
    properties: {
      'Report Title': { title: [{ text: { content: 'Toolbox Talk Record — Fixture Site (DRAFT — unlocked)' } }] },
      'Type':         { select: { name: 'Toolbox Talk Record' } },
      'Site':         { relation: [{ id: siteId }] },
      'Inspection':   { relation: [{ id: inspectionId }] },
      'Version':      { number: 1 },
      'Photo Count':  { number: photoIds.length },
      'Date Range Start': { date: { start: '2026-04-28' } },
      'Date Range End':   { date: { start: '2026-04-30' } },
      'Locked?':      { checkbox: false },
      'Audit Appendix Included?': { checkbox: true },
      'Branding Profile': { select: { name: 'NAC Default' } },
      'Style-Conditioned?': { checkbox: false },
      'Recipients':   { rich_text: [{ text: { content: '[]' } }] },
      'Send History': { rich_text: [{ text: { content: '[]' } }] },
    },
  });
  reportANotionId = reportAPage.id;

  // ── 6. Report B — locked v1 (with 3-recipient Send History) ───────────────
  const reportBId = `FX-R-B-001`;
  const reportBGeneratedAt = '2026-05-01T09:05:00Z';
  const reportBLockedAt    = '2026-05-01T09:07:00Z';
  let reportBNotionId;
  let reportBPdfHash = 'fixture-pdf-unavailable';
  let reportBLocked = false;
  let hashVerified = false;

  try {
    const pdfB = await generateReport({
      ...commonReportArgs,
      report: { id: reportBId, version: 1, generatedAt: reportBGeneratedAt, generatedBy: 'OCOS Fixture Seeder', licenseId: license.key },
    });
    const pdfBBytes = pdfB.buffer || pdfB;
    reportBPdfHash = await sha256Hex(pdfBBytes);
    try {
      await putObject(env.FC_REPORTS, reportKey(license.key, reportBId, 1), pdfB, 'application/pdf');
    } catch { /* R2 optional */ }
    reportBLocked = true;
  } catch (e) {
    console.error('[seed-fixtures] Report B PDF generation failed:', e.message);
  }

  // 3-recipient Send History (simulated — no Resend API call)
  const sendAt = '2026-05-01T09:30:00Z';
  const recipientResults = SEND_RECIPIENTS.map((r, i) => ({
    email: r.email,
    role: r.role,
    sent_at: sendAt,
    resend_id: `FX-MSG-00${i + 1}`,
    error: null,
  }));
  const sendHistoryEntry = {
    sent_at: sendAt,
    channel: 'Resend Email',
    recipients: recipientResults,
  };
  const recipientsField = SEND_RECIPIENTS.map(r => ({
    email: r.email,
    role: r.role,
    sent_at: sendAt,
    opened_at: null,
  }));

  const reportBPage = await notion.post('/pages', {
    parent: { database_id: mapping.reports_db_id },
    properties: {
      'Report Title': { title: [{ text: { content: 'Toolbox Talk Record — Fixture Site (LOCKED v1)' } }] },
      'Type':         { select: { name: 'Toolbox Talk Record' } },
      'Site':         { relation: [{ id: siteId }] },
      'Inspection':   { relation: [{ id: inspectionId }] },
      'Version':      { number: 1 },
      'Photo Count':  { number: photoIds.length },
      'Date Range Start': { date: { start: '2026-04-28' } },
      'Date Range End':   { date: { start: '2026-04-30' } },
      'Locked?':      { checkbox: reportBLocked },
      'Locked At':    { date: { start: reportBLockedAt } },
      'PDF Hash':     { rich_text: [{ text: { content: reportBPdfHash } }] },
      'Audit Appendix Included?': { checkbox: true },
      'Branding Profile': { select: { name: 'NAC Default' } },
      'Style-Conditioned?': { checkbox: false },
      'Send History': { rich_text: [{ text: { content: JSON.stringify([sendHistoryEntry]) } }] },
      'Recipients':   { rich_text: [{ text: { content: JSON.stringify(recipientsField) } }] },
      'Sent Via':     { multi_select: [{ name: 'Resend Email' }] },
    },
  });
  reportBNotionId = reportBPage.id;

  if (reportBLocked) {
    await recordAuditIndex(env.DB, {
      reportId: reportBNotionId,
      reportNotionPageId: reportBNotionId,
      pdfHash: reportBPdfHash,
      licenseId: license.key,
      siteId,
    });

    // ── End-to-end hash verification ────────────────────────────────────────
    // Re-fetch the Notion record and confirm stored hash matches computed hash
    try {
      const refetch = await notion.get(`/pages/${reportBNotionId}`);
      const storedHash = refetch.properties?.['PDF Hash']?.rich_text?.[0]?.plain_text || '';
      hashVerified = storedHash === reportBPdfHash && storedHash.length === 64;
    } catch (e) {
      console.error('[seed-fixtures] Hash verification fetch failed:', e.message);
    }
  }

  // ── 7. Report C — v2 linked to Report B ───────────────────────────────────
  const reportCId = `FX-R-C-002`;
  const reportCGeneratedAt = '2026-05-02T08:00:00Z';
  let reportCNotionId;
  let reportCPdfHash = 'fixture-pdf-unavailable';

  try {
    const pdfC = await generateReport({
      ...commonReportArgs,
      report: { id: reportCId, version: 2, generatedAt: reportCGeneratedAt, generatedBy: 'OCOS Fixture Seeder', licenseId: license.key },
    });
    const pdfCBytes = pdfC.buffer || pdfC;
    reportCPdfHash = await sha256Hex(pdfCBytes);
    try {
      await putObject(env.FC_REPORTS, reportKey(license.key, reportCId, 2), pdfC, 'application/pdf');
    } catch { /* R2 optional */ }
  } catch (e) {
    console.error('[seed-fixtures] Report C PDF generation failed:', e.message);
  }

  const reportCPage = await notion.post('/pages', {
    parent: { database_id: mapping.reports_db_id },
    properties: {
      'Report Title':  { title: [{ text: { content: 'Toolbox Talk Record — Fixture Site (v2)' } }] },
      'Type':          { select: { name: 'Toolbox Talk Record' } },
      'Site':          { relation: [{ id: siteId }] },
      'Inspection':    { relation: [{ id: inspectionId }] },
      'Version':       { number: 2 },
      'Parent Report': { relation: [{ id: reportBNotionId }] },
      'Photo Count':   { number: photoIds.length },
      'Date Range Start': { date: { start: '2026-04-28' } },
      'Date Range End':   { date: { start: '2026-04-30' } },
      'Locked?':       { checkbox: false },
      'PDF Hash':      { rich_text: [{ text: { content: reportCPdfHash } }] },
      'Audit Appendix Included?': { checkbox: true },
      'Branding Profile': { select: { name: 'NAC Default' } },
      'Style-Conditioned?': { checkbox: false },
      'Recipients':    { rich_text: [{ text: { content: '[]' } }] },
      'Send History':  { rich_text: [{ text: { content: '[]' } }] },
    },
  });
  reportCNotionId = reportCPage.id;

  // ── 8. Style Samples (T3 — skipped if not provisioned) ────────────────────
  const styleSampleIds = [];
  if (mapping.style_samples_db_id) {
    for (const spec of FIXTURE_STYLE_SAMPLES) {
      try {
        const props = {
          'Sample Title':   { title: [{ text: { content: spec.title } }] },
          'Extracted Text': { rich_text: [{ text: { content: spec.text } }] },
          'Word Count':     { number: spec.text.split(/\s+/).filter(Boolean).length },
          'Quality Score':  { select: { name: spec.qualityScore } },
          'Active?':        { checkbox: spec.active },
          'Times Used':     { number: 0 },
          'Site Type':      { multi_select: spec.siteTypes.map(s => ({ name: s })) },
          'Report Type':    { select: { name: spec.reportType } },
        };
        const page = await notion.post('/pages', {
          parent: { database_id: mapping.style_samples_db_id },
          properties: props,
        });
        styleSampleIds.push({ id: page.id, title: spec.title, active: spec.active });
      } catch (e) {
        console.error('[seed-fixtures] Style sample creation failed:', spec.title, e.message);
      }
    }
  }

  const result = {
    ok: true,
    seeded: true,
    phase: '1.1',
    siteId,
    workerIds: { supervisor: workerIds[0], worker: workerIds[1] },
    photoIds,
    photoHashes,
    inspectionId,
    reports: {
      A: { id: reportANotionId, version: 1, locked: false, pdfHash: reportAPdfHash },
      B: { id: reportBNotionId, version: 1, locked: reportBLocked, pdfHash: reportBPdfHash, recipients: SEND_RECIPIENTS.length },
      C: { id: reportCNotionId, version: 2, locked: false, parentId: reportBNotionId, pdfHash: reportCPdfHash },
    },
    styleSamples: styleSampleIds,
    hashVerified,
    hashVerificationDetail: hashVerified
      ? `sha256(Report_B_pdf) === Report_B.PDF_Hash in Notion ✓ (${reportBPdfHash.slice(0, 16)}...)`
      : reportBLocked
        ? 'Hash mismatch or Notion refetch failed — check worker logs'
        : 'PDF generation skipped — hash verification not possible',
  };

  await setIdempotency(env.DB, idempKey, result);
  return result;
}

function buildPlaceholderBytes(index, slug, prefix) {
  return new TextEncoder().encode(
    `OCOS-FIXTURE-PHOTO:${prefix}:${index}:${slug}:Cornwall-ON:2026`
  ).buffer;
}
