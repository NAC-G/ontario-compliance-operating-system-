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

export async function transcribeVoice(audioBlob, photoId) {
  const buf = await audioBlob.arrayBuffer();
  const b64 = btoa(String.fromCharCode(...new Uint8Array(buf)));

  const result = await aiSummarize({
    type: 'voice_transcription',
    audioBase64: b64,
    audioMimeType: audioBlob.type,
    photoId,
  });

  return result.summary || result.transcription || '';
}
