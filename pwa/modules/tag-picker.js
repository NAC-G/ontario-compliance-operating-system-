/**
 * Taxonomy loader and tag-resolution helpers.
 * Imports taxonomy.json bundled with the PWA.
 */

let _taxonomy = null;
let _tagMap = null; // fine-grained tag id -> tag object, built once taxonomy loads

export async function loadTaxonomy() {
  if (_taxonomy) return _taxonomy;
  const res = await fetch('/taxonomy.json');
  _taxonomy = await res.json();
  _tagMap = Object.fromEntries(_taxonomy.tags.map(t => [t.id, t]));
  return _taxonomy;
}

// tagIds must be fine-grained tag ids (e.g. 'HK-SLIP-TRIP'), not category
// ids. These used to be looked up as `t.category === catId`, which only
// ever matched when the caller passed category ids — which is exactly
// what the tag picker UI used to store, so severity/status/OHSA
// auto-resolution never actually worked for a real capture. Fixed
// alongside the tag picker becoming a real category -> tag drill-down.

export function getSeverityDefault(tagIds) {
  if (!_tagMap || !tagIds?.length) return 'Info';
  const order = ['Info', 'Low', 'Med', 'High', 'Critical'];
  let max = 0;
  tagIds.forEach(id => {
    const t = _tagMap[id];
    if (!t?.severity_default) return;
    const idx = order.indexOf(t.severity_default);
    if (idx > max) max = idx;
  });
  return order[max] || 'Info';
}

export function getAutoStatus(tagIds) {
  if (!_tagMap || !tagIds?.length) return 'Routine';
  // Keep in sync with workers/lib/taxonomy.js's server-side copy of this
  // priority order.
  const priority = ['Incident', 'Hazard - Open', 'Deficiency - Open', 'Hazard - Corrected', 'Deficiency - Corrected', 'Inspection', 'Routine'];
  let best = priority.length - 1;
  tagIds.forEach(id => {
    const t = _tagMap[id];
    if (!t?.auto_status) return;
    const idx = priority.indexOf(t.auto_status);
    if (idx !== -1 && idx < best) best = idx;
  });
  return priority[best];
}

export function resolveOhsaRefs(tagIds) {
  if (!_tagMap || !tagIds?.length) return [];
  const refs = new Set();
  tagIds.forEach(id => {
    const t = _tagMap[id];
    if (!t) return;
    (t.ohsa || []).forEach(r => refs.add(r));
    (t.oreg || []).forEach(r => refs.add(r));
  });
  return [...refs];
}

// Human-readable label for a fine-grained tag id, for display (photo
// chips, etc.) — falls back to the raw id if the taxonomy hasn't loaded
// yet or the id is unrecognized (e.g. legacy/demo data from before this
// taxonomy existed).
export function tagLabel(tagId) {
  return _tagMap?.[tagId]?.label || tagId;
}
