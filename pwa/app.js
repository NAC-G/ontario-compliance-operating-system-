/**
 * OCOS Field — main screen controller.
 * Imports all module files; drives screen transitions and copy population.
 */

import { C } from './modules/copy.js';
import { getSetting, setSetting, getPendingCount } from './modules/db.js';
import { uploadPhoto, getSite, createInspection, signoffInspection,
         generateReport as apiGenerateReport, lockReport, sendReport as apiSendReport,
         regenerateReport, getReportVersions, seedDemoData } from './modules/api.js';
import { requestPermissions } from './modules/permissions.js';
import { openCamera, openLibrary } from './modules/camera.js';
import { recordVoice, stopRecording, transcribeVoice } from './modules/voice.js';
import { loadTaxonomy, getSeverityDefault, getAutoStatus } from './modules/tag-picker.js';
import { getChecklistForType } from './modules/inspection.js';
import { SyncManager } from './modules/sync.js';
import { loadStyleSamples, uploadSample } from './modules/style-samples.js';
import { renderVersionRow } from './modules/reports.js';

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
  if (push) screenStack.push(id);
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
  setText('voice-edit-btn',        C.voiceDone.btnEdit);
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
    grid.innerHTML = '';
    grid.appendChild(empty);
    empty.hidden = false;
    return;
  }
  empty.hidden = true;
  grid.innerHTML = '';

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

    let holdTimer;
    thumb.addEventListener('pointerdown', () => { holdTimer = setTimeout(() => showPhotoDetail(photo), 500); });
    thumb.addEventListener('pointerup',   () => clearTimeout(holdTimer));
    thumb.addEventListener('pointerleave',() => clearTimeout(holdTimer));
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
  const ts   = photo.capturedAt ? formatDate(photo.capturedAt) : '';
  const tags  = (photo.tags || []).join(', ');
  const refs  = (photo.ohsaRefs || []).join(' · ');
  showToast([ts, tags, refs].filter(Boolean).join('\n'), 5000);
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

  document.getElementById('photo-preview-img').src = result.photoUrl;
  document.getElementById('photo-card').hidden = false;
}

document.getElementById('tag-this-photo-btn').addEventListener('click', () => {
  document.getElementById('photo-card').hidden = true;
  showScreen('tag-picker');
  renderTagGrid();
});

document.getElementById('voice-btn-card').addEventListener('pointerdown', startVoiceFlow);

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
  else showScreen('voice');
});

// ── VOICE ──────────────────────────────────────────────────────────────────

let voiceActive = false;

async function startVoiceFlow() {
  if (voiceActive) return;
  voiceActive = true;

  const recordBtn = document.getElementById('voice-record-btn');
  recordBtn.classList.add('recording');
  setText('voice-heading', C.voiceRecording.heading);
  setText('voice-sub',     C.voiceRecording.sub);

  const releaseHandler = async () => {
    recordBtn.removeEventListener('pointerup',    releaseHandler);
    recordBtn.removeEventListener('pointerleave', releaseHandler);
    stopRecording();
  };
  recordBtn.addEventListener('pointerup',    releaseHandler, { once: true });
  recordBtn.addEventListener('pointerleave', releaseHandler, { once: true });

  try {
    const blob = await recordVoice(90);
    recordBtn.classList.remove('recording');
    setText('voice-heading', C.voiceTranscribing.heading);
    setText('voice-sub',     C.voiceTranscribing.sub);

    const text = await transcribeVoice(blob, state.captureState?.photoId);
    if (state.captureState) state.captureState.voiceNote = text;

    document.getElementById('voice-transcript-text').textContent = text;
    document.getElementById('voice-transcript').hidden = false;
    setText('voice-heading', C.voiceDone.heading);
    setText('voice-sub',     '');
  } catch (_) {
    recordBtn.classList.remove('recording');
    setText('voice-heading', C.voiceIdle.heading);
    setText('voice-sub',     C.voiceIdle.sub);
    showToast('Voice note failed. Type one instead.');
  } finally {
    voiceActive = false;
  }
}

document.getElementById('voice-record-btn').addEventListener('pointerdown', startVoiceFlow);

document.getElementById('voice-confirm-btn').addEventListener('click', () => {
  document.getElementById('voice-transcript').hidden = true;
  setText('voice-heading', C.voiceIdle.heading);
  setText('voice-sub',     C.voiceIdle.sub);
  filePhoto();
});

