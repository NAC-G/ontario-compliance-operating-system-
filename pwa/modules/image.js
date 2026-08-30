/**
 * Client-side image resizing — produces a small JPEG thumbnail from a
 * captured/uploaded photo before it ever leaves the device.
 *
 * Why this exists: the photo grid was loading the full-resolution
 * original (a real phone photo is 2+ MB) for every tile, just to show it
 * at ~120x120px. A site with 50 photos meant 100+ MB downloaded just to
 * open "All" — real cost for both the user's data and R2 egress. The full
 * original is still uploaded and used for the photo-detail view and the
 * report (where quality actually matters); only the grid gets the
 * thumbnail.
 */

export async function createThumbnail(blob, maxDim = 480, quality = 0.75) {
  const bitmap = await createImageBitmap(blob).catch(() => null);
  if (!bitmap) return null; // unsupported format or decode failure — caller falls back to no thumbnail

  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close?.();

  return new Promise(resolve => {
    canvas.toBlob(b => resolve(b), 'image/jpeg', quality);
  });
}
