/**
 * Camera capture and library pick.
 * openCamera() — live capture via device camera (capture="environment")
 * openLibrary() — file picker from photo library, with EXIF extraction
 *
 * Both resolve to: { photoBlob, photoUrl, exif, captureSource }
 * captureSource: 'Live' | 'Uploaded' | 'Uploaded - No EXIF'
 */

import { getGPS } from './permissions.js';

export function openCamera() {
  return new Promise(resolve => {
    const input = document.createElement('input');
    input.type  = 'file';
    input.accept = 'image/*';
    input.setAttribute('capture', 'environment');

    input.addEventListener('change', async () => {
      const file = input.files?.[0];
      if (!file) { resolve({ photoBlob: null, photoUrl: null, exif: null, captureSource: null }); return; }

      const photoBlob = file;
      const photoUrl  = URL.createObjectURL(file);
      const gps       = await getGPS();

      resolve({
        photoBlob,
        photoUrl,
        captureSource: 'Live',
        exif: {
          gps,
          capturedAt: new Date().toISOString(),
          fileName:   file.name,
          mimeType:   file.type,
          sizeBytes:  file.size,
        },
      });
    });

    window.addEventListener('focus', function onFocus() {
      window.removeEventListener('focus', onFocus);
      setTimeout(() => {
        if (!input.files?.length) resolve({ photoBlob: null, photoUrl: null, exif: null, captureSource: null });
      }, 500);
    }, { once: true });

    input.click();
  });
}

export function openLibrary() {
  return new Promise(resolve => {
    const input = document.createElement('input');
    input.type   = 'file';
    input.accept = 'image/*';
    // No capture attribute — shows photo library instead of camera

    input.addEventListener('change', async () => {
      const file = input.files?.[0];
      if (!file) { resolve({ photoBlob: null, photoUrl: null, exif: null, captureSource: null }); return; }

      const photoBlob = file;
      const photoUrl  = URL.createObjectURL(file);

      // Extract EXIF GPS + DateTimeOriginal from file bytes
      let exifGps        = null;
      let exifCapturedAt = null;
      let hasExif        = false;

      try {
        const buf      = await file.arrayBuffer();
        const exifData = extractExif(buf);
        if (exifData?.gps)        { exifGps        = exifData.gps;        hasExif = true; }
        if (exifData?.capturedAt) { exifCapturedAt = exifData.capturedAt; hasExif = true; }
      } catch (_) {}

      // Use EXIF GPS when present; fall back to current device GPS
      const gps        = exifGps || await getGPS();
      const capturedAt = exifCapturedAt || new Date().toISOString();
      const captureSource = hasExif ? 'Uploaded' : 'Uploaded - No EXIF';

      resolve({
        photoBlob,
        photoUrl,
        captureSource,
        exif: {
          gps,
          capturedAt,
          fileName:  file.name,
          mimeType:  file.type,
          sizeBytes: file.size,
        },
      });
    });

    window.addEventListener('focus', function onFocus() {
      window.removeEventListener('focus', onFocus);
      setTimeout(() => {
        if (!input.files?.length) resolve({ photoBlob: null, photoUrl: null, exif: null, captureSource: null });
      }, 500);
    }, { once: true });

    input.click();
  });
}

// ── Minimal JPEG EXIF parser ──────────────────────────────────────────────────
// Returns { gps: { lat, lng } | null, capturedAt: ISO8601 | null }

function extractExif(buf) {
  try {
    const view = new DataView(buf);
    let p = 2; // skip SOI (FF D8)
    while (p + 4 < Math.min(buf.byteLength, 65536)) {
      if (view.getUint8(p) !== 0xFF) break;
      const marker = view.getUint8(p + 1);
      // EOI or SOS — no length field, stop scanning
      if (marker === 0xD9 || marker === 0xDA) break;
      const segLen = view.getUint16(p + 2); // big-endian, includes 2-byte length field
      if (marker === 0xE1 && segLen >= 8) {
        // Check "Exif\0\0" at p+4
        if (view.getUint32(p + 4) === 0x45786966) { // "Exif"
          return parseTiff(view, p + 10); // TIFF header starts after "Exif\0\0"
        }
      }
      p += 2 + segLen;
    }
  } catch (_) {}
  return null;
}

