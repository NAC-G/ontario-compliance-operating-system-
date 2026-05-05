/**
 * D1 helpers for FC tables.
 */

export async function getLicenseMapping(db, licenseId) {
  return db
    .prepare('SELECT * FROM fc_license_mapping WHERE license_id=? LIMIT 1')
    .bind(licenseId)
    .first();
}

export async function requireLicenseMapping(db, licenseId) {
  const m = await getLicenseMapping(db, licenseId);
  if (!m) {
    const e = new Error('FC workspace not provisioned for this license');
    e.status = 409;
    throw e;
  }
  return m;
}

export async function recordAuditIndex(db, { reportId, reportNotionPageId, pdfHash, licenseId, siteId }) {
  await db.prepare(
    'INSERT INTO fc_audit_index (report_id, report_notion_page_id, pdf_hash, locked_at, license_id, site_id) VALUES (?,?,?,?,?,?)'
  ).bind(reportId, reportNotionPageId, pdfHash, new Date().toISOString(), licenseId, siteId).run();
}

export async function checkIdempotency(db, key) {
  const row = await db.prepare('SELECT result FROM fc_idempotency WHERE key=?').bind(key).first();
  return row ? JSON.parse(row.result) : null;
}

export async function setIdempotency(db, key, result) {
  await db.prepare(
    'INSERT OR REPLACE INTO fc_idempotency (key, result, created_at) VALUES (?,?,?)'
  ).bind(key, JSON.stringify(result), new Date().toISOString()).run();
}
