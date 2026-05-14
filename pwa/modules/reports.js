/**
 * Report list rendering helpers.
 */

import { C } from './copy.js';

export function renderReportCard(report, onClick) {
  const card = document.createElement('div');
  card.className = 'report-card';

  const title = document.createElement('div');
  title.className = 'report-card-title';
  title.textContent = report.title || 'Untitled report';

  const meta = document.createElement('div');
  meta.className = 'report-card-meta';
  meta.textContent = formatReportMeta(report);

  card.appendChild(title);
  card.appendChild(meta);

  if (report.locked) {
    const badge = document.createElement('div');
    badge.className = 'locked-badge';
    badge.textContent = '🔒 Locked';
    card.appendChild(badge);
  }

  card.addEventListener('click', () => onClick(report));
  return card;
}

function formatReportMeta(report) {
  const parts = [];
  if (report.type) parts.push(report.type);
  if (report.date) parts.push(new Date(report.date).toLocaleDateString('en-CA'));
  if (report.version && report.version > 1) parts.push(`v${report.version}`);
  return parts.join(' · ');
}

export function renderVersionRow(version, onOpen) {
  const row = document.createElement('div');
  row.className = 'version-row';

  const label = document.createElement('span');
  label.className = 'version-label';
  label.textContent = C.versionHistory.rowFormat(
    version.version,
    new Date(version.lockedAt).toLocaleString('en-CA', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
    version.recipientCount || 0
  );

  const btn = document.createElement('button');
  btn.className = 'btn btn-ghost btn-xs';
  btn.textContent = C.versionHistory.btn;
  btn.addEventListener('click', () => onOpen(version));

  row.appendChild(label);
  row.appendChild(btn);
  return row;
}
