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