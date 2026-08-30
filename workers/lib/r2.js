/**
 * R2 storage helpers.
 * Key convention: {licenseId}/{siteId}/{objectId}.{ext}
 * Style samples:  {licenseId}/style/{sampleId}.{ext}
 */

export function photoKey(licenseId, siteId, photoId, ext = 'jpg') {
  return `${licenseId}/${siteId}/${photoId}.${ext}`;
}

// Thumbnail key derived from a photo key by inserting '-thumb' before the
// extension — no separate Notion property needed to track it (this
// database's live schema has already turned out to differ from what the
// code assumes several times this session; deriving avoids adding another
// property to that list). Always .jpg since createThumbnail() (client,
// modules/image.js) always encodes as JPEG. Not every existing photo has
// a thumbnail object at this key (older uploads, or if generation failed
// client-side) — callers fall back to the full photoKey when the R2 GET
// 404s, not by checking existence up front.
export function deriveThumbKey(photoKeyStr) {
  return photoKeyStr.replace(/\.[a-zA-Z0-9]+$/, '-thumb.jpg');
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
