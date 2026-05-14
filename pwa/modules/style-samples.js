/**
 * T3 Style Learning — upload, list, tag samples.
 * Calls the /fc/style/* endpoints via the API module.
 */

import { uploadStyleSample, listStyleSamples, deleteStyleSample } from './api.js';
import { C } from './copy.js';

export async function loadStyleSamples() {
  const emptyState   = document.getElementById('style-empty');
  const samplesList  = document.getElementById('style-samples-list');
  const addAnotherBtn = document.getElementById('style-add-another-btn');

  try {
    const result = await listStyleSamples();
    const samples = result.samples || [];

    if (samples.length === 0) {
      emptyState.hidden = false;
      samplesList.innerHTML = '';
      addAnotherBtn.hidden = true;
      return;
    }

    emptyState.hidden = true;
    addAnotherBtn.hidden = false;
    samplesList.innerHTML = '';

    samples.forEach(s => {
      const card = document.createElement('div');
      card.className = 'sample-card';
      card.innerHTML = `
        <div class="sample-card-title">${escapeHtml(s.fileName || 'Sample')}</div>
        <div class="sample-card-meta">${s.wordCount || 0} words · Used ${s.timesUsed || 0}×  · ${s.tag || 'Untagged'}</div>
      `;

      const del = document.createElement('button');
      del.className = 'btn btn-ghost btn-xs';
      del.textContent = 'Remove';
      del.style.marginTop = '8px';
      del.addEventListener('click', async () => {
        await deleteStyleSample(s.id);
        card.remove();
        const remaining = samplesList.querySelectorAll('.sample-card').length;
        if (remaining === 0) {
          emptyState.hidden = false;
          addAnotherBtn.hidden = true;
        }
      });
      card.appendChild(del);
      samplesList.appendChild(card);
    });
  } catch (_) {
    emptyState.hidden = false;
    samplesList.innerHTML = '';
  }
}

export async function uploadSample(file) {
  const uploadingEl = document.getElementById('style-uploading');
  const readyEl     = document.getElementById('style-sample-ready');
  const readySubEl  = document.getElementById('style-ready-sub');

  uploadingEl.hidden = false;

  const formData = new FormData();
  formData.append('file', file, file.name);

  try {
    const result = await uploadStyleSample(formData);

    uploadingEl.hidden = true;

    const wordCount = result.wordCount || 0;
    readySubEl.textContent = C.styleLearning.ready.sub(wordCount);

    // Store for confirm step
    window._newSampleId = result.id;

    readyEl.hidden = false;
  } catch (err) {
    uploadingEl.hidden = true;
    if (err?.status === 422) {
      // Hit the 10-sample limit
      document.dispatchEvent(new CustomEvent('ocos:error', { detail: 'styleLimitReached' }));
    } else {
      document.dispatchEvent(new CustomEvent('ocos:error', { detail: 'styleUnsupported' }));
    }
  }
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}
