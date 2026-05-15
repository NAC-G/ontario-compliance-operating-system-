/**
 * OCOS Field — main screen controller.
 * Imports all module files; drives screen transitions and copy population.
 */

import { C } from './modules/copy.js';
import { getSetting, setSetting, getPendingCount } from './modules/db.js';
import { uploadPhoto, getSite, createInspection, signoffInspection,
         generateReport as apiGenerateReport, lockReport, sendReport as apiSendReport,
         regenerateReport, getReportVersions, listReports, seedDemoData, getPhotoAudioUrl } from './modules/api.js';
import { requestPermissions } from './modules/permissions.js';
import { openCamera, openLibrary } from './modules/camera.js';
import { recordVoice, stopRecording, pauseRecording, resumeRecording, transcribeVoice, VOICE_MAX_SECONDS, VOICE_CL_MAX_SECONDS } from './modules/voice.js';
import { loadTaxonomy, getSeverityDefault, getAutoStatus } from './modules/tag-picker.js';
import { getChecklistForType } from './modules/inspection.js';
import { SyncManager } from './modules/sync.js';
import { loadStyleSamples, uploadSample } from './modules/style-samples.js';
import { renderReportCard, renderVersionRow } from './modules/reports.js';

// ── State ──────────────────────────────────────────────────────────────────

const state = {
  licenseKey:        null,
  tier:              'T2',
  currentSite:       null,
  captureState:      null,   // { photoId, photoBlob, photoUrl, exif, tags, severity, status, voiceNote, pairedWithId }
  currentInspection: null,   // { type, label, items[], workers[] }
  pendingWorkers:    [],
  currentReport:     null,
  pendingRecipients: [],
  pendingSampleTag:  null,
  signingWorkerIdx:  null,
  pinBuffer:         '',
};

// ── Screen stack ───────────────────────────────────────────────────────────

let screenStack = [];

function showScreen(id, push = true) {
  document.querySelectorAll('[data-screen]').forEach(s => s.classList.remove('active'));
  const target = document.querySelector(`[data-screen="${id}"]`);
  if (target) target.classList.add('active');
  if (push) {
    screenStack.push(id);
    history.pushState({ screen: id, stackLen: screenStack.length }, '', `#${id}`);
  }
  updateHeader(id);
}

function goBack() {
  if (screenStack.length > 1) {
    screenStack.pop();
    const prev = screenStack[screenStack.length - 1];
    document.querySelectorAll('[data-screen]').forEach(s => s.classList.remove('active'));
    const target = document.querySelector(`[data-screen="${prev}"]`);
    if (target) target.classList.add('active');
    updateHeader(prev);
  }
}

// Native browser/device back & forward buttons
window.addEventListener('popstate', e => {
  const id = e.state?.screen;
  if (!id) return;
  // Rebuild stack position without pushing new history
  const stackIdx = screenStack.lastIndexOf(id);
  if (stackIdx !== -1) {
    screenStack = screenStack.slice(0, stackIdx + 1);
  } else {
    screenStack = [id];
  }
  document.querySelectorAll('[data-screen]').forEach(s => s.classList.remove('active'));
  const target = document.querySelector(`[data-screen="${id}"]`);
  if (target) target.classList.add('active');
  updateHeader(id);
});

const ONBOARDING = new Set(['welcome', 'permissions', 'site-setup', 'ready']);
const MAIN_TABS  = new Set(['capture', 'inspections', 'reports', 'settings']);
const NO_BACK    = new Set([...ONBOARDING, ...MAIN_TABS, 'license-entry']);

function updateHeader(screenId) {
  const header  = document.getElementById('app-header');
  const backBtn = document.getElementById('back-btn');
  const title   = document.getElementById('app-title');

  if (ONBOARDING.has(screenId)) { header.hidden = true; return; }
  header.hidden = false;
  backBtn.hidden = NO_BACK.has(screenId);

  const TITLES = {
    capture: state.currentSite?.name || 'OCOS Field',
    inspections: 'Inspections', reports: 'Reports', settings: 'Settings',
    'tag-picker': 'Tag photo', severity: 'Severity', status: 'Status',
    voice: 'Voice note', 'before-after': 'Before / After',
    'site-new': 'New site', 'site-list': 'Sites',
    'license-entry': 'License key',
    'inspection-type': 'New inspection', 'inspection-checklist': 'Inspection',
    'signoff-workers': 'Sign-off', 'signoff-draw': 'Sign here', 'signoff-pin': 'Enter PIN',
    'inspection-complete': 'Done',
    'report-ready': 'Report', 'report-send': 'Send report',
    'report-locked': 'Locked', 'version-history': 'Versions',
    'style-learning': 'Style Learning', 'branding-setup': 'Custom Branding', 'brand-preview': 'Preview',
  };
  title.textContent = TITLES[screenId] || 'OCOS Field';
}

// ── Toast ──────────────────────────────────────────────────────────────────

function showToast(msg, duration = 3000) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(t._timer);
  t._timer = setTimeout(() => { t.hidden = true; }, duration);
}

// ── Error modal ────────────────────────────────────────────────────────────

function showError(errKey) {
  const err = C.errors[errKey];
  if (!err) return;
  const modal = document.getElementById('error-modal');
  document.getElementById('error-headline').textContent = err.headline;
  document.getElementById('error-body').textContent = err.body;
  const actions = document.getElementById('error-actions');
  actions.innerHTML = '';
  const btns = Array.isArray(err.btns) ? err.btns : (err.btn ? [err.btn] : ['OK']);
  btns.forEach((label, i) => {
    const b = document.createElement('button');
    b.className = i === 0 ? 'btn btn-primary' : 'btn btn-ghost';
    b.textContent = label;
    b.addEventListener('click', () => {
      modal.hidden = true;
      if (label === 'Open settings' || label === 'Turn on location') {
        showToast('Open your browser or device settings to change permissions.');
      }
      if (label === 'Retry now') retrySync();
    });
    actions.appendChild(b);
  });
  modal.hidden = false;
}

document.getElementById('error-modal').addEventListener('click', e => {
  if (e.target === e.currentTarget) e.currentTarget.hidden = true;
});

// Listen for error events from modules
document.addEventListener('ocos:error', e => showError(e.detail));

// ── Sync chip ──────────────────────────────────────────────────────────────

const syncMgr = new SyncManager({
  onUpdate(chipState, data) {
    const chip = document.getElementById('sync-chip');
    chip.className = 'sync-chip';
    switch (chipState) {
      case 'synced':        chip.textContent = C.sync.synced;                          chip.classList.add('sync--synced');  break;
      case 'syncing':       chip.textContent = C.sync.syncing(data.n, data.total);     chip.classList.add('sync--syncing'); break;
      case 'offline-queue': chip.textContent = C.sync.offlineQueue(data.n);            chip.classList.add('sync--offline'); break;
      case 'offline-idle':  chip.textContent = C.sync.offlineIdle;                     chip.classList.add('sync--offline'); break;
      case 'error':         chip.textContent = C.sync.error;                           chip.classList.add('sync--error');   break;
    }
  },
});

async function retrySync() {
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    const reg = await navigator.serviceWorker.ready;
    await reg.sync.register('fc-photo-upload');
  }
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', e => {
    if (e.data?.type === 'SYNC_COMPLETE') {
      syncMgr.markSynced();
      showToast('Photos synced.');
      loadDossier(state.currentSite?.id);
    }
  });
}

// ── INIT ───────────────────────────────────────────────────────────────────

async function init() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js').catch(console.error);
  }

  populateCopy();

  // ?key=XXXX in URL → auto-install license, seed demo workspace, skip onboarding
  const urlKey = new URLSearchParams(location.search).get('key');
  if (urlKey) {
    await setSetting('licenseKey', urlKey);
    await setSetting('onboardingComplete', true);
    history.replaceState({}, '', location.pathname);
    try {
      const result = await seedDemoData();
      if (result?.siteId) {
        await setSetting('activeSiteId', result.siteId);
        await setSetting('demoSeeded', true);
      }
    } catch (_) { /* non-fatal */ }
  }

  state.licenseKey = await getSetting('licenseKey');
  const onboarded  = await getSetting('onboardingComplete');

  if (!state.licenseKey || !onboarded) {
    showScreen('welcome', false);
    screenStack = ['welcome'];
    return;
  }

  const siteId = await getSetting('activeSiteId');
  if (siteId) {
    try {
      const site = await getSite(siteId);
      state.currentSite = normalizeSite(site, siteId);
      state.tier = state.currentSite.tier;
    } catch (_) { /* offline — continue without fresh data */ }
  }

  enterMainApp();
}

function enterMainApp() {
  screenStack = ['capture'];
  showScreen('capture', false);
  updateNavBtns('capture');
  loadDossier(state.currentSite?.id);
  updateSettingsPanel();
}

