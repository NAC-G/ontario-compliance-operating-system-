/**
 * PDF report generator — 3 templates: Toolbox Talk, JHSC Inspection, Incident.
 * NAC brand: #080A07 / #5EE830 / #E8A830, Bebas Neue / DM Mono / DM Sans.
 * All boilerplate copy verbatim from OCOS-AppCopy.md §"PDF report — boilerplate copy".
 *
 * Returns: Uint8Array (PDF bytes) — the appendix is appended by the caller
 * before computing the final lock hash.
 */

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { appendAuditTrail } from './pdf-audit-appendix.js';

const DARK  = rgb(8 / 255, 10 / 255, 7 / 255);
const GREEN = rgb(94 / 255, 232 / 255, 48 / 255);
const AMBER = rgb(232 / 255, 168 / 255, 48 / 255);
const WHITE = rgb(1, 1, 1);

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN = 48;
const CONTENT_W = PAGE_W - MARGIN * 2;

/**
 * @param {object} params
 * @param {string} params.reportType   — 'Toolbox Talk Record' | 'JHSC Inspection' | 'Incident Report'
 * @param {object} params.site
 * @param {object} params.inspection   — nullable
 * @param {object[]} params.photos
 * @param {object[]} params.signoffs
 * @param {string[]} params.regulatoryAnchors
 * @param {object} params.branding     — { logoBytes?, primaryColour?, accentColour?, companyName?, footerLine? }
 * @param {object} params.report       — report metadata for the audit trail
 * @param {string} params.licenseeName
 * @returns {Promise<Uint8Array>}      — full PDF bytes (with audit appendix)
 */
