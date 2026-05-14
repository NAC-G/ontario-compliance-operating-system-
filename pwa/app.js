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
  activeSiteId:      null,
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

async function loadSiteList() {
  const wrap = document.getElementById('site-list-wrap');
  wrap.innerHTML = '<p>Loading…</p>';
  try {
    const sites = await listReports();   // reuse API
    if (!sites?.length) { wrap.innerHTML = '<p>No sites found.</p>'; return; }
    wrap.innerHTML = '';
    sites.forEach(s => {
      const btn = document.createElement('button');
      btn.className = 'site-chip';
      btn.textContent = s.name || s.id;
      btn.addEventListener('click', async () => {
        await setSetting('activeSiteId', s.id);
        state.currentSite = s;
        showScreen('ready');
      });
      wrap.appendChild(btn);
    });
  } catch (err) {
    wrap.innerHTML = `<p>Error loading sites.</p>`;
  }
}

async function loadDossier(siteId) {
  const empty   = document.getElementById('capture-empty');
  const grid    = document.getElementById('photo-grid');
  const counter = document.getElementById('pending-count');

  if (!siteId) { empty.hidden = false; grid.innerHTML = ''; return; }
  empty.hidden = true;

  const n = await getPendingCount(siteId);
  counter.textContent = n > 0 ? `${n} pending` : '';

  try {
    const data = await apiGenerateReport(siteId, { dryRun: true });
    renderDossier(data);
  } catch {
    grid.innerHTML = '<p style="color:var(--muted);padding:1rem">Could not load photos.</p>';
  }
}

function renderDossier(data) {
  const grid = document.getElementById('photo-grid');
  grid.innerHTML = '';
  const photos = data?.photos || data?.items || [];
  const filtered = currentDossierFilter === 'All'
    ? photos
    : photos.filter(p => (p.tags || []).includes(currentDossierFilter));

  if (!filtered.length) {
    grid.innerHTML = '<p style="color:var(--muted);padding:1rem">No photos yet.</p>';
    return;
  }
  filtered.forEach(photo => {
    const card = document.createElement('div');
    card.className = 'photo-card';
    if (photo.url) {
      const img = document.createElement('img');
      img.src = photo.url; img.alt = '';
      card.appendChild(img);
    }
    const meta = document.createElement('div');
    meta.className = 'photo-meta';
    meta.textContent = (photo.tags || []).join(', ') || 'Untagged';
    card.appendChild(meta);
    grid.appendChild(card);
  });
}

function filterDossier(label) {
  currentDossierFilter = label;
  if (state.currentSite) renderDossier(state.currentSite);
}

// ── CAPTURE ────────────────────────────────────────────────────────────────

document.getElementById('camera-btn').addEventListener('click', async () => {
  if (!state.currentSite) { showToast('Set up a site first.'); return; }
  try {
    const { blob, exif } = await openCamera();
    startCapture(blob, exif);
  } catch { showToast('Could not open camera.'); }
});

document.getElementById('library-btn').addEventListener('click', async () => {
  if (!state.currentSite) { showToast('Set up a site first.'); return; }
  try {
    const { blob, exif } = await openLibrary();
    startCapture(blob, exif);
  } catch { showToast('Could not open library.'); }
});

function startCapture(blob, exif) {
  const url = URL.createObjectURL(blob);
  state.captureState = { photoBlob: blob, photoUrl: url, exif, tags: [], severity: null, status: null, voiceNote: null, pairedWithId: null };
  const img = document.getElementById('photo-preview');
  img.src = url;
  showScreen('photo-card');
}

document.getElementById('photo-tag-btn').addEventListener('click', () => {
  showScreen('tag-picker');
  loadTaxonomy().then(tax => renderTagPicker(tax));
});

document.getElementById('photo-voice-btn').addEventListener('click', () => showScreen('voice'));
document.getElementById('photo-ba-btn').addEventListener('click', () => showScreen('before-after'));
document.getElementById('photo-save-btn').addEventListener('click', () => saveCapture());

document.getElementById('photo-discard-btn').addEventListener('click', () => {
  if (state.captureState?.photoUrl) URL.revokeObjectURL(state.captureState.photoUrl);
  state.captureState = null;
  goBack();
});

// ── TAG PICKER ─────────────────────────────────────────────────────────────