// ── Copy population ────────────────────────────────────────────────────────

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function populateCopy() {
  // Onboarding
  setText('welcome-headline',       C.welcome.headline);
  setText('welcome-sub',            C.welcome.sub);
  setText('welcome-btn',            C.welcome.btn);
  setText('permissions-headline',   C.permissions.headline);
  setText('permissions-sub',        C.permissions.sub);
  setText('permissions-btn',        C.permissions.btn);
  setText('site-setup-headline',    C.siteSetup.headline);
  setText('site-setup-sub',         C.siteSetup.sub);
  setText('site-setup-existing-btn',C.siteSetup.btnExisting);
  setText('site-setup-new-btn',     C.siteSetup.btnNew);
  setText('ready-headline',         C.ready.headline);
  setText('ready-sub',              C.ready.sub);
  setText('ready-btn',              C.ready.btn);

  // Permissions list
  const permList = document.getElementById('perm-list');
  C.permissions.perms.forEach(p => {
    const li = document.createElement('li');
    li.className = 'perm-row';
    li.innerHTML = `<span class="perm-icon">${p.icon}</span><div><div class="perm-label">${p.label}</div><div class="perm-desc">${p.desc}</div></div>`;
    permList.appendChild(li);
  });

  // Capture
  setText('capture-empty-heading', C.emptyCapture.headline);
  setText('capture-empty-sub',     C.emptyCapture.sub);
  setText('photo-card-heading',    C.photoCard.heading);
  setText('photo-card-line1',      C.photoCard.line1);
  setText('photo-card-line2',      C.photoCard.line2);
  setText('tag-picker-heading',    C.tagPicker.heading);
  setText('tag-picker-sub',        C.tagPicker.sub);
  setText('severity-heading',      C.severity.heading);
  setText('severity-helper',       C.severity.helper);
  setText('status-heading',        C.status.heading);
  setText('voice-heading',         C.voiceIdle.heading);
  setText('voice-sub',             C.voiceIdle.sub);
  setText('voice-confirm-btn',     C.voiceDone.btnConfirm);
  setText('ba-heading',            C.beforeAfter.heading);
  setText('ba-sub',                C.beforeAfter.sub);
  setText('ba-pair-btn',           C.beforeAfter.btnPair);
  setText('ba-skip-btn',           C.beforeAfter.btnSkip);

  // Inspection
  setText('signoff-workers-heading',  C.signoffWorkers.heading);
  setText('signoff-workers-sub',      C.signoffWorkers.sub);
  setText('add-worker-btn',           C.signoffWorkers.btnAdd);
  setText('alone-btn',                C.signoffWorkers.btnAlone);
  setText('signoff-draw-heading',     C.signoffDraw.heading);
  setText('sig-save-btn',             C.signoffDraw.btnSave);
  setText('sig-pin-btn',              C.signoffDraw.btnPin);
  setText('pin-heading',              C.signoffPin.heading);
  setText('pin-sub',                  C.signoffPin.sub);
  setText('insp-complete-heading',    C.inspectionComplete.heading);
  setText('insp-complete-sub',        C.inspectionComplete.sub);
  setText('insp-generate-report-btn', C.inspectionComplete.btnGenerate);
  setText('insp-draft-btn',           C.inspectionComplete.btnDraft);

  // Reports
  setText('reports-title',           C.reportList.title);
  setText('report-gen-heading',      C.reportGenerating.heading);
  setText('report-gen-sub',          C.reportGenerating.sub);
  setText('report-ready-heading',    C.reportReady.heading);
  setText('report-ready-sub',        C.reportReady.sub);
  setText('report-open-pdf-btn',     C.reportReady.btnOpen);
  setText('report-send-quick-btn',   C.reportReady.btnSend);
  setText('report-send-heading',     C.reportSend.heading);
  setText('report-send-sub',         C.reportSend.sub);
  setText('download-report-btn',     C.reportSend.btnDownload);
  setText('report-locked-heading',   C.reportLocked.heading);
  setText('report-locked-sub',       C.reportLocked.sub);
  setText('report-locked-done-btn',  C.reportLocked.btn);
  setText('version-history-heading', C.versionHistory.heading);

  // Style learning
  setText('style-empty-heading',   C.styleLearning.empty.heading);
  setText('style-empty-sub',       C.styleLearning.empty.sub);
  setText('style-upload-btn',      C.styleLearning.empty.btn);
  setText('style-privacy',         C.styleLearning.empty.privacy);
  setText('style-uploading-heading', C.styleLearning.uploading.heading);
  setText('style-uploading-sub',     C.styleLearning.uploading.sub);
  setText('style-ready-heading',   C.styleLearning.ready.heading);

  // Branding
  setText('branding-heading',      C.branding.heading);
  setText('branding-sub',          C.branding.sub);
  setText('brand-save-btn',        C.branding.btnSave);
  setText('branding-footer-note',  C.branding.footer);

  // Dynamic lists
  renderFilterBar('filter-row',         C.filterBar,             'All',  f => filterDossier(f));
  renderFilterBar('reports-filter-row', C.reportList.filters,    'All',  f => filterReports(f));
  renderOptionList('insp-type-list',    C.inspectionTypes,              v => onInspectionTypeSelected(v));
  renderOptionList('status-list',       C.status.options,               v => onStatusSelected(v));
  renderSeverityRow();
  renderOptionList('style-tag-list',    C.styleLearning.ready.tags,     v => { state.pendingSampleTag = v; });

  const roleSelect = document.getElementById('recipient-role');
  C.reportSend.roles.forEach(r => {
    const opt = document.createElement('option');
    opt.value = r; opt.textContent = r;
    roleSelect.appendChild(opt);
  });
}

function renderFilterBar(containerId, labels, activeLabel, onFilter) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  labels.forEach(label => {
    const btn = document.createElement('button');
    btn.className = 'filter-chip' + (label === activeLabel ? ' filter-chip--active' : '');
    btn.textContent = label;
    btn.addEventListener('click', () => {
      container.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('filter-chip--active'));
      btn.classList.add('filter-chip--active');
      onFilter(label);
    });
    container.appendChild(btn);
  });
}

function renderOptionList(containerId, options, onSelect) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option-row';
    btn.dataset.value = opt.value;
    btn.textContent = opt.label;
    btn.addEventListener('click', () => {
      container.querySelectorAll('.option-row').forEach(b => b.classList.remove('option-row--active'));
      btn.classList.add('option-row--active');
      onSelect(opt.value);
    });
    container.appendChild(btn);
  });
}

function renderSeverityRow() {
  const container = document.getElementById('severity-row');
  container.innerHTML = '';
  C.severity.options.forEach(sev => {
    const btn = document.createElement('button');
    btn.className = 'sev-btn';
    btn.dataset.sev = sev.toLowerCase();
    btn.textContent = sev;
    btn.addEventListener('click', () => {
      container.querySelectorAll('.sev-btn').forEach(b => b.classList.remove('sev-btn--active'));
      btn.classList.add('sev-btn--active');
      if (state.captureState) state.captureState.severity = sev;
      document.getElementById('severity-done-btn').disabled = false;
    });
    container.appendChild(btn);
  });
}

// ── Bottom nav ─────────────────────────────────────────────────────────────

function updateNavBtns(activeId) {
  document.querySelectorAll('.nav-btn').forEach(b =>
    b.classList.toggle('nav-btn--active', b.dataset.nav === activeId));
}

document.addEventListener('click', e => {
  const btn = e.target.closest('[data-nav]');
  if (!btn) return;
  const nav = btn.dataset.nav;
  updateNavBtns(nav);
  showScreen(nav, false);
  screenStack = [nav];
  if (nav === 'capture')    loadDossier(state.currentSite?.id);
  if (nav === 'reports')    loadReports();
  if (nav === 'settings')   updateSettingsPanel();
});

// ── ONBOARDING ─────────────────────────────────────────────────────────────

document.getElementById('welcome-btn').addEventListener('click', () => showScreen('permissions'));

document.getElementById('permissions-btn').addEventListener('click', async () => {
  const perms = await requestPermissions();
  if (perms.camera === 'denied') { showError('cameraDenied'); return; }
  if (!perms.camera)             { showError('cameraDenied'); return; }
  if (perms.mic === 'denied')    showError('micDenied');
  if (perms.gps === 'denied')    showError('gpsDenied');
  else if (!perms.gps)           showError('gpsOff');
  showScreen('site-setup');
});

document.getElementById('site-setup-existing-btn').addEventListener('click', () => {
  showScreen('site-list');
  loadSiteList();
});
document.getElementById('site-setup-new-btn').addEventListener('click', () => showScreen('site-new'));
document.getElementById('add-site-from-list-btn').addEventListener('click', () => showScreen('site-new'));

document.getElementById('create-site-btn').addEventListener('click', async () => {
  const name = document.getElementById('new-site-name').value.trim();
  if (!name) { showToast('Enter a site name.'); return; }
  const address = document.getElementById('new-site-address').value.trim();
  state.currentSite = { id: 'local-' + Date.now(), name, address };
  await setSetting('activeSiteId', state.currentSite.id);
  showScreen('ready');
});

document.getElementById('ready-btn').addEventListener('click', async () => {
  await setSetting('onboardingComplete', true);
  enterMainApp();
});

document.getElementById('save-license-btn').addEventListener('click', async () => {
  const key = document.getElementById('license-input').value.trim();
  if (!key) { showToast('Enter your license key.'); return; }
  await setSetting('licenseKey', key);
  state.licenseKey = key;
  updateSettingsPanel();
  showToast('License key saved.');
  goBack();

  // First-time seed: populate demo workspace if not already done
  const alreadySeeded = await getSetting('demoSeeded');
  if (!alreadySeeded) {
    try {
      const result = await seedDemoData();
      if (result?.ok) {
        await setSetting('demoSeeded', true);
        if (result.siteId && !state.activeSiteId) {
          await setSetting('activeSiteId', result.siteId);
          state.activeSiteId = result.siteId;
          loadDossier(result.siteId);
        }
        showToast('Demo workspace ready.');
      }
    } catch { /* non-fatal — user can still use the app */ }
  }
});

// ── DOSSIER ────────────────────────────────────────────────────────────────

let currentDossierFilter = 'All';

// Flatten the /fc/site/:id response so state.currentSite.id, .name, .tier work everywhere
function normalizeSite(apiResponse, siteIdFallback) {
  return {
    ...apiResponse,
    id:   apiResponse.site?.id   || siteIdFallback || '',
    name: apiResponse.site?.name || '',
    tier: apiResponse.tier       || 'T2',
  };
}

