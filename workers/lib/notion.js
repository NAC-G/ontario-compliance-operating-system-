/**
 * Notion API client + FC provisioning.
 *
 * Provisions the "Field Compliance Module" container page under IN HOUSE,
 * then creates (or verifies) all 7 FC databases for a given license.
 *
 * Call order on first license activation:
 *   1. ensureFCModulePage()       — idempotent, creates once
 *   2. ensureClientLicenseBrandingColumns()  — idempotent, adds 5 columns once
 *   3. provisionFCDatabases(licenseId, tier, clientLicensePageId)
 */

const NOTION_API = 'https://api.notion.com/v1';
const NOTION_VERSION = '2022-06-28';

// ── Low-level client ─────────────────────────────────────────────────────────

async function notionFetch(token, method, path, body) {
  const res = await fetch(`${NOTION_API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Notion-Version': NOTION_VERSION,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Notion ${method} ${path} → ${res.status}: ${JSON.stringify(data)}`);
  }
  return data;
}

export function makeClient(token) {
  return {
    get: (path) => notionFetch(token, 'GET', path),
    post: (path, body) => notionFetch(token, 'POST', path, body),
    patch: (path, body) => notionFetch(token, 'PATCH', path, body),
  };
}

// ── FC Module container page ─────────────────────────────────────────────────

export async function ensureFCModulePage(notion, inHousePageId) {
  const search = await notion.post('/search', {
    query: 'Field Compliance Module',
    filter: { value: 'page', property: 'object' },
  });
  const existing = search.results.find(
    p => p.parent?.page_id?.replace(/-/g, '') === inHousePageId.replace(/-/g, '')
      && p.properties?.title?.title?.[0]?.plain_text === 'Field Compliance Module'
  );
  if (existing) return existing.id;

  const page = await notion.post('/pages', {
    parent: { page_id: inHousePageId },
    properties: {
      title: { title: [{ text: { content: 'Field Compliance Module' } }] },
    },
    icon: { type: 'emoji', emoji: '📋' },
  });
  return page.id;
}

// ── Branding columns on Client Licenses DB ───────────────────────────────────

const BRANDING_COLUMNS = {
  'Branding: Logo': { files: {} },
  'Branding: Primary Colour': { rich_text: {} },
  'Branding: Accent Colour': { rich_text: {} },
  'Branding: Company Name': { rich_text: {} },
  'Branding: Footer Line': { rich_text: {} },
};

export async function ensureClientLicenseBrandingColumns(notion, collectionId) {
  const db = await notion.get(`/databases/${collectionId}`);
  const existing = Object.keys(db.properties || {});
  const toAdd = Object.fromEntries(
    Object.entries(BRANDING_COLUMNS).filter(([k]) => !existing.includes(k))
  );
  if (Object.keys(toAdd).length === 0) return;
  await notion.patch(`/databases/${collectionId}`, { properties: toAdd });
}

// ── Database schema helpers ──────────────────────────────────────────────────

function select(options) {
  return { select: { options: options.map(o => (typeof o === 'string' ? { name: o } : o)) } };
}

function multiSelect(options) {
  return { multi_select: { options: options.map(o => (typeof o === 'string' ? { name: o } : o)) } };
}

const rich_text = { rich_text: {} };
const number = { number: {} };
const date = { date: {} };
const checkbox = { checkbox: {} };
const email = { email: {} };
const phone_number = { phone_number: {} };
const url = { url: {} };
const files = { files: {} };
const created_time = { created_time: {} };
const created_by = { created_by: {} };

function relation(dbId) {
  return { relation: { database_id: dbId, type: 'single_property', single_property: {} } };
}

function formula(expression) {
  return { formula: { expression } };
}

// ── DB 1: FC-Sites ───────────────────────────────────────────────────────────

