/**
 * Signature pad and PIN-mode sign-off helpers.
 * Canvas drawing is managed by app.js; this module handles
 * blob serialization and the sign-off payload shape.
 */

export function buildSignoffPayload({ workers, inspectionId, inspectionType, siteId, date }) {
  return {
    inspectionId,
    inspectionType,
    siteId,
    date: date || new Date().toISOString(),
    workers: workers.map(w => ({
      name: w.name,
      role: w.role || null,
      method: w.method || 'signature',
      signedAt: new Date().toISOString(),
    })),
  };
}

export function canvasToBlob(canvas) {
  return new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
}

export function isPinValid(pin) {
  return /^\d{4}$/.test(pin);
}