async function loadDossier(siteId) {
  if (!siteId) {
    const grid  = document.getElementById('photo-grid');
    const empty = document.getElementById('capture-empty');
    grid.innerHTML = '';
    grid.appendChild(empty);
    empty.hidden = false;
    document.getElementById('dossier-counts').textContent = 'No site selected';
    document.getElementById('current-site-name').textContent = 'Select site';
    return;
  }
  document.getElementById('current-site-name').textContent = state.currentSite?.name || siteId;
  try {
    const data = await getSite(siteId);
    state.currentSite = normalizeSite(data, siteId);
    state.tier = state.currentSite.tier;
    document.getElementById('current-site-name').textContent = state.currentSite.name || siteId;
    renderDossier(state.currentSite);
  } catch (_) {
    document.getElementById('dossier-counts').textContent = 'Offline — cached view';
  }
}

function renderDossier(data) {
  const photos    = data.photos || [];
  const openCount = data.openHazards || 0;

  document.getElementById('dossier-counts').textContent =
    `${photos.length} photo${photos.length !== 1 ? 's' : ''} · ${openCount} open hazard${openCount !== 1 ? 's' : ''}`;

  const filtered = filterPhotos(photos, currentDossierFilter);
  const grid     = document.getElementById('photo-grid');
  const empty    = document.getElementById('capture-empty');
  if (filtered.length === 0) {
    const isFiltered = currentDossierFilter !== 'All';
    document.getElementById('capture-empty-heading').textContent =
      isFiltered ? C.emptyFilter.heading : C.emptyCapture.headline;
    document.getElementById('capture-empty-sub').textContent =
      isFiltered ? C.emptyFilter.sub : C.emptyCapture.sub;
    grid.querySelectorAll('.photo-thumb').forEach(t => t.remove());
    if (empty) {
      if (!grid.contains(empty)) grid.appendChild(empty);
      empty.hidden = false;
    }
    return;
  }
  if (empty) empty.hidden = true;
  grid.querySelectorAll('.photo-thumb').forEach(t => t.remove());

  filtered.forEach(photo => {
    const thumb = document.createElement('div');
    thumb.className = 'photo-thumb';
    if (photo.status === 'Hazard - Open') thumb.classList.add('photo-thumb--hazard');

    const img = document.createElement('img');
    img.src = photo.thumbnailUrl || '';
    img.alt = (photo.tags || []).join(', ');
    img.loading = 'lazy';
    thumb.appendChild(img);

    const badge = document.createElement('div');
    badge.className = 'photo-badge';
    const sev = (photo.severity || '').toLowerCase();
    if (sev === 'high' || sev === 'critical') badge.classList.add('hazard');
    else if (sev === 'routine' || sev === 'info') badge.classList.add('routine');
    else badge.classList.add('incident');
    thumb.appendChild(badge);

    thumb.addEventListener('click', () => showPhotoDetail(photo));
    grid.appendChild(thumb);
  });
}

function filterPhotos(photos, filter) {
  switch (filter) {
    case 'Open hazards':  return photos.filter(p => p.status === 'Hazard - Open');
    case 'Fixed hazards': return photos.filter(p => p.status === 'Hazard - Corrected');
    case 'Inspections':   return photos.filter(p => p.status === 'Inspection');
    case 'Incidents':     return photos.filter(p => p.status === 'Incident');
    case 'This week': {
      const cutoff = Date.now() - 7 * 86400000;
      return photos.filter(p => new Date(p.capturedAt).getTime() > cutoff);
    }
    default: return photos;
  }
}

function filterDossier(filter) {
  currentDossierFilter = filter;
  if (state.currentSite) {
    renderDossier(state.currentSite);
  } else {
    // No site — update the empty-state copy so the chip click isn't silent
    const isFiltered = filter !== 'All';
    document.getElementById('capture-empty-heading').textContent =
      isFiltered ? C.emptyFilter.heading : C.emptyCapture.headline;
    document.getElementById('capture-empty-sub').textContent =
      isFiltered ? C.emptyFilter.sub : C.emptyCapture.sub;
  }
}

function showPhotoDetail(photo) {
  // Image
  const img = document.getElementById('photo-detail-img');
  const placeholder = document.getElementById('photo-detail-placeholder');
  if (photo.thumbnailUrl || photo.imageUrl) {
    img.src = photo.thumbnailUrl || photo.imageUrl;
    img.hidden = false;
    placeholder.hidden = true;
  } else {
    img.src = '';
    img.hidden = true;
    placeholder.hidden = false;
  }

  // Caption
  document.getElementById('photo-detail-caption').textContent = photo.caption || '';

  // Status + Severity chips
  const chipsEl = document.getElementById('photo-detail-chips');
  chipsEl.innerHTML = '';
  if (photo.status) {
    const s = document.createElement('span');
    s.className = 'detail-chip detail-chip--status';
    const slug = photo.status.toLowerCase().replace(/[^a-z]+/g, '-');
    s.classList.add(`detail-chip--${slug}`);
    s.textContent = photo.status;
    chipsEl.appendChild(s);
  }
  if (photo.severity) {
    const s = document.createElement('span');
    s.className = 'detail-chip detail-chip--sev';
    s.classList.add(`detail-chip--sev-${photo.severity.toLowerCase()}`);
    s.textContent = photo.severity;
    chipsEl.appendChild(s);
  }
  (photo.tags || []).forEach(tag => {
    const s = document.createElement('span');
    s.className = 'detail-chip detail-chip--tag';
    s.textContent = tag;
    chipsEl.appendChild(s);
  });

  // Meta rows
  const ohsa = typeof photo.ohsaRefs === 'string' ? photo.ohsaRefs : (photo.ohsaRefs || []).join(' · ');
  document.getElementById('photo-detail-ohsa').textContent = ohsa;
  document.getElementById('photo-meta-ohsa-wrap').hidden = !ohsa;
  document.getElementById('photo-detail-date').textContent = photo.capturedAt ? formatDate(photo.capturedAt) : '';
  document.getElementById('photo-detail-hash').textContent = photo.hash ? photo.hash.slice(0, 16) + '…' : '';

  // GPS row
  const gpsWrap = document.getElementById('photo-meta-gps-wrap');
  if (gpsWrap) {
    if (photo.geoLat && photo.geoLng) {
      document.getElementById('photo-detail-gps').textContent =
        `${Number(photo.geoLat).toFixed(5)}, ${Number(photo.geoLng).toFixed(5)}`;
      gpsWrap.hidden = false;
    } else { gpsWrap.hidden = true; }
  }

  // Captured by
  const byWrap = document.getElementById('photo-meta-by-wrap');
  if (byWrap) {
    if (photo.capturedByName) {
      document.getElementById('photo-detail-by').textContent = photo.capturedByName;
      byWrap.hidden = false;
    } else { byWrap.hidden = true; }
  }

  // Notes
  const notesWrap = document.getElementById('photo-meta-notes-wrap');
  if (notesWrap) {
    if (photo.notes) {
      document.getElementById('photo-detail-notes').textContent = photo.notes;
      notesWrap.hidden = false;
    } else { notesWrap.hidden = true; }
  }

  // Transcription
  const transcriptWrap = document.getElementById('photo-detail-transcript-wrap');
  if (transcriptWrap) {
    if (photo.transcription) {
      document.getElementById('photo-detail-transcript-text').textContent = photo.transcription;
      transcriptWrap.hidden = false;
    } else { transcriptWrap.hidden = true; }
  }

  // Audio player
  const audioWrap = document.getElementById('photo-detail-audio-wrap');
  if (audioWrap) {
    if (photo.voiceKey) {
      const audioUrl = getPhotoAudioUrl(photo.id);
      const audioEl = document.getElementById('photo-detail-audio');
      audioEl.src = audioUrl;
      const hdr = { 'X-OCOS-License': state.licenseKey };
      // Can't set custom headers on <audio src>, so use blob URL approach
      fetch(audioUrl, { headers: hdr })
        .then(r => r.blob())
        .then(b => { audioEl.src = URL.createObjectURL(b); })
        .catch(() => {});
      audioWrap.hidden = false;
    } else { audioWrap.hidden = true; }
  }

  // Before/After
  const pairWrap = document.getElementById('photo-detail-pair-wrap');
  if (pairWrap) {
    if (photo.pairBeforeId || photo.pairAfterId) {
      pairWrap.hidden = false;
      const pairLabel = document.getElementById('photo-detail-pair-label');
      if (pairLabel) pairLabel.textContent = photo.pairBeforeId ? 'Paired with Before photo' : 'Paired with After photo';
    } else { pairWrap.hidden = true; }
  }

  showScreen('photo-detail');
}

document.getElementById('site-switch-btn').addEventListener('click', () => { showScreen('site-list'); loadSiteList(); });

async function loadSiteList() {
  const container = document.getElementById('site-list-items');
  container.innerHTML = '';
  if (state.currentSite) {
    const btn = document.createElement('button');
    btn.className = 'option-row option-row--active';
    btn.dataset.siteId = state.currentSite.id;
    btn.textContent = state.currentSite.name;
    btn.addEventListener('click', async () => {
      await setSetting('activeSiteId', state.currentSite.id);
      goBack();
    });
    container.appendChild(btn);
  } else {
    const p = document.createElement('p');
    p.className = 'section-sub';
    p.textContent = 'No sites yet. Create one below.';
    container.appendChild(p);
  }
}

// ── CAPTURE ────────────────────────────────────────────────────────────────

document.getElementById('capture-btn').addEventListener('click', async () => {
  if (!state.licenseKey) { showScreen('license-entry'); return; }
  if (!state.currentSite) { showToast('Select a site first.'); return; }
  await startCapture('live');
});

