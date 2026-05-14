/**
 * Before/after photo pairing helpers.
 * Pairing UI is driven by app.js; this module handles the data side.
 */

export function buildBeforeAfterPair(beforePhotoId, afterPhotoId) {
  return { beforePhotoId, afterPhotoId, pairedAt: new Date().toISOString() };
}

export function isPairCandidate(photo) {
  return photo?.status === 'Hazard - Open';
}