function fcSitesSchema(clientLicensesDbId) {
  return {
    'Site Name': { title: {} },
    'Address': rich_text,
    'Geocode': rich_text,
    'Client License': relation(clientLicensesDbId),
    'Status': select(['Active', 'On Hold', 'Closed', 'Archived']),
    'Site Type': select(['Residential', 'ICI', 'Roadwork', 'Other']),
    'WAH Site?': checkbox,
    'Created': created_time,
    'Created By': created_by,
  };
}

// ── DB 2: FC-Photos ──────────────────────────────────────────────────────────

function fcPhotosSchema(fcSitesDbId) {
  return {
    'Caption': { title: {} },
    'Photo': files,
    'Site': relation(fcSitesDbId),
    'Captured At': date,
    'Geo Lat': number,
    'Geo Lng': number,
    'Device ID': rich_text,
    'Tags': multiSelect([
      'WAH-3M','WAH-OPENING','WAH-CERT-EXPIRED',
      'FP-GUARDRAIL-OK','FP-GUARDRAIL-MISSING','FP-HARNESS-OK','FP-ANCHOR-INSPECT',
      'SCAFF-DAILY','SCAFF-DEFICIENCY',
      'LADDER-INSPECT','LADDER-DAMAGED',
      'WHMIS-LABEL-MISSING','WHMIS-SDS-ACCESS','WHMIS-GHS7',
      'PPE-COMPLIANT','PPE-MISSING','PPE-DAMAGED',
      'EXCAV-SHORING','EXCAV-LOCATES','EXCAV-SOIL',
      'CS-PERMIT','CS-ATMO-TEST','CS-ATTENDANT',
      'HW-PERMIT','HW-FIRE-WATCH','HW-VENTILATION',
      'ELEC-LOCKOUT','ELEC-GFCI','ELEC-ARC-FLASH',
      'EQUIP-PRESHIFT','EQUIP-DEFICIENCY',
      'HOUSE-SLIP-TRIP','HOUSE-DEBRIS',
      'FA-KIT-STOCKED','FA-AED-PRESENT',
      'EMERG-EVAC-PLAN','EMERG-EXTINGUISHER',
      'JHSC-INSPECTION','JHSC-POSTING',
      'COMP-TOOLBOX-TALK','COMP-TRAINING-RECORD',
      'INC-INJURY','INC-NEAR-MISS','INC-PROPERTY',
      'MOL-ORDER','MOL-STOP-WORK',
      'VH-POLICY-POSTED','VH-INCIDENT',
      'PSH-NALOXONE-KIT','PSH-WELLNESS',
    ]),
    'OHSA References': rich_text,
    'Status': select(['Hazard - Open', 'Hazard - Corrected', 'Routine', 'Incident', 'Inspection']),
    'Severity': select(['Info', 'Low', 'Med', 'High', 'Critical']),
    'Voice Note': files,
    'AI Summary': rich_text,
    'Annotations': rich_text,
    'Hash': rich_text,
  };
}

// ── DB 3: FC-Inspections ─────────────────────────────────────────────────────

function fcInspectionsSchema(fcSitesDbId) {
  return {
    'Inspection Title': { title: {} },
    'Type': select([
      'JHSC Monthly', 'Daily Pre-Task', 'Toolbox Talk', 'Pre-Shift',
      'Incident Investigation', 'MOL Response', 'Other',
    ]),
    'Site': relation(fcSitesDbId),
    'Date': date,
    'Topic Reference': rich_text,
    'Notes': rich_text,
    'Signatures': files,
    'Status': select(['Draft', 'Complete', 'Submitted']),
  };
}

// ── DB 4: FC-Workers ─────────────────────────────────────────────────────────