document.getElementById('library-btn').addEventListener('click', async () => {
  if (!state.licenseKey) { showScreen('license-entry'); return; }
  if (!state.currentSite) { showToast('Select a site first.'); return; }
  await startCapture('library');
});

async function startCapture(source = 'live') {
  const result = source === 'library' ? await openLibrary() : await openCamera();
  if (!result.photoBlob) return;

  const photoId = 'photo-' + Date.now();
  state.captureState = {
    photoId,
    photoBlob:     result.photoBlob,
    photoUrl:      result.photoUrl,
    exif:          result.exif,
    captureSource: result.captureSource || 'Live',
    tags:          [],
    severity:      null,
    status:        null,
    voiceNote:     null,
    pairedWithId:  null,
  };

  showAnnotateScreen();
}

// ── PHOTO ANNOTATE SCREEN ──────────────────────────────────────────────────

let annVoiceActive = false;
let annVoiceTimerInterval = null;
let annVoiceTimerSeconds = 0;
let annVoicePaused = false;
let annVoiceBlob = null;
let annVoiceAudioEl = null;

async function showAnnotateScreen() {
  const cs = state.captureState;
  document.getElementById('ann-photo-img').src = cs.photoUrl;
  document.getElementById('ann-playback-row').hidden = true;
  document.getElementById('ann-transcript').hidden = true;
  document.getElementById('ann-notes').value = '';
  document.getElementById('ann-rec-bar').hidden = true;
  document.getElementById('ann-rec-controls').hidden = true;
  document.getElementById('ann-mic-btn').hidden = false;
  document.getElementById('ann-pause-btn').textContent = 'Pause';
  document.getElementById('ann-timer').textContent = '0:00';
  document.getElementById('ann-ba-section').hidden = true;
  document.getElementById('ann-ba-paired').hidden = true;
  if (annVoiceAudioEl) { annVoiceAudioEl.pause(); annVoiceAudioEl = null; }
  annVoiceBlob = null;

  await renderAnnTagGrid();
  renderAnnStatusChips();
  renderAnnSevChips(cs.severity || getSeverityDefault(cs.tags || []));
  showScreen('photo-annotate');
}

async function renderAnnTagGrid() {
  const grid = document.getElementById('ann-tag-grid');
  grid.innerHTML = '';
  const taxonomy = await loadTaxonomy();
  const selected = new Set(state.captureState?.tags || []);
  taxonomy.categories.forEach(cat => {
    const chip = document.createElement('button');
    chip.className = 'tag-chip' + (selected.has(cat.id) ? ' tag-chip--selected' : '');
    chip.textContent = cat.label;
    chip.dataset.catId = cat.id;
    chip.style.setProperty('--cat-color', cat.color);
    chip.addEventListener('click', () => {
      chip.classList.toggle('tag-chip--selected');
      const tags = [...grid.querySelectorAll('.tag-chip--selected')].map(c => c.dataset.catId);
      if (state.captureState) state.captureState.tags = tags;
      const autoSev = getSeverityDefault(tags);
      const autoStatus = getAutoStatus(tags);
      renderAnnSevChips(autoSev, true);
      if (autoStatus && !state.captureState.status) selectAnnStatus(autoStatus);
    });
    grid.appendChild(chip);
  });
}

function renderAnnStatusChips() {
  const container = document.getElementById('ann-status-chips');
  container.innerHTML = '';
  C.status.options.forEach(opt => {
    const chip = document.createElement('button');
    chip.className = 'ann-chip';
    chip.textContent = opt.label;
    chip.dataset.value = opt.value;
    chip.addEventListener('click', () => selectAnnStatus(opt.value, chip));
    container.appendChild(chip);
  });
}

function selectAnnStatus(value, chipEl) {
  const container = document.getElementById('ann-status-chips');
  container.querySelectorAll('.ann-chip').forEach(c => c.classList.remove('ann-chip--active'));
  const target = chipEl || [...container.querySelectorAll('.ann-chip')].find(c => c.dataset.value === value);
  if (target) target.classList.add('ann-chip--active');
  if (state.captureState) state.captureState.status = value;
  document.getElementById('ann-ba-section').hidden = value !== 'Hazard - Corrected';
}

function renderAnnSevChips(activeValue, autoSelect = false) {
  const container = document.getElementById('ann-sev-chips');
  container.innerHTML = '';
  C.severity.options.forEach(sev => {
    const chip = document.createElement('button');
    chip.className = `ann-chip ann-chip--sev-${sev.toLowerCase()}`;
    chip.textContent = sev;
    chip.dataset.sev = sev.toLowerCase();
    chip.addEventListener('click', () => {
      container.querySelectorAll('.ann-chip').forEach(c => c.classList.remove('ann-chip--active'));
      chip.classList.add('ann-chip--active');
      if (state.captureState) state.captureState.severity = sev;
    });
    container.appendChild(chip);
  });
  if (activeValue) {
    const match = [...container.querySelectorAll('.ann-chip')]
      .find(c => c.textContent.toLowerCase() === activeValue.toLowerCase());
    if (match) {
      match.classList.add('ann-chip--active');
      if (autoSelect && state.captureState) state.captureState.severity = activeValue;
    }
  }
}

// Annotate voice recording
function annVoiceTimerTick() {
  if (!annVoicePaused) {
    annVoiceTimerSeconds++;
    const el = document.getElementById('ann-timer');
    el.textContent = fmtDuration(annVoiceTimerSeconds);
    const rem = VOICE_MAX_SECONDS - annVoiceTimerSeconds;
    if (rem <= 5)       el.className = 'voice-timer voice-timer--critical';
    else if (rem <= 15) el.className = 'voice-timer voice-timer--warn';
    else                el.className = 'voice-timer';
  }
}

function setAnnRecordingUI(active) {
  document.getElementById('ann-mic-btn').hidden    = active;
  document.getElementById('ann-rec-bar').hidden    = !active;
  document.getElementById('ann-rec-controls').hidden = !active;
}

document.getElementById('ann-mic-btn').addEventListener('click', async () => {
  if (annVoiceActive) return;
  annVoiceActive = true;
  annVoicePaused = false;
  annVoiceTimerSeconds = 0;
  document.getElementById('ann-timer').textContent = '0:00';
  if (annVoiceAudioEl) { annVoiceAudioEl.pause(); annVoiceAudioEl = null; }
  setAnnRecordingUI(true);
  document.getElementById('ann-playback-row').hidden = true;
  document.getElementById('ann-transcript').hidden = true;
  annVoiceTimerInterval = setInterval(annVoiceTimerTick, 1000);

  try {
    const blob = await recordVoice(VOICE_MAX_SECONDS);
    clearInterval(annVoiceTimerInterval);
    annVoiceBlob = blob;
    setAnnRecordingUI(false);
    if (annVoiceTimerSeconds >= VOICE_MAX_SECONDS) showToast(`Recording stopped — ${fmtDuration(VOICE_MAX_SECONDS)} limit reached.`);

    annVoiceAudioEl = new Audio(URL.createObjectURL(blob));
    annVoiceAudioEl.addEventListener('ended', () => {
      document.getElementById('ann-play-btn').textContent = '▶';
    });
    document.getElementById('ann-dur').textContent = fmtDuration(annVoiceTimerSeconds);
    document.getElementById('ann-play-btn').textContent = '▶';
    document.getElementById('ann-playback-row').hidden = false;

    const transcriptEl = document.getElementById('ann-transcript');
    transcriptEl.textContent = 'Transcribing…';
    transcriptEl.hidden = false;

    transcribeVoice(blob, state.captureState?.photoId).then(text => {
      transcriptEl.textContent = text;
      const notes = document.getElementById('ann-notes');
      notes.value = notes.value ? notes.value + '\n' + text : text;
      if (state.captureState) state.captureState.voiceNote = notes.value;
    }).catch(() => { transcriptEl.textContent = 'Transcription unavailable.'; });

  } catch (_) {
    clearInterval(annVoiceTimerInterval);
    setAnnRecordingUI(false);
    showToast('Microphone access denied or recording failed.');
  } finally {
    annVoiceActive = false;
    annVoicePaused = false;
  }
});

document.getElementById('ann-stop-btn').addEventListener('click', () => stopRecording());

document.getElementById('ann-pause-btn').addEventListener('click', () => {
  const btn = document.getElementById('ann-pause-btn');
  const dot = document.querySelector('#ann-rec-bar .voice-rec-dot');
  if (annVoicePaused) {
    resumeRecording(); annVoicePaused = false;
    btn.textContent = 'Pause';
    if (dot) dot.style.animationPlayState = 'running';
  } else {
    pauseRecording(); annVoicePaused = true;
    btn.textContent = 'Resume';
    if (dot) dot.style.animationPlayState = 'paused';
  }
});

document.getElementById('ann-play-btn').addEventListener('click', () => {
  if (!annVoiceAudioEl) return;
  const btn = document.getElementById('ann-play-btn');
  if (annVoiceAudioEl.paused) { annVoiceAudioEl.play(); btn.textContent = '⏸'; }
  else { annVoiceAudioEl.pause(); btn.textContent = '▶'; }
});

document.getElementById('ann-rerecord-btn').addEventListener('click', () => {
  if (annVoiceAudioEl) { annVoiceAudioEl.pause(); annVoiceAudioEl = null; }
  annVoiceBlob = null;
  document.getElementById('ann-playback-row').hidden = true;
  document.getElementById('ann-transcript').hidden = true;
  document.getElementById('ann-mic-btn').hidden = false;
});

document.getElementById('ann-notes').addEventListener('input', () => {
  if (state.captureState) state.captureState.voiceNote = document.getElementById('ann-notes').value.trim();
});