function renderTagPicker(taxonomy) {
  const grid = document.getElementById('tag-grid');
  grid.innerHTML = '';
  taxonomy.forEach(cat => {
    const chip = document.createElement('button');
    chip.className = 'tag-chip';
    chip.dataset.value = cat.value;
    chip.textContent = cat.label;
    if ((state.captureState?.tags || []).includes(cat.value)) chip.classList.add('tag-chip--active');
    chip.addEventListener('click', () => {
      chip.classList.toggle('tag-chip--active');
      if (!state.captureState) return;
      const tags = state.captureState.tags;
      const i = tags.indexOf(cat.value);
      if (i === -1) tags.push(cat.value); else tags.splice(i, 1);
    });
    grid.appendChild(chip);
  });
}

document.getElementById('tag-picker-done-btn').addEventListener('click', () => {
  const tags = state.captureState?.tags || [];
  const defaultSev = getSeverityDefault(tags);
  if (defaultSev && !state.captureState?.severity) state.captureState.severity = defaultSev;
  const autoStatus = getAutoStatus(tags);
  if (autoStatus && !state.captureState?.status) state.captureState.status = autoStatus;
  goBack();
});

// ── SEVERITY ───────────────────────────────────────────────────────────────

document.getElementById('severity-done-btn').addEventListener('click', () => goBack());

// ── STATUS ─────────────────────────────────────────────────────────────────

function onStatusSelected(value) {
  if (state.captureState) state.captureState.status = value;
}

document.getElementById('status-done-btn').addEventListener('click', () => goBack());

// ── VOICE NOTE (capture) ───────────────────────────────────────────────────

let voiceBlob    = null;
let voiceAudio   = null;
let voiceTimer   = null;
let voiceSeconds = 0;

function resetVoiceUI() {
  voiceBlob = null;
  voiceAudio = null;
  clearInterval(voiceTimer);
  voiceSeconds = 0;
  setText('voice-heading', C.voiceIdle.heading);
  setText('voice-sub',     C.voiceIdle.sub);
  document.getElementById('voice-record-btn').textContent  = C.voiceIdle.btnRecord;
  document.getElementById('voice-record-btn').disabled     = false;
  document.getElementById('voice-play-btn').hidden         = true;
  document.getElementById('voice-confirm-btn').hidden      = true;
  document.getElementById('voice-timer').textContent       = '0:00';
  document.getElementById('voice-timer').hidden            = true;
  document.getElementById('voice-stop-btn').hidden         = true;
}

document.addEventListener('ocos:screen:voice', resetVoiceUI);

document.getElementById('voice-record-btn').addEventListener('click', async () => {
  setText('voice-heading', C.voiceRecording.heading);
  setText('voice-sub',     C.voiceRecording.sub);
  const recBtn  = document.getElementById('voice-record-btn');
  const stopBtn = document.getElementById('voice-stop-btn');
  const timer   = document.getElementById('voice-timer');

  recBtn.disabled  = true;
  stopBtn.hidden   = false;
  timer.hidden     = false;
  voiceSeconds     = 0;
  timer.textContent = '0:00';
  voiceTimer = setInterval(() => {
    voiceSeconds++;
    timer.textContent = fmtDuration(voiceSeconds);
    const rem = VOICE_MAX_SECONDS - voiceSeconds;
    timer.style.color = rem <= 5 ? 'var(--red)' : rem <= 15 ? 'var(--amber)' : '';
  }, 1000);

  try {
    voiceBlob = await recordVoice(VOICE_MAX_SECONDS);
    if (voiceSeconds >= VOICE_MAX_SECONDS) showToast(`Recording stopped — ${fmtDuration(VOICE_MAX_SECONDS)} limit reached.`);
    clearInterval(voiceTimer);
    stopBtn.hidden = true;
    timer.hidden   = true;

    setText('voice-heading', C.voiceDone.heading);
    setText('voice-sub',     C.voiceDone.sub);
    document.getElementById('voice-play-btn').hidden    = false;
    document.getElementById('voice-confirm-btn').hidden = false;
    recBtn.disabled = false;
    recBtn.textContent = C.voiceDone.btnRedo;

    voiceAudio = new Audio(URL.createObjectURL(voiceBlob));
    voiceAudio.addEventListener('ended', () => {
      document.getElementById('voice-play-btn').textContent = C.voiceIdle.btnPlay;
    });

    // Auto-transcribe
    try {
      const text = await transcribeVoice(voiceBlob, null);
      if (text && state.captureState) state.captureState.voiceNote = text;
    } catch { /* non-fatal */ }

  } catch {
    clearInterval(voiceTimer);
    stopBtn.hidden = true;
    timer.hidden   = true;
    resetVoiceUI();
  }
});

