/**
 * Voice recording — 90-second cap, returns audio Blob.
 * Supports pause/resume. Transcription delegates to /fc/ai/summarize.
 */

import { aiSummarize } from './api.js';

let mediaRecorder = null;
let stopResolve   = null;
let autoStopTimer = null;

export const VOICE_MAX_SECONDS = 300;       // main screen
export const VOICE_CL_MAX_SECONDS = 180;    // checklist inline

export function recordVoice(maxSeconds = VOICE_MAX_SECONDS) {
  return new Promise(async (resolve, reject) => {
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
      reject(err);
      return;
    }

    const chunks = [];
    const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
      ? 'audio/webm;codecs=opus'
      : 'audio/mp4';

    mediaRecorder = new MediaRecorder(stream, { mimeType });
    mediaRecorder.addEventListener('dataavailable', e => { if (e.data.size > 0) chunks.push(e.data); });
    mediaRecorder.addEventListener('stop', () => {
      stream.getTracks().forEach(t => t.stop());
      resolve(new Blob(chunks, { type: mimeType }));
    });

    mediaRecorder.start(250);

    autoStopTimer = setTimeout(() => stopRecording(), maxSeconds * 1000);

    stopResolve = () => {
      clearTimeout(autoStopTimer);
      autoStopTimer = null;
      if (mediaRecorder?.state !== 'inactive') mediaRecorder.stop();
    };
  });
}

export function stopRecording() {
  if (stopResolve) { stopResolve(); stopResolve = null; }
  if (mediaRecorder?.state !== 'inactive') mediaRecorder?.stop();
}

export function pauseRecording() {
  if (mediaRecorder?.state === 'recording') mediaRecorder.pause();
}

export function resumeRecording() {
  if (mediaRecorder?.state === 'paused') mediaRecorder.resume();
}

export function getRecordingState() {
  return mediaRecorder?.state || 'inactive';
}

// Uint8Array -> base64 in chunks. String.fromCharCode(...bytes) blows the
// JS engine's argument-count limit for anything beyond a tiny array — any
// real voice recording (even a few seconds) throws before the transcription
// request is ever sent, which is why no request ever reached the server.
function bytesToBase64(bytes) {
  const CHUNK = 0x8000; // 32KB — comfortably under every engine's limit
  let binary = '';
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + CHUNK));
  }
  return btoa(binary);
}

export async function transcribeVoice(audioBlob, photoId) {
  const buf = await audioBlob.arrayBuffer();
  const b64 = bytesToBase64(new Uint8Array(buf));

  const result = await aiSummarize({
    type: 'voice_transcription',
    audioBase64: b64,
    audioMimeType: audioBlob.type,
    photoId,
  });

  return result.summary || result.transcription || '';
}