document.getElementById('ann-back-btn').addEventListener('click', () => {
  if (annVoiceAudioEl) { annVoiceAudioEl.pause(); annVoiceAudioEl = null; }
  stopRecording();
  resetCaptureState();
  showScreen('capture');
});

document.getElementById('ann-file-btn').addEventListener('click', filePhoto);

document.getElementById('ann-ba-btn').addEventListener('click', () => {
  showToast('File this photo first, then capture the Before photo.');
});

// ── TAG PICKER ─────────────────────────────────────────────────────────────

async function renderTagGrid() {
  const grid = document.getElementById('tag-grid');
  grid.innerHTML = '';
  const taxonomy = await loadTaxonomy();
  taxonomy.categories.forEach(cat => {
    const chip = document.createElement('button');
    chip.className = 'tag-chip';
    chip.textContent = cat.label;
    chip.dataset.catId = cat.id;
    chip.style.setProperty('--cat-color', cat.color);
    chip.addEventListener('click', () => {
      chip.classList.toggle('tag-chip--selected');
      const selected = [...grid.querySelectorAll('.tag-chip--selected')].map(c => c.dataset.catId);
      if (state.captureState) state.captureState.tags = selected;
      document.getElementById('tag-picker-done-btn').disabled = selected.length === 0;
    });
    grid.appendChild(chip);
  });
}

document.getElementById('tag-picker-done-btn').addEventListener('click', () => {
  const tags = state.captureState?.tags || [];
  const defaultSev = getSeverityDefault(tags);
  if (state.captureState) state.captureState.severity = defaultSev;

  // Pre-select default severity
  document.querySelectorAll('.sev-btn').forEach(b => {
    b.classList.toggle('sev-btn--active', b.dataset.sev === defaultSev.toLowerCase());
  });
  document.getElementById('severity-done-btn').disabled = false;
  showScreen('severity');
});

// ── SEVERITY ───────────────────────────────────────────────────────────────

document.getElementById('severity-done-btn').addEventListener('click', () => showScreen('status'));

// ── STATUS ─────────────────────────────────────────────────────────────────

function onStatusSelected(val) {
  if (state.captureState) state.captureState.status = val;
  document.getElementById('status-done-btn').disabled = false;
}

document.getElementById('status-done-btn').addEventListener('click', () => {
  const status = state.captureState?.status;
  if (status === 'Hazard - Corrected') showScreen('before-after');
  else { showScreen('voice'); showVoicePhotoContext(); }
});

// ── VOICE ──────────────────────────────────────────────────────────────────

let voiceActive = false;
let voiceTimerInterval = null;
let voiceTimerSeconds = 0;
let voicePaused = false;
let voiceBlob = null;
let voiceAudioEl = null;

function fmtDuration(s) {
  return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
}

function voiceTimerTick() {
  if (!voicePaused) {
    voiceTimerSeconds++;
    const el = document.getElementById('voice-timer');
    el.textContent = fmtDuration(voiceTimerSeconds);
    const remaining = VOICE_MAX_SECONDS - voiceTimerSeconds;
    if (remaining <= 5)       el.className = 'voice-timer voice-timer--critical';
    else if (remaining <= 15) el.className = 'voice-timer voice-timer--warn';
    else                      el.className = 'voice-timer';
  }
}

function setVoiceRecordingUI(active) {
  document.getElementById('voice-record-btn').hidden    = active;
  document.getElementById('voice-recording-bar').hidden = !active;
  document.getElementById('voice-controls').hidden      = !active;
}

function setVoiceReviewUI(show) {
  document.getElementById('voice-review').hidden    = !show;
  document.getElementById('voice-skip-btn').hidden  = show;
}

function showVoicePhotoContext() {
  const cs = state.captureState;
  const ctx = document.getElementById('voice-context');
  if (!cs?.photoUrl) { ctx.hidden = true; return; }
  document.getElementById('voice-thumb').src = cs.photoUrl;
  const tagsEl = document.getElementById('voice-thumb-tags');
  tagsEl.innerHTML = '';
  (cs.tags || []).slice(0, 6).forEach(tag => {
    const chip = document.createElement('span');
    chip.className = 'chip chip--sm';
    chip.textContent = tag.replace(/-/g, '\u2011'); // non-breaking hyphen
    tagsEl.appendChild(chip);
  });
  ctx.hidden = false;
}

async function startVoiceFlow() {
  if (voiceActive) return;
  voiceActive = true;
  voicePaused = false;
  voiceTimerSeconds = 0;
  document.getElementById('voice-timer').textContent = '0:00';
  if (voiceAudioEl) { voiceAudioEl.pause(); voiceAudioEl = null; }

  setText('voice-heading', C.voiceRecording.heading);
  setText('voice-sub',     C.voiceRecording.sub);
  setVoiceRecordingUI(true);
  setVoiceReviewUI(false);
  voiceTimerInterval = setInterval(voiceTimerTick, 1000);

  try {
    const blob = await recordVoice(VOICE_MAX_SECONDS);
    if (voiceTimerSeconds >= VOICE_MAX_SECONDS) showToast(`Recording stopped — ${fmtDuration(VOICE_MAX_SECONDS)} limit reached.`);
    clearInterval(voiceTimerInterval);
    voiceBlob = blob;
    setVoiceRecordingUI(false);

    // Set up audio playback
    const blobURL = URL.createObjectURL(blob);
    voiceAudioEl = new Audio(blobURL);
    voiceAudioEl.addEventListener('ended', () => {
      document.getElementById('voice-play-btn').textContent = '▶';
    });
    document.getElementById('voice-playback-dur').textContent = fmtDuration(voiceTimerSeconds);
    document.getElementById('voice-play-btn').textContent = '▶';

    // Show review panel immediately — transcription fills in async
    setText('voice-heading', C.voiceTranscribing.heading);
    setText('voice-sub',     C.voiceTranscribing.sub);
    document.getElementById('voice-transcript-preview').textContent = 'Transcribing…';
    document.getElementById('voice-notes-area').value = '';
    setText('voice-confirm-btn', C.voiceDone.btnConfirm);
    setVoiceReviewUI(true);

    transcribeVoice(blob, state.captureState?.photoId).then(text => {
      document.getElementById('voice-transcript-preview').textContent = text;
      document.getElementById('voice-notes-area').value = text;
      if (state.captureState) state.captureState.voiceNote = text;
      setText('voice-heading', C.voiceDone.heading);
      setText('voice-sub',     '');
    }).catch(() => {
      document.getElementById('voice-transcript-preview').textContent = 'Transcription unavailable.';
    });

  } catch (_) {
    clearInterval(voiceTimerInterval);
    setVoiceRecordingUI(false);
    setText('voice-heading', C.voiceIdle.heading);
    setText('voice-sub',     C.voiceIdle.sub);
    showToast('Microphone access denied or recording failed.');
  } finally {
    voiceActive = false;
    voicePaused = false;
  }
}

document.getElementById('voice-record-btn').addEventListener('click', startVoiceFlow);

document.getElementById('voice-stop-btn').addEventListener('click', () => stopRecording());

document.getElementById('voice-pause-btn').addEventListener('click', () => {
  const btn = document.getElementById('voice-pause-btn');
  const dot = document.querySelector('.voice-rec-dot');
  if (voicePaused) {
    resumeRecording();
    voicePaused = false;
    btn.textContent = 'Pause';
    if (dot) dot.style.animationPlayState = 'running';
  } else {
    pauseRecording();
    voicePaused = true;
    btn.textContent = 'Resume';
    if (dot) dot.style.animationPlayState = 'paused';
  }
});

document.getElementById('voice-play-btn').addEventListener('click', () => {
  if (!voiceAudioEl) return;
  const btn = document.getElementById('voice-play-btn');
  if (voiceAudioEl.paused) {
    voiceAudioEl.play();
    btn.textContent = '⏸';
  } else {
    voiceAudioEl.pause();
    btn.textContent = '▶';
  }
});

document.getElementById('voice-rerecord-btn').addEventListener('click', () => {
  if (voiceAudioEl) { voiceAudioEl.pause(); voiceAudioEl = null; }
  voiceBlob = null;
  setVoiceReviewUI(false);
  setText('voice-heading', C.voiceIdle.heading);
  setText('voice-sub',     C.voiceIdle.sub);
});

document.getElementById('voice-confirm-btn').addEventListener('click', () => {
  const notes = document.getElementById('voice-notes-area').value.trim();
  if (state.captureState) state.captureState.voiceNote = notes;
  if (voiceAudioEl) { voiceAudioEl.pause(); voiceAudioEl = null; }
  setVoiceReviewUI(false);
  setText('voice-heading', C.voiceIdle.heading);
  setText('voice-sub',     C.voiceIdle.sub);
  filePhoto();
});

document.getElementById('voice-skip-btn').addEventListener('click', filePhoto);

// ── BEFORE / AFTER ─────────────────────────────────────────────────────────

document.getElementById('ba-pair-btn').addEventListener('click', () => {
  showToast('Select the original "before" photo from the grid.', 4000);
  showScreen('capture', false);
  screenStack = ['capture'];
  filterDossier('Open hazards');
});

document.getElementById('ba-skip-btn').addEventListener('click', () => { showScreen('voice'); showVoicePhotoContext(); });

// ── FILE PHOTO ─────────────────────────────────────────────────────────────