document.getElementById('voice-edit-btn').addEventListener('click', () => {
  const area = document.getElementById('voice-edit-area');
  area.value = state.captureState?.voiceNote || '';
  area.hidden = false;
  document.getElementById('voice-save-edited-btn').hidden = false;
  document.getElementById('voice-confirm-btn').hidden = true;
  document.getElementById('voice-edit-btn').hidden = true;
});

document.getElementById('voice-save-edited-btn').addEventListener('click', () => {
  if (state.captureState) state.captureState.voiceNote = document.getElementById('voice-edit-area').value.trim();
  document.getElementById('voice-edit-area').hidden = true;
  document.getElementById('voice-save-edited-btn').hidden = true;
  document.getElementById('voice-confirm-btn').hidden = false;
  document.getElementById('voice-edit-btn').hidden = false;
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

document.getElementById('ba-skip-btn').addEventListener('click', () => showScreen('voice'));

// ── FILE PHOTO ─────────────────────────────────────────────────────────────

async function filePhoto() {
  const cs = state.captureState;
  if (!cs) return;

  document.getElementById('filing-overlay').hidden = false;

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
  }));

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
  document.getElementById('voice-transcript').hidden = true;
  document.getElementById('voice-edit-area').hidden = true;
  document.getElementById('voice-save-edited-btn').hidden = true;
  document.getElementById('voice-confirm-btn').hidden = false;
  document.getElementById('voice-edit-btn').hidden = false;
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

function renderChecklist(container, items) {
  container.innerHTML = '';
  items.forEach((item, idx) => {
    const row = document.createElement('div');
    row.className = 'checklist-item';
    row.dataset.idx = idx;

    const textDiv = document.createElement('div');
    textDiv.className = 'cl-text';
    textDiv.textContent = item.prompt;
    if (item.regulatory_ref) {
      const ref = document.createElement('div');
      ref.className = 'cl-ref';
      ref.textContent = item.regulatory_ref;
      textDiv.appendChild(ref);
    }

    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'cl-actions';

    const checkBtn = document.createElement('button');
    checkBtn.className = 'cl-check';
    checkBtn.title = 'Done';
    checkBtn.textContent = '✓';
    checkBtn.addEventListener('click', () => {
      item.checked = !item.checked;
      item.flagged = false;
      checkBtn.classList.toggle('done', item.checked);
      flagBtn.classList.remove('flagged');
      row.classList.toggle('checklist-item--checked', item.checked);
      row.classList.remove('checklist-item--flagged');
    });

    const flagBtn = document.createElement('button');
    flagBtn.className = 'cl-check';
    flagBtn.title = 'Flag issue';
    flagBtn.textContent = '⚠';
    flagBtn.addEventListener('click', () => {
      item.flagged = !item.flagged;
      item.checked = false;
      flagBtn.classList.toggle('flagged', item.flagged);
      checkBtn.classList.remove('done');
      row.classList.toggle('checklist-item--flagged', item.flagged);
      row.classList.remove('checklist-item--checked');
      if (item.flagged && item.requires_photo) showToast(C.checklistItem.photoHelper);
    });

    actionsDiv.appendChild(checkBtn);
    actionsDiv.appendChild(flagBtn);
    row.appendChild(textDiv);
    row.appendChild(actionsDiv);
    container.appendChild(row);
  });
}

document.getElementById('checklist-done-btn').addEventListener('click', () => showScreen('signoff-workers'));

// ── SIGN-OFF ───────────────────────────────────────────────────────────────

document.getElementById('add-worker-btn').addEventListener('click', () => {
  document.getElementById('add-worker-sheet').hidden = false;
});

document.getElementById('save-worker-btn').addEventListener('click', () => {
  const name = document.getElementById('worker-name-input').value.trim();
  if (!name) return;
  const role = document.getElementById('worker-role-input').value.trim();
  state.pendingWorkers.push({ name, role, signed: false, signature: null, method: null });
  renderWorkersList();
  document.getElementById('add-worker-sheet').hidden = true;
  document.getElementById('worker-name-input').value = '';
  document.getElementById('worker-role-input').value = '';
});

document.getElementById('alone-btn').addEventListener('click', () => {
  state.pendingWorkers = [];
  completeSignoffs();
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
  container.innerHTML = `
    <div class="empty-state">
      <p class="empty-state-heading">${C.reportList.empty.heading}</p>
      <p class="empty-state-sub">${C.reportList.empty.sub}</p>
    </div>`;
}

function filterReports(filter) { currentReportsFilter = filter; }

async function doGenerateReport() {
  document.getElementById('report-generating-overlay').hidden = false;
  try {
    const result = await apiGenerateReport({
      siteId:       state.currentSite?.id,
      inspectionId: state.currentInspection?.id,
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
