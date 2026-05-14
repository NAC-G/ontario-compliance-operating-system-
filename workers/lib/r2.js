/**
 * R2 storage helpers.
 * Key convention: {licenseId}/{siteId}/{objectId}.{ext}
 * Style samples:  {licenseId}/style/{sampleId}.{ext}
 */

export function photoKey(licenseId, siteId, photoId, ext = 'jpg') {
  return `${licenseId}/${siteId}/${photoId}.${ext}`;
}

export function voiceKey(licenseId, siteId, voiceId) {
  return `${licenseId}/${siteId}/${voiceId}.m4a`;
}

export function reportKey(licenseId, reportId, version = 1) {
  return `${licenseId}/reports/${reportId}_v${version}.pdf`;
}

export function styleKey(licenseId, sampleId, ext = 'pdf') {
  return `${licenseId}/style/${sampleId}.${ext}`;
}

export async function putObject(bucket, key, body, contentType) {
  await bucket.put(key, body, {
    httpMetadata: { contentType },
  });
  return key;
}

export async function getSignedUrl(bucket, key, expiresIn = 3600, baseUrl = 'https://ocos-fc.naturalalternatives.ca') {
  if (bucket.createSignedUrl) return bucket.createSignedUrl(key, { expiresIn });
  const expires = Date.now() + expiresIn * 1000;
  return `${baseUrl}/fc/dl?key=${encodeURIComponent(key)}&expires=${expires}`;
}