async function filePhoto() {
  const cs = state.captureState;
  if (!cs) return;

  document.getElementById('filing-overlay').hidden = false;

  // Include transcription from annotate screen
  const rawTranscript = document.getElementById('ann-transcript')?.textContent || '';
  const transcription = (rawTranscript && rawTranscript !== 'Transcribing…' && rawTranscript !== 'Transcription unavailable.')
    ? rawTranscript : '';

  const formData = new FormData();
  formData.append('photo', cs.photoBlob, `${cs.photoId}.jpg`);
  formData.append('metadata', JSON.stringify({
    photoId:       cs.photoId,
    siteId:        state.currentSite?.id,
    tags:          cs.tags,
    severity:      cs.severity,
    status:        cs.status,
    voiceNote:     cs.voiceNote,
    pairedWithId:  cs.pairedWithId,
    capturedAt:    cs.exif?.capturedAt || new Date().toISOString(),
    gps:           cs.exif?.gps || null,
    captureSource: cs.captureSource || 'Live',
    deviceInfo:    navigator.userAgent,
    transcription,
    capturedByName: '',
  }));

  // Send voice blob if available (annotate screen or voice screen)
  const activeVoiceBlob = annVoiceBlob || voiceBlob;
  if (activeVoiceBlob) {
    formData.append('voice', activeVoiceBlob, `${cs.photoId || 'voice'}.mp4`);
  }

  try {
    const res = await uploadPhoto(formData);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      document.getElementById('filing-overlay').hidden = true;
      if (res.status === 402)      { showError('licenseExpired');  return; }
      if (res.status === 403)      { showError('noFieldAccess');   return; }
      if (res.status === 413)      { showError('fileTooLarge');    return; }
      throw new Error(body.error || 'Upload failed');
    }
    document.getElementById('filing-overlay').hidden = true;
    showToast('Photo filed.');
    resetCaptureState();
    showScreen('capture', false);
    screenStack = ['capture'];
    loadDossier(state.currentSite?.id);
  } catch (_) {
    document.getElementById('filing-overlay').hidden = true;
    showError('offlineCaptured');
    resetCaptureState();
    showScreen('capture', false);
    screenStack = ['capture'];
    syncMgr.updateFromDB();
  }
}

function resetCaptureState() {
  state.captureState = null;
  document.getElementById('voice-record-btn').hidden    = false;
  document.getElementById('voice-recording-bar').hidden = true;
  document.getElementById('voice-controls').hidden      = true;
  document.getElementById('voice-review').hidden        = true;
  document.getElementById('voice-skip-btn').hidden      = false;
  document.getElementById('voice-pause-btn').textContent = 'Pause';
  document.getElementById('voice-timer').textContent = '0:00';
  document.getElementById('voice-context').hidden = true;
  if (voiceAudioEl) { voiceAudioEl.pause(); voiceAudioEl = null; }
  voiceBlob = null;
  setText('voice-heading', C.voiceIdle.heading);
  setText('voice-sub',     C.voiceIdle.sub);
  // Reset status options
  document.querySelectorAll('#status-list .option-row').forEach(b => b.classList.remove('option-row--active'));
  document.getElementById('status-done-btn').disabled = true;
  document.getElementById('tag-picker-done-btn').disabled = true;
}

// ── INSPECTIONS ────────────────────────────────────────────────────────────

document.getElementById('start-inspection-btn').addEventListener('click', () => showScreen('inspection-type'));

function onInspectionTypeSelected(value) {
  const type = C.inspectionTypes.find(t => t.value === value);
  state.currentInspection = { type: value, label: type?.label || value, items: [], workers: [] };
  loadChecklist(value);
}

async function loadChecklist(inspectionType) {
  showScreen('inspection-checklist');
  setText('checklist-title', state.currentInspection.label);
  const container = document.getElementById('checklist-items');
  container.innerHTML = '<p class="section-sub" style="padding:20px">Loading checklist…</p>';

  try {
    const items = await getChecklistForType(inspectionType);
    state.currentInspection.items = items.map(item => ({ ...item, checked: false, flagged: false }));
    renderChecklist(container, state.currentInspection.items);
  } catch (_) {
    container.innerHTML = '<p class="section-sub" style="padding:20px">Couldn\'t load checklist. Continue manually.</p>';
  }
}

// Per-item recording state for checklist notes
let clActiveIdx = null;
let clTimerInterval = null;
let clTimerSeconds = 0;
const clAudioEls = {};

function buildClNotePanel(idx, item) {
  const panel = document.createElement('div');
  panel.className = 'cl-item-note';
  panel.hidden = true;

  // Regulatory ref chip(s)
  if (item.regulatory_ref) {
    const refRow = document.createElement('div');
    refRow.className = 'cl-note-refs';
    item.regulatory_ref.split(',').map(r => r.trim()).filter(Boolean).forEach(ref => {
      const chip = document.createElement('span');
      chip.className = 'chip chip--ref';
      chip.textContent = ref;
      refRow.appendChild(chip);
    });
    panel.appendChild(refRow);
  }

  // Recorder row
  const recRow = document.createElement('div');
  recRow.className = 'cl-note-recorder';

  const micBtn = document.createElement('button');
  micBtn.className = 'cl-mic-btn';
  micBtn.title = 'Record voice note';
  micBtn.textContent = '🎙';

  const timerSpan = document.createElement('span');
  timerSpan.className = 'cl-note-timer';
  timerSpan.textContent = '0:00';
  timerSpan.hidden = true;

  const stopBtn = document.createElement('button');
  stopBtn.className = 'btn btn-danger btn-sm';
  stopBtn.textContent = '⏹ Stop';
  stopBtn.hidden = true;

  const playBtn = document.createElement('button');
  playBtn.className = 'cl-note-play';
  playBtn.textContent = '▶ Play';
  playBtn.hidden = true;

  micBtn.addEventListener('click', () => {
    if (clActiveIdx === idx) return;
    if (clActiveIdx !== null) { showToast('Stop the current recording first.'); return; }
    clActiveIdx = idx;
    clTimerSeconds = 0;
    timerSpan.textContent = '0:00';
    timerSpan.hidden = false;
    stopBtn.hidden = false;
    micBtn.classList.add('recording');
    micBtn.textContent = '⏺';
    clTimerInterval = setInterval(() => {
      clTimerSeconds++;
      timerSpan.textContent = fmtDuration(clTimerSeconds);
      const rem = VOICE_CL_MAX_SECONDS - clTimerSeconds;
      timerSpan.style.color = rem <= 5 ? 'var(--red)' : rem <= 15 ? 'var(--amber)' : '';
    }, 1000);

    recordVoice(VOICE_CL_MAX_SECONDS).then(blob => {
      if (clTimerSeconds >= VOICE_CL_MAX_SECONDS) showToast(`Recording stopped — ${fmtDuration(VOICE_CL_MAX_SECONDS)} limit reached.`);
      clearInterval(clTimerInterval);
      clActiveIdx = null;
      item.voiceBlob = blob;
      micBtn.classList.remove('recording');
      micBtn.textContent = '🎙';
      timerSpan.hidden = true;
      stopBtn.hidden = true;
      playBtn.hidden = false;
      clAudioEls[idx] = new Audio(URL.createObjectURL(blob));
      clAudioEls[idx].addEventListener('ended', () => { playBtn.textContent = '▶ Play'; });
      transcribeVoice(blob, null).then(text => {
        textarea.value = textarea.value ? textarea.value + '\n' + text : text;
        item.voiceNote = textarea.value;
      }).catch(() => {});
    }).catch(() => {
      clearInterval(clTimerInterval);
      clActiveIdx = null;
      micBtn.classList.remove('recording');
      micBtn.textContent = '🎙';
      timerSpan.hidden = true;
      stopBtn.hidden = true;
    });
  });

  stopBtn.addEventListener('click', () => stopRecording());

  playBtn.addEventListener('click', () => {
    const audio = clAudioEls[idx];
    if (!audio) return;
    if (audio.paused) { audio.play(); playBtn.textContent = '⏸ Pause'; }
    else { audio.pause(); playBtn.textContent = '▶ Play'; }
  });

  recRow.appendChild(micBtn);
  recRow.appendChild(timerSpan);
  recRow.appendChild(stopBtn);
  recRow.appendChild(playBtn);
  panel.appendChild(recRow);

  const textarea = document.createElement('textarea');
  textarea.className = 'form-input cl-note-text';
  textarea.rows = 2;
  textarea.placeholder = item.flagged ? 'Describe the issue…' : 'Add compliance note…';
  textarea.addEventListener('input', () => { item.voiceNote = textarea.value; });
  panel.appendChild(textarea);

  return { panel, textarea };
}

function renderChecklist(container, items) {
  container.innerHTML = '';
  items.forEach((item, idx) => {
    const wrap = document.createElement('div');
    wrap.className = 'checklist-wrap';

    const row = document.createElement('div');
    row.className = 'checklist-item';
    row.dataset.idx = idx;

    const textDiv = document.createElement('div');
    textDiv.className = 'cl-text';
    textDiv.textContent = item.prompt;

    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'cl-actions';

    const { panel: notePanel } = buildClNotePanel(idx, item);

    const checkBtn = document.createElement('button');
    checkBtn.className = 'cl-check';
    checkBtn.title = 'Got it';
    checkBtn.textContent = '✓';

    const flagBtn = document.createElement('button');
    flagBtn.className = 'cl-check';
    flagBtn.title = 'Flag issue';
    flagBtn.textContent = '⚠';

    checkBtn.addEventListener('click', () => {
      item.checked = !item.checked;
      item.flagged = false;
      checkBtn.classList.toggle('done', item.checked);
      flagBtn.classList.remove('flagged');
      row.classList.toggle('checklist-item--checked', item.checked);
      row.classList.remove('checklist-item--flagged');
      notePanel.hidden = !item.checked;
      notePanel.className = item.checked ? 'cl-item-note cl-item-note--done' : 'cl-item-note';
    });

    flagBtn.addEventListener('click', () => {
      item.flagged = !item.flagged;
      item.checked = false;
      flagBtn.classList.toggle('flagged', item.flagged);
      checkBtn.classList.remove('done');
      row.classList.toggle('checklist-item--flagged', item.flagged);
      row.classList.remove('checklist-item--checked');
      notePanel.hidden = !item.flagged;
      notePanel.className = item.flagged ? 'cl-item-note cl-item-note--flagged' : 'cl-item-note';
      if (item.flagged && item.requires_photo) showToast(C.checklistItem.photoHelper);
    });

    actionsDiv.appendChild(checkBtn);
    actionsDiv.appendChild(flagBtn);
    row.appendChild(textDiv);
    row.appendChild(actionsDiv);
    wrap.appendChild(row);
    wrap.appendChild(notePanel);
    container.appendChild(wrap);
  });
}

