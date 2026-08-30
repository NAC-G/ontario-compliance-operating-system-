/**
 * Resolves OHSA/O.Reg references from tag IDs.
 * Taxonomy is bundled at build time from specs/OCOS-RegulatoryTaxonomy.json.
 */
import TAXONOMY from '../../specs/OCOS-RegulatoryTaxonomy.json';

const TAG_MAP = Object.fromEntries(TAXONOMY.tags.map(t => [t.id, t]));

export function getTag(tagId) {
  return TAG_MAP[tagId] || null;
}

// Tag ids whose human-readable label contains the query (case-insensitive)
// — lets a text search match "slip" against the HK-SLIP-TRIP tag's label
// "Slip / trip / fall hazard", not just literal photo text.
export function findTagIdsByLabel(query) {
  const q = query.toLowerCase();
  return TAXONOMY.tags.filter(t => t.label.toLowerCase().includes(q)).map(t => t.id);
}

export function resolveOhsaRefs(tagIds) {
  const refs = new Set();
  for (const id of tagIds) {
    const tag = TAG_MAP[id];
    if (!tag) continue;
    (tag.ohsa || []).forEach(r => refs.add(r));
    (tag.oreg || []).forEach(r => refs.add(r));
  }
  return Array.from(refs).sort();
}

export function getSeverityDefault(tagIds) {
  const order = ['Critical', 'High', 'Med', 'Low', 'Info'];
  let highest = 'Info';
  for (const id of tagIds) {
    const tag = TAG_MAP[id];
    if (!tag?.severity_default) continue;
    if (order.indexOf(tag.severity_default) < order.indexOf(highest)) {
      highest = tag.severity_default;
    }
  }
  return highest;
}

// Order matters: earlier = higher priority when a photo has multiple tags
// whose auto_status disagrees. Previously missing 'Hazard - Corrected' and
// 'Deficiency - Corrected' entirely, and the loop below had no guard for
// indexOf returning -1 for an unlisted status — since -1 < any real index,
// an unlisted status (e.g. any tag using 'Hazard - Corrected', which
// MOL-COMPLIANCE does) would always incorrectly win over every other tag,
// including 'Incident'. Fixed by listing every real status value and
// guarding the -1 case explicitly (matches pwa/modules/tag-picker.js's
// client-side copy of this same function, which already had the guard).
export function getAutoStatus(tagIds) {
  const priority = ['Incident', 'Hazard - Open', 'Deficiency - Open', 'Hazard - Corrected', 'Deficiency - Corrected', 'Inspection', 'Routine'];
  let best = priority.length - 1;
  for (const id of tagIds) {
    const tag = TAG_MAP[id];
    if (!tag?.auto_status) continue;
    const idx = priority.indexOf(tag.auto_status);
    if (idx !== -1 && idx < best) best = idx;
  }
  return priority[best];
}

export function getAllTags() {
  return TAXONOMY.tags;
}

export function getAllCategories() {
  return TAXONOMY.categories;
}

export function getCitation(ref) {
  return TAXONOMY.regulatory_anchors[ref] || ref;
}