function fcWorkersSchema(fcSitesDbId) {
  return {
    'Name': { title: {} },
    'Role': select(['Worker', 'Supervisor', 'JHSC Member', 'H&S Rep', 'Subcontractor', 'Visitor']),
    'Email': email,
    'Phone': phone_number,
    'Sites': relation(fcSitesDbId),
    'WAH Trained?': checkbox,
    'WAH Cert Expiry': date,
    'WHMIS Trained?': checkbox,
    'WHMIS Refresh Due': date,
    'Other Certs': multiSelect([
      'Confined Space', 'Hot Work', 'Trenching', 'Lift Truck', 'First Aid',
      'Scaffolding Erector', 'Supervisor H&S', 'MOL-Recognized',
    ]),
    'Cert Files': files,
    'Sign-off Method': select(['Tap', 'Drawn Sig', 'PIN']),
    'Active?': checkbox,
  };
}

// ── DB 5: FC-Reports ─────────────────────────────────────────────────────────

function fcReportsSchema(fcSitesDbId) {
  return {
    'Report Title': { title: {} },
    'Type': select([
      'Toolbox Talk Record', 'JHSC Inspection', 'Incident Report',
      'Daily Log', 'Hazard Summary', 'Custom',
    ]),
    'Site': relation(fcSitesDbId),
    'PDF': files,
    'Version': number,
    'Generated At': created_time,
    'Generated By': created_by,
    'Photo Count': number,
    'Date Range Start': date,
    'Date Range End': date,
    'Recipients': rich_text,
    'Send History': rich_text,
    'Sent Via': multiSelect(['Resend Email', 'Download', 'Link Share']),
    'Locked?': checkbox,
    'Locked At': date,
    'PDF Hash': rich_text,
    'Style-Conditioned?': checkbox,
    'Branding Profile': select(['NAC Default', 'Client Custom']),
    'Audit Appendix Included?': checkbox,
  };
}

// ── DB 6: FC-Checklists ──────────────────────────────────────────────────────

function fcChecklistsSchema() {
  return {
    'Checklist Title': { title: {} },
    'Category': select([
      'Working at Heights', 'Fall Protection', 'Scaffolding', 'Ladders',
      'WHMIS / Hazardous Materials', 'Personal Protective Equipment',
      'Excavation & Trenching', 'Confined Space', 'Hot Work',
      'Electrical Safety', 'Mobile Equipment', 'Housekeeping',
      'First Aid', 'Emergency Preparedness', 'JHSC / H&S Rep',
      'Toolbox Talk / Competency', 'Incident / Near Miss',
      'MOL Order Compliance', 'Workplace Violence & Harassment',
      'Naloxone & Worker Wellness',
    ]),
    'Items': rich_text,
    'Required Frequency': select(['Per Task', 'Daily', 'Weekly', 'Monthly', 'Annual', 'Once']),
    'Applies To Site Types': multiSelect(['Residential', 'ICI', 'Roadwork', 'Other', 'All']),
    'Regulatory Anchors': multiSelect([
      'OHSA s.25', 'OHSA s.25(2)(a)', 'OHSA s.9', 'OHSA s.51', 'OHSA s.38',
      'OReg 213/91 s.26', 'OReg 213/91 Part III', 'OReg 213/91 s.78-84',
      'OReg 297/13', 'OReg 632/05', 'OReg 860', 'OReg 420/21',
      'NFPA 51B', 'CSA Z11', 'WSIB Form 7',
    ]),
    'Active?': checkbox,
    'Default?': checkbox,
  };
}

// ── DB 7: FC-StyleSamples (T3) ───────────────────────────────────────────────

function fcStyleSamplesSchema() {
  return {
    'Sample Title': { title: {} },
    'Source File': files,
    'Extracted Text': rich_text,
    'Word Count': number,
    'Report Type': select([
      'Toolbox Talk Record', 'JHSC Inspection', 'Incident Report',
      'Daily Log', 'Hazard Summary', 'Custom',
    ]),
    'Site Type': multiSelect(['Residential', 'ICI', 'Roadwork', 'All']),
    'Quality Score': select(['Use', 'Reference Only', 'Exclude']),
    'Voice Notes': rich_text,
    'Active?': checkbox,
    'Uploaded At': created_time,
    'Times Used': number,
  };
}

// ── Relation / rollup second-pass ────────────────────────────────────────────