export async function generateReport(params) {
  const {
    reportType,
    site,
    inspection,
    photos = [],
    signoffs = [],
    regulatoryAnchors = [],
    branding = {},
    report,
    licenseeName,
    aiBody,           // AI-generated body text
  } = params;

  const pdfDoc = await PDFDocument.create();

  const font     = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontMono = await pdfDoc.embedFont(StandardFonts.Courier);

  // Resolve branding — T3 custom or NAC defaults
  const accentRaw = branding.accentColour || '#E8A830';
  const primaryRaw = branding.primaryColour || '#080A07';
  const accentColor = hexToRgb(accentRaw) || AMBER;
  const primaryColor = hexToRgb(primaryRaw) || DARK;
  const companyName = branding.companyName || 'Natural Alternatives';
  const footerLine = branding.footerLine || 'naturalalternatives.ca';

  // ── Cover page ────────────────────────────────────────────────────────────
  let page = pdfDoc.addPage([PAGE_W, PAGE_H]);
  let y = PAGE_H - MARGIN;

  // Header bar
  page.drawRectangle({ x: 0, y: PAGE_H - 60, width: PAGE_W, height: 60, color: primaryColor });

  // Company name (left)
  page.drawText(companyName.toUpperCase(), {
    x: MARGIN, y: PAGE_H - 38, size: 14, font: fontBold, color: accentColor,
  });
  // Report type (right)
  page.drawText(reportType.toUpperCase(), {
    x: PAGE_W - MARGIN - 200, y: PAGE_H - 38, size: 10, font: fontBold, color: WHITE,
  });

  y = PAGE_H - 80;

  // Report title
  page.drawText(reportType, { x: MARGIN, y, size: 22, font: fontBold, color: primaryColor });
  y -= 30;

  // Metadata rows (verbatim field labels from AppCopy.md cover page)
  const metaRows = [
    ['Site', site?.name || '—'],
    ['Date', formatDateRange(inspection?.dateRangeStart, inspection?.dateRangeEnd)],
    ['Lead', inspection?.leadName ? `${inspection.leadName} — ${inspection.leadRole || ''}` : '—'],
    ['Generated', new Date(report.generatedAt).toLocaleString('en-CA', { timeZone: 'America/Toronto' })],
  ];

  for (const [label, value] of metaRows) {
    page.drawText(`${label}:`, { x: MARGIN, y, size: 10, font: fontBold, color: primaryColor });
    page.drawText(value, { x: MARGIN + 80, y, size: 10, font, color: DARK });
    y -= 16;
  }

  y -= 10;

  // Section divider: Inspection Summary
  y = drawSectionDivider(page, y, 'Inspection Summary', primaryColor, fontBold);

  // AI-generated body
  if (aiBody) {
    y = drawWrappedText(page, aiBody, { x: MARGIN, y, font, size: 10, maxW: CONTENT_W, color: DARK });
    y -= 8;
  }

  // ── Photo Evidence page ───────────────────────────────────────────────────
  if (photos.length > 0) {
    page = pdfDoc.addPage([PAGE_W, PAGE_H]);
    y = PAGE_H - MARGIN;
    y = drawSectionDivider(page, y, 'Photo Evidence', primaryColor, fontBold);

    for (const ph of photos) {
      if (y < 160) {
        page = pdfDoc.addPage([PAGE_W, PAGE_H]);
        y = PAGE_H - MARGIN;
      }
      y -= 4;
      page.drawText(`Photo ID: ${ph.photoId}`, { x: MARGIN, y, size: 8, font: fontMono, color: DARK });
      y -= 11;
      page.drawText(`Captured: ${ph.capturedAt || '—'}  |  GPS: ${formatGps(ph.geoLat, ph.geoLng)}`, {
        x: MARGIN, y, size: 8, font, color: DARK,
      });
      y -= 11;
      page.drawText(`Tags: ${(ph.tags || []).join(', ') || '—'}`, { x: MARGIN, y, size: 8, font, color: DARK });
      y -= 11;
      page.drawText(`OHSA: ${ph.ohsaRefs || '—'}`, { x: MARGIN, y, size: 8, font, color: DARK });
      y -= 11;
      if (ph.caption) {
        y = drawWrappedText(page, ph.caption, { x: MARGIN, y, font, size: 9, maxW: CONTENT_W, color: DARK });
      }
      page.drawLine({
        start: { x: MARGIN, y: y - 4 },
        end: { x: PAGE_W - MARGIN, y: y - 4 },
        thickness: 0.5,
        color: GREEN,
      });
      y -= 12;
    }
  }

  // ── Audit Appendix (mandatory — throws if data incomplete) ────────────────
  await appendAuditTrail(pdfDoc, {
    report,
    site: { id: site.id, name: site.name, geocode: site.geocode, siteType: site.siteType },
    photos: photos.map(p => ({
      photoId: p.photoId,
      capturedAt: p.capturedAt,
      capturedAtLocal: p.capturedAtLocal,
      geoLat: p.geoLat,
      geoLng: p.geoLng,
      deviceIdHash: p.deviceId,
      sha256: p.hash,
      tags: p.tags,
      ohsaRefs: p.ohsaRefs,
    })),
    signoffs,
    regulatoryAnchors,
    documentHash: '',   // placeholder — final hash computed at lock time
    licenseeName,
  });

  return pdfDoc.save();
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function drawSectionDivider(page, y, title, color, fontBold) {
  page.drawLine({
    start: { x: MARGIN, y }, end: { x: PAGE_W - MARGIN, y },
    thickness: 1.5, color,
  });
  y -= 16;
  page.drawText(title.toUpperCase(), { x: MARGIN, y, size: 10, font: fontBold, color });
  y -= 14;
  return y;
}

function drawWrappedText(page, text, { x, y, font, size, maxW, color }) {
  const lines = [];
  for (const paragraph of text.split('\n')) {
    const words = paragraph.split(' ');
    let line = '';
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(test, size) <= maxW) {
        line = test;
      } else {
        if (line) lines.push(line);
        line = word;
      }
    }
    if (line) lines.push(line);
    lines.push('');
  }
  for (const line of lines) {
    page.drawText(line, { x, y, size, font, color });
    y -= size + 3;
  }
  return y;
}

function formatDateRange(start, end) {
  if (!start) return '—';
  if (!end || start === end) return start;
  return `${start} – ${end}`;
}

function formatGps(lat, lng) {
  if (lat == null || lng == null) return '—';
  return `${parseFloat(lat).toFixed(5)}, ${parseFloat(lng).toFixed(5)}`;
}

function hexToRgb(hex) {
  const m = (hex || '').match(/^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (!m) return null;
  return rgb(parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255);
}