document.getElementById('voice-stop-btn').addEventListener('click', () => stopRecording());

document.getElementById('voice-play-btn').addEventListener('click', () => {
  if (!voiceAudio) return;
  if (voiceAudio.paused) {
    voiceAudio.play();
    document.getElementById('voice-play-btn').textContent = C.voiceDone.btnPause;
  } else {
    voiceAudio.pause();
    document.getElementById('voice-play-btn').textContent = C.voiceIdle.btnPlay;
  }
});

document.getElementById('voice-confirm-btn').addEventListener('click', () => {
  if (state.captureState && voiceBlob) state.captureState.voiceBlob = voiceBlob;
  goBack();
});

// ── BEFORE / AFTER ─────────────────────────────────────────────────────────

document.getElementById('ba-pair-btn').addEventListener('click', async () => {
  if (!state.captureState) return;
  try {
    const { blob: afterBlob, exif: afterExif } = await openCamera();
    state.captureState.afterBlob = afterBlob;
    state.captureState.afterExif = afterExif;
    showToast('Before/After pair captured.');
    goBack();
  } catch { showToast('Could not capture after photo.'); }
});

document.getElementById('ba-skip-btn').addEventListener('click', () => goBack());

// ── SAVE CAPTURE ───────────────────────────────────────────────────────────

async function saveCapture() {
  const cs = state.captureState;
  if (!cs) return;
  const siteId = state.currentSite?.id;
  if (!siteId) { showToast('No site selected.'); return; }

  try {
    await uploadPhoto({
      siteId,
      blob:        cs.photoBlob,
      exif:        cs.exif,
      tags:        cs.tags,
      severity:    cs.severity,
      status:      cs.status,
      voiceBlob:   cs.voiceBlob,
      voiceNote:   cs.voiceNote,
      pairedWithId:cs.pairedWithId,
      afterBlob:   cs.afterBlob,
      afterExif:   cs.afterExif,
    });
    showToast('Photo saved.');
    syncMgr.markPending(1);
    if (cs.photoUrl) URL.revokeObjectURL(cs.photoUrl);
    state.captureState = null;
    showScreen('capture', false);
    screenStack = ['capture'];
    loadDossier(siteId);
  } catch (err) {
    showToast('Save failed — stored offline.');
    syncMgr.markOffline(1);
  }
}

// ── INSPECTIONS ────────────────────────────────────────────────────────────

function onInspectionTypeSelected(type) {
  const def = C.inspectionTypes.find(t => t.value === type);
  state.currentInspection = {
    type,
    label: def?.label || type,
    items: getChecklistForType(type),
    workers: [],
  };
}

document.getElementById('start-inspection-btn').addEventListener('click', () => {
  if (!state.currentInspection) { showToast('Select an inspection type.'); return; }
  showScreen('inspection-checklist');
  const container = document.getElementById('checklist-container');
  renderChecklist(container, state.currentInspection.items);
});

// ── CHECKLIST ──────────────────────────────────────────────────────────────

let clActiveIdx    = null;
let clTimerSeconds = 0;
let clTimerInterval = null;
const clAudioEls   = {};

function fmtDuration(s) {
  return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;
}

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

    const { panel: notePanel, textarea } = buildClNotePanel(idx, item);

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

document.getElementById('alone-save-btn').addEventListener('click', async () => {
  const name = document.getElementById('alone-name-input').value.trim();
  if (!name) { showToast('Enter your name.'); return; }
  const role = document.getElementById('alone-role-input').value.trim();
  state.pendingWorkers = [{ name, role, signed: false, signature: null, method: null }];
  await saveRecentWorker(name, role);
  renderWorkersList();
  document.getElementById('alone-inline').hidden = true;
  document.getElementById('alone-btn').hidden = false;
});

