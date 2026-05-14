/**
 * License validation for /fc/* endpoints.
 * Reads X-OCOS-License header; queries the same D1 `licenses` table nacosapp uses.
 * Returns the license record on success; throws {status, message} on failure.
 */

export async function validateLicense(request, env) {
  const key = request.headers.get('X-OCOS-License');
  if (!key) throw httpErr('Missing X-OCOS-License header', 401);

  const license = await getLicenseByKey(env.DB, key.trim().toUpperCase());
  if (!license) throw httpErr('Invalid license key', 401);
  if (!license.is_active) throw httpErr('License inactive', 403);

  await env.DB.prepare('UPDATE licenses SET last_used_at=? WHERE id=?')
    .bind(new Date().toISOString(), license.id)
    .run();

  return license;
}

export async function requireTier(license, minTier) {
  const tiers = ['T1', 'T2', 'T3'];
  const have = tiers.indexOf(license.tier);
  const need = tiers.indexOf(minTier);
  if (have < need) {
    throw httpErr(`${minTier} license required`, 403);
  }
}

export async function validateInternalSecret(request, env) {
  const secret = request.headers.get('X-FC-Internal');
  if (!secret || secret !== env.FC_INTERNAL_SECRET) {
    throw httpErr('Unauthorized', 401);
  }
}

async function getLicenseByKey(db, key) {
  const result = await db
    .prepare('SELECT * FROM licenses WHERE key=? LIMIT 1')
    .bind(key)
    .first();
  return result || null;
}

function httpErr(message, status) {
  const e = new Error(message);
  e.status = status;
  return e;
}