document.getElementById('checklist-done-btn').addEventListener('click', () => {
  state.pendingWorkers = [];
  document.getElementById('workers-list').innerHTML = '';
  document.getElementById('alone-inline').hidden = true;
  document.getElementById('alone-btn').hidden = false;
  document.getElementById('worker-name-input').value = '';
  document.getElementById('worker-role-input').value = '';
  showScreen('signoff-workers');
  loadRecentWorkers();
});

// ── SIGN-OFF ───────────────────────────────────────────────────────────────

async function loadRecentWorkers() {
  const wrap = document.getElementById('recent-workers-wrap');
  const chips = document.getElementById('recent-workers-chips');
  chips.innerHTML = '';
  const recent = (await getSetting('recentWorkers')) || [];
  if (!recent.length) { wrap.hidden = true; return; }
  wrap.hidden = false;
  recent.forEach(w => {
    const chip = document.createElement('button');
    chip.className = 'recent-worker-chip';
    chip.textContent = w.role ? `${w.name} · ${w.role}` : w.name;
    chip.addEventListener('click', () => {
      if (state.pendingWorkers.some(p => p.name === w.name)) return;
      state.pendingWorkers.push({ name: w.name, role: w.role, signed: false, signature: null, method: null });
      renderWorkersList();
    });
    chips.appendChild(chip);
  });
}

async function saveRecentWorker(name, role) {
  const recent = (await getSetting('recentWorkers')) || [];
  const filtered = recent.filter(w => w.name.toLowerCase() !== name.toLowerCase());
  filtered.unshift({ name, role });
  await setSetting('recentWorkers', filtered.slice(0, 10));
}

document.getElementById('save-worker-btn').addEventListener('click', async () => {
  const name = document.getElementById('worker-name-input').value.trim();
  if (!name) { showToast('Enter a name.'); return; }
  const role = document.getElementById('worker-role-input').value.trim();
  state.pendingWorkers.push({ name, role, signed: false, signature: null, method: null });
  await saveRecentWorker(name, role);
  renderWorkersList();
  loadRecentWorkers();
  document.getElementById('worker-name-input').value = '';
  document.getElementById('worker-role-input').value = '';
});

document.getElementById('alone-btn').addEventListener('click', () => {
  document.getElementById('alone-btn').hidden = true;
  document.getElementById('alone-inline').hidden = false;
  document.getElementById('alone-name-input').focus();
});

document.getElementById('alone-sign-btn').addEventListener('click', async () => {
  const name = document.getElementById('alone-name-input').value.trim() || 'Supervisor';
  state.pendingWorkers = [{ name, role: 'Supervisor', signed: false, signature: null, method: null }];
  await saveRecentWorker(name, 'Supervisor');
  document.getElementById('alone-name-input').value = '';
  document.getElementById('alone-inline').hidden = true;
  document.getElementById('alone-btn').hidden = false;
  startSignoff(0);
});

function renderWorkersList() {
  const container = document.getElementById('workers-list');
  container.innerHTML = '';
  state.pendingWorkers.forEach((w, i) => {
    const row = document.createElement('div');
    row.className = 'worker-row';
    const info = document.createElement('div');
    info.innerHTML = `<div class="worker-name">${w.name}</div>${w.role ? `<div class="worker-role">${w.role}</div>` : ''}`;

    const action = document.createElement('div');
    if (w.signed) {
      action.innerHTML = '<span class="text-green text-sm">&#10003; Signed</span>';
    } else {
      const btn = document.createElement('button');
      btn.className = 'btn btn-ghost btn-xs';
      btn.textContent = 'Sign';
      btn.addEventListener('click', () => startSignoff(i));
      action.appendChild(btn);
    }
    row.appendChild(info);
    row.appendChild(action);
    container.appendChild(row);
  });

  if (state.pendingWorkers.length > 0 && state.pendingWorkers.every(w => w.signed)) {
    completeSignoffs();
  }
}

let sigCtx = null, sigDrawing = false;

function startSignoff(workerIdx) {
  state.signingWorkerIdx = workerIdx;
  const worker = workerIdx !== null ? state.pendingWorkers[workerIdx] : null;
  const name   = worker?.name || 'You';
  const date   = formatDate(new Date());
  const site   = state.currentSite?.name || 'this site';
  const type   = state.currentInspection?.label || 'inspection';
  setText('signoff-draw-sub', C.signoffDraw.sub(name, type, date, site));
  showScreen('signoff-draw');
  initSigPad();
}

function initSigPad() {
  const canvas = document.getElementById('sig-canvas');
  canvas.width  = canvas.offsetWidth  || 340;
  canvas.height = canvas.offsetHeight || 200;
  sigCtx = canvas.getContext('2d');
  sigCtx.clearRect(0, 0, canvas.width, canvas.height);
  sigCtx.strokeStyle = '#5EE830';
  sigCtx.lineWidth   = 2;
  sigCtx.lineCap     = 'round';
  sigCtx.lineJoin    = 'round';
  document.getElementById('sig-save-btn').disabled = true;

  canvas.addEventListener('pointerdown', e => { sigDrawing = true; sigCtx.beginPath(); sigCtx.moveTo(e.offsetX, e.offsetY); });
  canvas.addEventListener('pointermove', e => { if (!sigDrawing) return; sigCtx.lineTo(e.offsetX, e.offsetY); sigCtx.stroke(); document.getElementById('sig-save-btn').disabled = false; });
  canvas.addEventListener('pointerup',   () => { sigDrawing = false; });
  canvas.addEventListener('pointerleave',() => { sigDrawing = false; });
}

document.getElementById('sig-clear-btn').addEventListener('click', () => {
  const canvas = document.getElementById('sig-canvas');
  sigCtx?.clearRect(0, 0, canvas.width, canvas.height);
  document.getElementById('sig-save-btn').disabled = true;
});

document.getElementById('sig-save-btn').addEventListener('click', async () => {
  const canvas = document.getElementById('sig-canvas');
  const blob   = await new Promise(res => canvas.toBlob(res, 'image/png'));
  await saveSignoff(blob, 'signature');
});

document.getElementById('sig-pin-btn').addEventListener('click', () => {
  showScreen('signoff-pin');
  renderPinPad();
});

// PIN pad
function renderPinPad() {
  state.pinBuffer = '';
  refreshPinDots();
  const keypad = document.getElementById('pin-keypad');
  keypad.innerHTML = '';
  [1,2,3,4,5,6,7,8,9,'','0','⌫'].forEach(key => {
    const btn = document.createElement('button');
    btn.className = 'pin-key';
    btn.textContent = key;
    if (key === '') { btn.disabled = true; btn.style.visibility = 'hidden'; }
    btn.addEventListener('click', () => {
      if (key === '⌫')       state.pinBuffer = state.pinBuffer.slice(0,-1);
      else if (key !== '' && state.pinBuffer.length < 4) state.pinBuffer += key;
      refreshPinDots();
      if (state.pinBuffer.length === 4) saveSignoff(state.pinBuffer, 'pin');
    });
    keypad.appendChild(btn);
  });
}

function refreshPinDots() {
  const dots = document.getElementById('pin-dots');
  dots.innerHTML = '';
  for (let i = 0; i < 4; i++) {
    const d = document.createElement('div');
    d.className = 'pin-dot' + (i < state.pinBuffer.length ? ' pin-dot--filled' : '');
    dots.appendChild(d);
  }
}

async function saveSignoff(signatureData, method) {
  const idx = state.signingWorkerIdx;
  if (idx !== null && idx !== undefined) {
    state.pendingWorkers[idx].signed    = true;
    state.pendingWorkers[idx].signature = signatureData;
    state.pendingWorkers[idx].method    = method;
    showScreen('signoff-workers');
    renderWorkersList();
  } else {
    completeSignoffs();
  }
}

async function completeSignoffs() {
  state.pendingWorkers = [];
  showScreen('inspection-complete');
}

// ── INSPECTION COMPLETE ────────────────────────────────────────────────────

document.getElementById('insp-generate-report-btn').addEventListener('click', doGenerateReport);

document.getElementById('insp-draft-btn').addEventListener('click', () => {
  showToast('Saved to drafts.');
  showScreen('inspections', false);
  screenStack = ['capture', 'inspections'];
});

// ── SITE WORKERS (Settings) ────────────────────────────────────────────────