async function addRelationsPass2(notion, dbs) {
  const patches = [];

  // FC-Photos: Captured By, Pair:Before/After, Inspection
  patches.push(notion.patch(`/databases/${dbs.photos}`, {
    properties: {
      'Captured By': relation(dbs.workers),
      'Pair: Before': relation(dbs.photos),
      'Pair: After': relation(dbs.photos),
      'Inspection': relation(dbs.inspections),
    },
  }));

  // FC-Inspections: Lead, Attendees, Checklist, Report
  patches.push(notion.patch(`/databases/${dbs.inspections}`, {
    properties: {
      'Lead': relation(dbs.workers),
      'Attendees': relation(dbs.workers),
      'Checklist': relation(dbs.checklists),
      'Report': relation(dbs.reports),
    },
  }));

  // FC-Reports: Inspection, Style Samples Used, Parent Report
  const reportPatches = {
    'Inspection': relation(dbs.inspections),
    'Parent Report': relation(dbs.reports),
  };
  if (dbs.styleSamples) {
    reportPatches['Style Samples Used'] = relation(dbs.styleSamples);
  }
  patches.push(notion.patch(`/databases/${dbs.reports}`, { properties: reportPatches }));

  // FC-Sites rollups and formula
  patches.push(notion.patch(`/databases/${dbs.sites}`, {
    properties: {
      'JHSC Required?': formula('prop("Worker Count") >= 20'),
    },
  }));

  await Promise.all(patches);
}

// ── Main provision function ──────────────────────────────────────────────────

export async function provisionFCDatabases(notion, {
  fcModulePageId,
  clientLicensesDbId,
  licenseId,
  tier,               // 'T2' | 'T3'
  clientName,
}) {
  const prefix = clientName ? `${clientName} — ` : '';

  async function createDb(title, schema, parentPageId) {
    const db = await notion.post('/databases', {
      parent: { page_id: parentPageId, type: 'page_id' },
      title: [{ type: 'text', text: { content: title } }],
      is_inline: false,
      properties: schema,
    });
    return db.id;
  }

  // Create a client sub-page under the FC Module page
  const clientPage = await notion.post('/pages', {
    parent: { page_id: fcModulePageId },
    properties: {
      title: { title: [{ text: { content: `${prefix}FC Workspace — ${licenseId}` } }] },
    },
    icon: { type: 'emoji', emoji: '🏗️' },
  });
  const clientPageId = clientPage.id;

  // Phase 1: create DBs that have no inter-DB relations yet
  const [sitesId, checklistsId] = await Promise.all([
    createDb(`${prefix}FC-Sites`, fcSitesSchema(clientLicensesDbId), clientPageId),
    createDb(`${prefix}FC-Checklists`, fcChecklistsSchema(), clientPageId),
  ]);

  const [photosId, inspectionsId, workersId, reportsId] = await Promise.all([
    createDb(`${prefix}FC-Photos`, fcPhotosSchema(sitesId), clientPageId),
    createDb(`${prefix}FC-Inspections`, fcInspectionsSchema(sitesId), clientPageId),
    createDb(`${prefix}FC-Workers`, fcWorkersSchema(sitesId), clientPageId),
    createDb(`${prefix}FC-Reports`, fcReportsSchema(sitesId), clientPageId),
  ]);

  // T3 only: FC-StyleSamples
  let styleSamplesId = null;
  if (tier === 'T3') {
    styleSamplesId = await createDb(`${prefix}FC-StyleSamples`, fcStyleSamplesSchema(), clientPageId);
  }

  const dbs = {
    sites: sitesId,
    photos: photosId,
    inspections: inspectionsId,
    workers: workersId,
    reports: reportsId,
    checklists: checklistsId,
    styleSamples: styleSamplesId,
    clientPage: clientPageId,
  };

  // Phase 2: add cross-DB relations and rollups
  await addRelationsPass2(notion, dbs);

  return dbs;
}