function renderWorkersList() {
  const list = document.getElementById('workers-list');
  list.innerHTML = '';
  state.pendingWorkers.forEach((w, i) => {
    const row = document.createElement('div');
    row.className = 'worker-row' + (w.signed ? ' worker-row--signed' : '');

    const name = document.createElement('span');
    name.textContent = w.role ? `${w.name} · ${w.role}` : w.name;

    const status = document.createElement('span');
    status.className = 'worker-status';
    status.textContent = w.signed ? '✓ Signed' : 'Pending';

    const signBtn = document.createElement('button');
    signBtn.className = 'btn btn-sm btn-ghost';
    signBtn.textContent = w.signed ? 'Re-sign' : 'Sign';
    signBtn.addEventListener('click', () => startSignoff(i));

    const removeBtn = document.createElement('button');
    removeBtn.className = 'btn btn-sm btn-danger';
    removeBtn.textContent = '✕';
    removeBtn.addEventListener('click', () => {
      state.pendingWorkers.splice(i, 1);
      renderWorkersList();
    });

    row.appendChild(name);
    row.appendChild(status);
    row.appendChild(signBtn);
    row.appendChild(removeBtn);
    list.appendChild(row);
  });

  document.getElementById('finish-signoff-btn').disabled = !state.pendingWorkers.every(w => w.signed);
}

document.getElementById('finish-signoff-btn').addEventListener('click', async () => {
  await completeSignoffs();
});

function startSignoff(workerIdx) {
  state.signingWorkerIdx = workerIdx;
  const w    = state.pendingWorkers[workerIdx];
  const name = w.name;
  const date = new Date().toLocaleDateString('en-CA');
  const site = state.currentSite?.name || '';
  const type   = state.currentInspection?.label || 'inspection';
  setText('signoff-draw-sub', C.signoffDraw.sub(name, type, date, site));
  showScreen('signoff-draw');
  initSigPad();
}