function loadSiteWorkers() {
  const container = document.getElementById('site-workers-list');
  const workers = state.pendingWorkers.length > 0 ? state.pendingWorkers : [];
  if (workers.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <p class="empty-state-heading">No workers added yet.</p>
        <p class="empty-state-sub">Workers you add during a toolbox talk or inspection sign-off will appear here.</p>
      </div>`;
    return;
  }
  container.innerHTML = '';
  workers.forEach(w => {
    const row = document.createElement('div');
    row.className = 'option-row';
    row.innerHTML = `<span class="option-label">${w.name}</span>${w.role ? `<span class="option-sub">${w.role}</span>` : ''}`;
    container.appendChild(row);
  });
}

document.getElementById('add-site-worker-btn').addEventListener('click', () => showToast('Add workers during a toolbox talk or inspection sign-off.'));

// ── REPORTS ────────────────────────────────────────────────────────────────

let currentReportsFilter = 'All';

async function loadReports() {
  const container = document.getElementById('reports-list');
  container.innerHTML = '';
  try {
    const data = await listReports(state.currentSite?.id);
    const reports = data.reports || [];
    if (reports.length === 0) {
      container.innerHTML = `<div class="empty-state"><p class="empty-state-heading">${C.reportList.empty.heading}</p><p class="empty-state-sub">${C.reportList.empty.sub}</p></div>`;
      return;
    }
    reports.forEach(r => {
      const card = renderReportCard(r, report => {
        state.currentReport = report;
        showScreen('report-ready');
      });
      container.appendChild(card);
    });
  } catch (_) {
    container.innerHTML = `<div class="empty-state"><p class="empty-state-heading">${C.reportList.empty.heading}</p><p class="empty-state-sub">${C.reportList.empty.sub}</p></div>`;
  }
}

function filterReports(filter) { currentReportsFilter = filter; }

async function doGenerateReport() {
  document.getElementById('report-generating-overlay').hidden = false;
  try {
    const result = await apiGenerateReport({
      siteId:       state.currentSite?.id,
      inspectionId: state.currentInspection?.id,
      reportType:   state.currentInspection?.type || 'Daily Log',
    });
    state.currentReport = result;
    document.getElementById('report-generating-overlay').hidden = true;
    showScreen('report-ready');
  } catch (_) {
    document.getElementById('report-generating-overlay').hidden = true;
    showError('aiSummaryFailed');
  }
}

document.getElementById('report-open-pdf-btn').addEventListener('click', () => {
  if (state.currentReport?.pdfUrl) window.open(state.currentReport.pdfUrl, '_blank');
  else showToast('No PDF available yet.');
});

document.getElementById('report-send-quick-btn').addEventListener('click', () => {
  state.pendingRecipients = [];
  renderRecipientsList();
  updateSendBtn();
  showScreen('report-send');
});

document.getElementById('add-recipient-btn').addEventListener('click', () => {
  document.getElementById('add-recipient-form').hidden = false;
  document.getElementById('add-recipient-form').style.display = 'flex';
});

document.getElementById('save-recipient-btn').addEventListener('click', () => {
  const email = document.getElementById('recipient-email').value.trim();
  const role  = document.getElementById('recipient-role').value;
  if (!email) { showToast('Enter an email address.'); return; }
  state.pendingRecipients.push({ email, role });
  renderRecipientsList();
  document.getElementById('recipient-email').value = '';
  document.getElementById('recipient-role').value  = '';
  document.getElementById('add-recipient-form').hidden = true;
  updateSendBtn();
});

function renderRecipientsList() {
  const container = document.getElementById('recipients-list');
  container.innerHTML = '';
  state.pendingRecipients.forEach((r, i) => {
    const row = document.createElement('div');
    row.className = 'option-row';
    row.style.pointerEvents = 'none';
    const left = document.createElement('span');
    left.textContent = `${r.email}${r.role ? ' · ' + r.role : ''}`;
    const rmBtn = document.createElement('button');
    rmBtn.className = 'btn btn-ghost btn-xs';
    rmBtn.textContent = 'Remove';
    rmBtn.style.pointerEvents = 'auto';
    rmBtn.addEventListener('click', () => {
      state.pendingRecipients.splice(i, 1);
      renderRecipientsList();
      updateSendBtn();
    });
    row.appendChild(left);
    row.appendChild(rmBtn);
    container.appendChild(row);
  });
}

function updateSendBtn() {
  const n = state.pendingRecipients.length;
  const btn = document.getElementById('send-report-btn');
  btn.disabled  = n === 0;
  btn.textContent = C.reportSend.btnSend(n);
}

document.getElementById('send-report-btn').addEventListener('click', async () => {
  if (!state.currentReport || state.pendingRecipients.length === 0) return;
  try {
    await apiSendReport(state.currentReport.id, state.pendingRecipients, 'email');
    state.pendingRecipients = [];
    showScreen('report-locked');
  } catch (_) {
    showToast('Send failed. Check your connection and try again.');
  }
});

document.getElementById('download-report-btn').addEventListener('click', () => {
  if (state.currentReport?.pdfUrl) window.open(state.currentReport.pdfUrl, '_blank');
});

document.getElementById('report-locked-done-btn').addEventListener('click', () => {
  showScreen('reports', false);
  screenStack = ['capture', 'reports'];
  loadReports();
});

// ── SETTINGS ───────────────────────────────────────────────────────────────

function updateSettingsPanel() {
  setText('settings-license-preview', state.licenseKey ? state.licenseKey.slice(0, 8) + '…' : 'Not set');
  setText('settings-site-name', state.currentSite?.name || 'Not set');
  setText('settings-tier-value', state.tier || '—');

  const isT3 = state.tier === 'T3';
  document.getElementById('settings-t3-label').hidden = !isT3;
  document.getElementById('settings-t3-block').hidden = !isT3;

  // Sync count
  getPendingCount().then(n => {
    setText('settings-sync-value', n > 0 ? `${n} pending` : 'All synced');
  }).catch(() => {});
}

document.getElementById('settings-license-row').addEventListener('click', () => showScreen('license-entry'));
document.getElementById('settings-site-row').addEventListener('click', () => { showScreen('site-list'); loadSiteList(); });
document.getElementById('settings-style-row').addEventListener('click', () => { showScreen('style-learning'); loadStyleSamples(); });
document.getElementById('settings-brand-row').addEventListener('click', () => showScreen('branding-setup'));
document.getElementById('settings-workers-row')?.addEventListener('click', () => { loadSiteWorkers(); showScreen('site-workers'); });
document.getElementById('settings-sync-row')?.addEventListener('click', () => {
  getPendingCount().then(n => showToast(n > 0 ? `${n} photo${n !== 1 ? 's' : ''} waiting to sync.` : 'All synced.')).catch(() => {});
});

// ── STYLE LEARNING (T3) ────────────────────────────────────────────────────

document.getElementById('style-upload-btn').addEventListener('click', () => document.getElementById('style-file-input').click());
document.getElementById('style-add-another-btn').addEventListener('click', () => document.getElementById('style-file-input').click());

document.getElementById('style-file-input').addEventListener('change', async e => {
  const file = e.target.files?.[0];
  if (!file) return;
  const ext = file.name.split('.').pop().toLowerCase();
  if (!['pdf','docx','doc','txt'].includes(ext)) { showError('styleUnsupported'); return; }
  await uploadSample(file);
  e.target.value = '';
});

document.getElementById('style-confirm-tag-btn').addEventListener('click', async () => {
  const tag = state.pendingSampleTag;
  if (!tag) { showToast('Pick a tag first.'); return; }
  document.getElementById('style-sample-ready').hidden = true;
  state.pendingSampleTag = null;
  await loadStyleSamples();
  showToast('Sample saved.');
});

// ── BRANDING SETUP (T3) ────────────────────────────────────────────────────

document.getElementById('logo-upload-area').addEventListener('click', () => document.getElementById('logo-file-input').click());

document.getElementById('logo-file-input').addEventListener('change', e => {
  const file = e.target.files?.[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  const preview = document.getElementById('logo-preview');
  preview.src = url;
  preview.hidden = false;
  document.getElementById('logo-upload-placeholder').hidden = true;
});

['primary','accent'].forEach(key => {
  const picker = document.getElementById(`brand-${key}-color`);
  const hex    = document.getElementById(`brand-${key}-hex`);
  if (!picker || !hex) return;
  picker.addEventListener('input', () => { hex.value = picker.value; });
  hex.addEventListener('input', () => { if (/^#[0-9A-Fa-f]{6}$/.test(hex.value)) picker.value = hex.value; });
});

document.getElementById('brand-save-btn').addEventListener('click', () => {
  const company = document.getElementById('brand-company-name').value.trim() || 'Your Company';
  const primary = document.getElementById('brand-primary-hex').value || '#080A07';
  const accent  = document.getElementById('brand-accent-hex').value  || '#5EE830';
  const footer  = document.getElementById('brand-footer-line').value.trim();

  document.getElementById('brand-preview-box').innerHTML = `
    <div style="background:${primary};color:#fff;padding:14px 18px">
      <div style="font-size:18px;font-weight:bold;letter-spacing:1px">${company}</div>
      <div style="font-size:12px;color:${accent};margin-top:2px">JHSC Monthly Inspection · Preview</div>
    </div>
    <div style="padding:16px;font-size:13px;color:#aaa;background:#111">
      Report content would appear here, formatted in your style.
    </div>
    ${footer ? `<div style="padding:8px 18px;font-size:12px;color:#888;background:#111">${footer}</div>` : ''}
    <div style="padding:8px 18px;font-size:10px;color:${accent};border-top:1px solid #333;background:#111">
      Generated by OCOS — Ontario Compliance Operating System · naturalalternatives.ca
    </div>`;
  showScreen('brand-preview');
});

document.getElementById('brand-confirm-btn').addEventListener('click', () => {
  showToast('Branding saved.');
  goBack(); goBack();
});
document.getElementById('brand-back-edit-btn').addEventListener('click', goBack);

// ── BACK BUTTON ────────────────────────────────────────────────────────────

document.getElementById('back-btn').addEventListener('click', goBack);

// ── UTILITIES ──────────────────────────────────────────────────────────────

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60)    return 'just now';
  if (diff < 3600)  return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  return `${Math.floor(diff / 86400)} days ago`;
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-CA', { weekday: 'short', day: 'numeric', month: 'short' });
}

// ── BOOT ───────────────────────────────────────────────────────────────────

init().catch(console.error);
