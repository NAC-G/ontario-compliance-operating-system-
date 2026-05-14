/**
 * Taxonomy loader and tag-resolution helpers.
 * Imports taxonomy.json bundled with the PWA.
 */

let _taxonomy = null;

export async function loadTaxonomy() {
  if (_taxonomy) return _taxonomy;
  const res = await fetch('/taxonomy.json');
  _taxonomy = await res.json();
  return _taxonomy;
}

export function getSeverityDefault(tagIds) {
  if (!_taxonomy || !tagIds?.length) return 'Info';
  const order = ['Info', 'Low', 'Medium', 'High', 'Critical'];
  let max = 0;
  tagIds.forEach(catId => {
    _taxonomy.tags
      .filter(t => t.category === catId)
      .forEach(t => {
        const raw = (t.severity_default || '').toLowerCase();
        const normalized = raw === 'med' ? 'medium' : raw;
        const idx = order.findIndex(s => s.toLowerCase() === normalized);
        if (idx > max) max = idx;
      });
  });
  return order[max] || 'Info';
}

export function getAutoStatus(tagIds) {
  if (!_taxonomy || !tagIds?.length) return 'Routine';
  const priority = ['Incident', 'Hazard - Open', 'Inspection', 'Routine'];
  let best = priority.length - 1;
  tagIds.forEach(catId => {
    _taxonomy.tags
      .filter(t => t.category === catId)
      .forEach(t => {
        const idx = priority.indexOf(t.auto_status);
        if (idx !== -1 && idx < best) best = idx;
      });
  });
  return priority[best];
}

export function resolveOhsaRefs(tagIds) {
  if (!_taxonomy || !tagIds?.length) return [];
  const refs = new Set();
  tagIds.forEach(catId => {
    _taxonomy.tags
      .filter(t => t.category === catId)
      .forEach(t => {
        (t.ohsa || []).forEach(r => refs.add(r));
        (t.oreg || []).forEach(r => refs.add(r));
      });
  });
  return [...refs];
}
