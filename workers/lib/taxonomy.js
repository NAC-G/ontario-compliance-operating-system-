/**
 * Resolves OHSA/O.Reg references from tag IDs.
 * Taxonomy is bundled at build time from specs/OCOS-RegulatoryTaxonomy.json.
 */
import TAXONOMY from '../../specs/OCOS-RegulatoryTaxonomy.json';

const TAG_MAP = Object.fromEntries(TAXONOMY.tags.map(t => [t.id, t]));

export function getTag(tagId) {
  return TAG_MAP[tagId] || null;
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

export function getAutoStatus(tagIds) {
  const priority = ['Incident', 'Hazard - Open', 'Inspection', 'Routine'];
  let best = 'Routine';
  for (const id of tagIds) {
    const tag = TAG_MAP[id];
    if (!tag?.auto_status) continue;
    if (priority.indexOf(tag.auto_status) < priority.indexOf(best)) {
      best = tag.auto_status;
    }
  }
  return best;
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