function parseTiff(view, tBase) {
  try {
    const byteOrderMark = view.getUint16(tBase);
    if (byteOrderMark !== 0x4949 && byteOrderMark !== 0x4D4D) return null;
    const le = byteOrderMark === 0x4949; // "II" = little-endian

    if (view.getUint16(tBase + 2, le) !== 42) return null; // TIFF magic

    const ifd0Off = view.getUint32(tBase + 4, le);
    const ifd0    = readIFD(view, tBase, ifd0Off, le);

    let gps        = null;
    let capturedAt = null;

    // GPS IFD via tag 0x8825
    if (ifd0[0x8825] !== undefined) {
      const gpsOff = view.getUint32(tBase + ifd0[0x8825] + 8, le);
      const gpsIfd = readIFD(view, tBase, gpsOff, le);
      gps = readGPS(view, tBase, gpsIfd, le);
    }

    // DateTimeOriginal (0x9003) via ExifIFD pointer (0x8769)
    if (ifd0[0x8769] !== undefined) {
      const exifOff = view.getUint32(tBase + ifd0[0x8769] + 8, le);
      const exifIfd = readIFD(view, tBase, exifOff, le);
      if (exifIfd[0x9003] !== undefined) {
        capturedAt = readAsciiTag(view, tBase, exifIfd[0x9003], le);
      }
    }

    // Fallback: DateTime (0x0132) in IFD0
    if (!capturedAt && ifd0[0x0132] !== undefined) {
      capturedAt = readAsciiTag(view, tBase, ifd0[0x0132], le);
    }

    // Convert "YYYY:MM:DD HH:MM:SS" → ISO 8601
    if (capturedAt && /^\d{4}:\d{2}:\d{2} \d{2}:\d{2}:\d{2}$/.test(capturedAt)) {
      capturedAt = capturedAt.replace(/^(\d{4}):(\d{2}):(\d{2})/, '$1-$2-$3').replace(' ', 'T') + 'Z';
    } else {
      capturedAt = null;
    }

    return { gps, capturedAt };
  } catch (_) {
    return null;
  }
}

// Returns a map of tag → entry offset (relative to tBase) within the IFD
function readIFD(view, tBase, ifdOff, le) {
  const tags = {};
  const n = view.getUint16(tBase + ifdOff, le);
  for (let i = 0; i < n && i < 128; i++) {
    const entryOff = ifdOff + 2 + i * 12; // relative to tBase
    const tag = view.getUint16(tBase + entryOff, le);
    tags[tag] = entryOff;
  }
  return tags;
}

// Read ASCII value from an IFD entry (count > 4 → value is offset from tBase)
function readAsciiTag(view, tBase, entryOff, le) {
  const count   = view.getUint32(tBase + entryOff + 4, le);
  const dataAbs = count <= 4
    ? tBase + entryOff + 8
    : tBase + view.getUint32(tBase + entryOff + 8, le);
  let s = '';
  for (let i = 0; i < count && i < 64; i++) {
    const c = view.getUint8(dataAbs + i);
    if (c === 0) break;
    s += String.fromCharCode(c);
  }
  return s.trim() || null;
}

// Decimal degrees from GPS IFD tags 1–4
function readGPS(view, tBase, gpsIfd, le) {
  if (gpsIfd[1] === undefined || gpsIfd[2] === undefined ||
      gpsIfd[3] === undefined || gpsIfd[4] === undefined) return null;

  // LatRef / LngRef are ASCII[2], inline (count ≤ 4)
  const latRef = String.fromCharCode(view.getUint8(tBase + gpsIfd[1] + 8));
  const lngRef = String.fromCharCode(view.getUint8(tBase + gpsIfd[3] + 8));

  // Lat/Lng are RATIONAL[3] — always an offset (3×8=24 > 4)
  const latDataAbs = tBase + view.getUint32(tBase + gpsIfd[2] + 8, le);
  const lngDataAbs = tBase + view.getUint32(tBase + gpsIfd[4] + 8, le);

  function rational(abs, i) {
    const num = view.getUint32(abs + i * 8,     le);
    const den = view.getUint32(abs + i * 8 + 4, le);
    return den ? num / den : 0;
  }

  let lat = rational(latDataAbs, 0) + rational(latDataAbs, 1) / 60 + rational(latDataAbs, 2) / 3600;
  let lng = rational(lngDataAbs, 0) + rational(lngDataAbs, 1) / 60 + rational(lngDataAbs, 2) / 3600;

  if (latRef === 'S') lat = -lat;
  if (lngRef === 'W') lng = -lng;

  if (!isFinite(lat) || !isFinite(lng) || (lat === 0 && lng === 0)) return null;
  return { lat, lng, accuracy: null };
}