function initSigPad() {
  const oldCanvas = document.getElementById('sig-canvas');
  const newCanvas = oldCanvas.cloneNode(true);
  oldCanvas.parentNode.replaceChild(newCanvas, oldCanvas);
  const canvas = newCanvas;
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

let sigCtx    = null;
let sigDrawing = false;

document.getElementById('insp-generate-report-btn').addEventListener('click', () => generateReport());
document.getElementById('insp-draft-btn').addEventListener('click',           () => showScreen('reports'));

async function generateReport() {
  const siteId = state.currentSite?.id;
  if (!siteId) { showToast('No site selected.'); return; }
  showScreen('report-generating');

  try {
    const insp = state.currentInspection;
    const payload = {
      type:    insp?.type,
      workers: state.pendingWorkers,
      items:   insp?.items,
    };
    const result = await createInspection(siteId, payload);
    const inspId = result?.id;

    if (inspId && state.pendingWorkers.length) {
      await signoffInspection(inspId, state.pendingWorkers);
    }

    const report = await apiGenerateReport(siteId, { inspectionId: inspId });
    state.currentReport = report;
    showScreen('report-ready');
    document.getElementById('report-ready-sub').textContent =
      `${report.photoCount || 0} photos · ${report.findings?.length || 0} findings`;
  } catch (err) {
    showToast('Report generation failed.');
    showScreen('inspection-complete');
  }
}

// ── REPORTS ────────────────────────────────────────────────────────────────

let currentReportFilter = 'All';

async function loadReports() {
  const list = document.getElementById('reports-list');
  list.innerHTML = '<p>Loading…</p>';
  try {
    const siteId = state.currentSite?.id;
    const reports = await listReports(siteId);
    if (!reports?.length) { list.innerHTML = '<p style="color:var(--muted)">No reports yet.</p>'; return; }
    state.reportData = reports;
    filterReports(currentReportFilter);
  } catch {
    list.innerHTML = '<p style="color:var(--red)">Failed to load reports.</p>';
  }
}

function filterReports(label) {
  currentReportFilter = label;
  const list = document.getElementById('reports-list');
  list.innerHTML = '';
  const reports = state.reportData || [];
  const filtered = label === 'All' ? reports : reports.filter(r => r.status === label.toLowerCase());
  if (!filtered.length) {
    list.innerHTML = '<p style="color:var(--muted)">No reports match this filter.</p>';
    return;
  }
  filtered.forEach(r => {
    const card = renderReportCard(r, {
      onOpen:    () => openReport(r),
      onSend:    () => openSendReport(r),
      onHistory: () => openVersionHistory(r),
    });
    list.appendChild(card);
  });
}

function openReport(report) {
  state.currentReport = report;
  if (report.locked) {
    showScreen('report-locked');
    document.getElementById('report-locked-done-btn').addEventListener('click', () => goBack(), { once: true });
    return;
  }
  showScreen('report-ready');
  document.getElementById('report-ready-sub').textContent =
    `${report.photoCount || 0} photos · ${report.findings?.length || 0} findings`;
}

document.getElementById('report-open-pdf-btn').addEventListener('click', () => {
  const url = state.currentReport?.pdfUrl;
  if (url) window.open(url, '_blank');
  else showToast('PDF not available yet.');
});

document.getElementById('report-send-quick-btn').addEventListener('click', () => {
  if (state.currentReport) openSendReport(state.currentReport);
});

document.getElementById('report-regen-btn')?.addEventListener('click', async () => {
  if (!state.currentReport?.id) return;
  showScreen('report-generating');
  try {
    const updated = await regenerateReport(state.currentReport.id);
    state.currentReport = updated;
    showScreen('report-ready');
  } catch { showToast('Regeneration failed.'); showScreen('report-ready'); }
});

// ── SEND REPORT ────────────────────────────────────────────────────────────

function openSendReport(report) {
  state.currentReport = report;
  state.pendingRecipients = [];
  document.getElementById('recipient-list').innerHTML = '';
  showScreen('report-send');
}

document.getElementById('add-recipient-btn').addEventListener('click', () => {
  const name  = document.getElementById('recipient-name').value.trim();
  const email = document.getElementById('recipient-email').value.trim();
  const role  = document.getElementById('recipient-role').value;
  if (!email) { showToast('Enter an email address.'); return; }
  state.pendingRecipients.push({ name, email, role });
  renderRecipientList();
  document.getElementById('recipient-name').value  = '';
  document.getElementById('recipient-email').value = '';
});

function renderRecipientList() {
  const list = document.getElementById('recipient-list');
  list.innerHTML = '';
  state.pendingRecipients.forEach((r, i) => {
    const row = document.createElement('div');
    row.className = 'recipient-row';
    row.textContent = `${r.name ? r.name + ' ' : ''}<${r.email}> · ${r.role}`;
    const del = document.createElement('button');
    del.className = 'btn btn-sm btn-danger';
    del.textContent = '✕';
    del.addEventListener('click', () => { state.pendingRecipients.splice(i, 1); renderRecipientList(); });
    row.appendChild(del);
    list.appendChild(row);
  });
}

document.getElementById('send-report-btn').addEventListener('click', async () => {
  if (!state.currentReport?.id) { showToast('No report selected.'); return; }
  if (!state.pendingRecipients.length) { showToast('Add at least one recipient.'); return; }
  try {
    await apiSendReport(state.currentReport.id, state.pendingRecipients);
    showToast('Report sent!');
    goBack();
  } catch { showToast('Failed to send report.'); }
});

document.getElementById('download-report-btn').addEventListener('click', () => {
  const url = state.currentReport?.pdfUrl;
  if (!url) { showToast('PDF not available.'); return; }
  const a = document.createElement('a');
  a.href = url; a.download = 'report.pdf'; a.click();
});

document.getElementById('lock-report-btn')?.addEventListener('click', async () => {
  if (!state.currentReport?.id) return;
  try {
    await lockReport(state.currentReport.id);
    showScreen('report-locked');
  } catch { showToast('Could not lock report.'); }
});

// ── VERSION HISTORY ────────────────────────────────────────────────────────

async function openVersionHistory(report) {
  state.currentReport = report;
  showScreen('version-history');
  const list = document.getElementById('version-list');
  list.innerHTML = '<p>Loading…</p>';
  try {
    const versions = await getReportVersions(report.id);
    list.innerHTML = '';
    versions.forEach(v => {
      const row = renderVersionRow(v, () => {
        state.currentReport = v;
        showScreen('report-ready');
      });
      list.appendChild(row);
    });
  } catch { list.innerHTML = '<p style="color:var(--red)">Failed to load versions.</p>'; }
}

// ── SETTINGS ───────────────────────────────────────────────────────────────

async function updateSettingsPanel() {
  document.getElementById('settings-license').textContent  = state.licenseKey || 'None';
  document.getElementById('settings-tier').textContent     = state.tier || 'T2';
  document.getElementById('settings-site').textContent     = state.currentSite?.name || 'None';
  const n = await getPendingCount();
  document.getElementById('settings-pending').textContent  = n || 0;
}

document.getElementById('change-license-btn').addEventListener('click', () => showScreen('license-entry'));

document.getElementById('change-site-btn').addEventListener('click', () => {
  showScreen('site-list');
  loadSiteList();
});

document.getElementById('new-site-from-settings-btn')?.addEventListener('click', () => showScreen('site-new'));

document.getElementById('style-learning-btn')?.addEventListener('click', () => {
  showScreen('style-learning');
  loadStyleSamples().then(samples => {
    if (samples?.length) renderStyleSamples(samples);
  });
});

document.getElementById('branding-btn')?.addEventListener('click', () => showScreen('branding-setup'));

// ── SITE SWITCHER (settings) ───────────────────────────────────────────────

async function loadSiteListSettings() {
  const wrap = document.getElementById('site-list-wrap');
  wrap.innerHTML = '<p>Loading…</p>';
  try {
    const sites = await listReports();
    if (!sites?.length) { wrap.innerHTML = '<p>No sites found.</p>'; return; }
    wrap.innerHTML = '';
    sites.forEach(s => {
      const btn = document.createElement('button');
      btn.className = 'site-chip';
      btn.textContent = s.name || s.id;
      btn.addEventListener('click', async () => {
        state.currentSite = s;
        await setSetting('activeSiteId', s.id);
        updateSettingsPanel();
        showToast(`Switched to ${s.name || s.id}`);
        goBack();
      });
      wrap.appendChild(btn);
    });
  } catch {
    wrap.innerHTML = '<p>Error loading sites.</p>';
  }
}

// ── STYLE LEARNING ─────────────────────────────────────────────────────────

function renderStyleSamples(samples) {
  const grid = document.getElementById('style-samples-grid');
  grid.innerHTML = '';
  samples.forEach(s => {
    const card = document.createElement('div');
    card.className = 'style-sample-card';
    const img = document.createElement('img');
    img.src = s.url; img.alt = s.tag;
    card.appendChild(img);
    const label = document.createElement('span');
    label.textContent = s.tag;
    card.appendChild(label);
    grid.appendChild(card);
  });
  document.getElementById('style-empty').hidden  = true;
  document.getElementById('style-ready').hidden  = false;
  document.getElementById('style-uploading').hidden = true;
}

document.getElementById('style-upload-btn')?.addEventListener('click', async () => {
  const tag = state.pendingSampleTag;
  if (!tag) { showToast('Select a tag first.'); return; }
  try {
    const { blob } = await openLibrary();
    document.getElementById('style-empty').hidden     = true;
    document.getElementById('style-uploading').hidden = false;
    await uploadSample(blob, tag);
    const samples = await loadStyleSamples();
    renderStyleSamples(samples);
    showToast('Sample uploaded!');
  } catch { showToast('Upload failed.'); }
});

// ── BRANDING ───────────────────────────────────────────────────────────────

document.getElementById('brand-save-btn')?.addEventListener('click', async () => {
  const name    = document.getElementById('brand-name').value.trim();
  const logoUrl = document.getElementById('brand-logo-url').value.trim();
  const colour  = document.getElementById('brand-colour').value;
  await setSetting('brandName',   name);
  await setSetting('brandLogo',   logoUrl);
  await setSetting('brandColour', colour);
  if (colour) document.documentElement.style.setProperty('--green', colour);
  showScreen('brand-preview');
  document.getElementById('brand-preview-name').textContent = name || 'Your Company';
  if (logoUrl) document.getElementById('brand-preview-logo').src = logoUrl;
});

document.getElementById('brand-preview-back')?.addEventListener('click', () => goBack());

// ── AUDIO PLAYBACK (photo-audio) ───────────────────────────────────────────

document.addEventListener('click', async e => {
  const btn = e.target.closest('[data-audio-url]');
  if (!btn) return;
  const url = btn.dataset.audioUrl;
  if (!url) return;
  try {
    const resolved = await getPhotoAudioUrl(url);
    const audio = new Audio(resolved);
    audio.play();
  } catch { showToast('Could not play audio.'); }
});

// ── BACK BUTTON ─────────────────────────────────────────────────────────────

document.getElementById('back-btn').addEventListener('click', () => goBack());

// ── KEYBOARD SHORTCUT (dev) ────────────────────────────────────────────────

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') goBack();
});

// ─────────────────────────────────────────────────────────────────────────────

init().catch(console.error);
