/**
 * All UI copy verbatim from OCOS-AppCopy.md.
 * Do not rewrite. Import from here — never inline strings.
 */

export const C = {
  // ── Onboarding ──────────────────────────────────────────────────────────
  welcome: {
    headline: 'Your phone is now your safety binder.',
    sub: 'Snap a photo. Tag the hazard. OCOS files it. MOL-ready in seconds.',
    btn: 'Set up my site',
  },
  permissions: {
    headline: 'A few quick okays.',
    sub: 'OCOS Field needs your camera, microphone, and location to record defensible evidence.',
    perms: [
      { icon: '📷', label: 'Camera', desc: 'Capture site photos.' },
      { icon: '🎤', label: 'Microphone', desc: 'Voice notes instead of typing.' },
      { icon: '📍', label: 'Location', desc: 'Stamp every photo with where it was taken.' },
    ],
    btn: 'Allow access',
  },
  siteSetup: {
    headline: 'What site are we on?',
    sub: 'Pick an existing site or start a new one. You can rename it later.',
    btnExisting: 'Choose existing site',
    btnNew: 'Start a new site',
  },
  ready: {
    headline: 'You\'re set.',
    sub: 'Tap the camera button anytime. We\'ll handle the paperwork.',
    btn: 'Open camera',
  },

  // ── Capture ──────────────────────────────────────────────────────────────
  emptyCapture: {
    headline: 'No photos yet.',
    sub: 'Tap the big green button to start.',
  },
  photoCard: {
    heading: 'Got it.',
    line1: 'Tap a category to file this photo.',
    line2: 'Or hold the mic to dictate a note first.',
  },
  tagPicker: {
    heading: 'What\'s in this photo?',
    sub: 'Pick what fits. You can add more later.',
  },
  severity: {
    heading: 'How bad is it?',
    options: ['Info', 'Low', 'Medium', 'High', 'Critical'],
    helper: 'OCOS sets a default based on the tag. Change it if you disagree.',
  },
  status: {
    heading: 'What\'s the status?',
    options: [
      { value: 'Routine',           label: 'Routine — just for the record' },
      { value: 'Hazard - Open',     label: 'Hazard found — needs fixing' },
      { value: 'Hazard - Corrected',label: 'Hazard fixed — pair with the before photo' },
      { value: 'Inspection',        label: 'Inspection — part of a formal walk' },
      { value: 'Incident',          label: 'Incident — someone got hurt or nearly did' },
    ],
  },
  voiceIdle: {
    heading: 'Tap to record.',
    sub: 'Up to 5 minutes. We\'ll transcribe it.',
  },
  voiceRecording: {
    heading: 'Recording…',
    sub: 'Tap Stop when you\'re done.',
  },
  voiceTranscribing: {
    heading: 'Got it. Writing it up…',
    sub: 'Usually under 5 seconds.',
  },
  voiceDone: {
    heading: 'Here\'s what you said.',
    btnConfirm: 'Looks good',
    btnEdit: 'Edit text',
  },
  beforeAfter: {
    heading: 'Pair this with a "before"?',
    sub: 'Find the original photo of this hazard so we can show it fixed.',
    btnPair: 'Find the before photo',
    btnSkip: 'Skip — this is standalone',
  },

  // ── Site dossier ──────────────────────────────────────────────────────────
  filterBar: ['All', 'Open hazards', 'Fixed hazards', 'Inspections', 'Incidents', 'This week'],
  emptyFilter: {
    heading: 'Nothing here yet.',
    sub: 'Try a different filter or capture a new photo.',
  },

  // ── Sync status ───────────────────────────────────────────────────────────
  sync: {
    synced: 'All synced',
    syncing: (n, t) => `Syncing ${n} of ${t}…`,
    offlineQueue: (n) => `${n} photo${n !== 1 ? 's' : ''} waiting — we\'ll send them when you\'re back online`,
    offlineIdle: 'Offline. Capture as normal.',
    error: 'Couldn\'t reach the server. Tap to retry.',
  },

  // ── Inspection ────────────────────────────────────────────────────────────
  inspectionTypes: [
    { value: 'Daily Pre-Task',        label: 'Daily pre-task (10–15 min)' },
    { value: 'Toolbox Talk',          label: 'Toolbox talk (15–20 min)' },
    { value: 'JHSC Monthly',          label: 'JHSC monthly (60–90 min)' },
    { value: 'Pre-Shift',             label: 'Pre-shift safety briefing (5–10 min)' },
    { value: 'Incident Investigation',label: 'Incident investigation' },
    { value: 'MOL Response',          label: 'MOL order response' },
    { value: 'Other',                 label: 'Custom' },
  ],
  checklistItem: {
    defaultState: 'Not checked',
    checked: '✓ Done',
    flagged: '⚠ Issue',
    photoHelper: 'Tap to capture proof.',
  },
  signoffWorkers: {
    heading: 'Who was here?',
    sub: 'Add or pick workers. Each one signs off.',
    btnAdd: 'Add a worker',
    btnAlone: 'I was alone',
  },
  signoffDraw: {
    heading: 'Sign here.',
    sub: (name, type, date, site) => `${name} — by signing, you confirm you attended this ${type} on ${date} at ${site}.`,
    btnSave: 'Save signature',
    btnPin: 'Use PIN instead',
  },
  signoffPin: {
    heading: 'Enter your PIN.',
    sub: 'This stands in for your signature.',
  },
  inspectionComplete: {
    heading: 'Inspection filed.',
    sub: 'Report ready. Send it now or save for later.',
    btnGenerate: 'Generate the report',
    btnDraft: 'Save to drafts',
  },

  // ── Reports ───────────────────────────────────────────────────────────────
  reportList: {
    title: 'Reports',
    filters: ['All', 'Toolbox', 'JHSC', 'Incident', 'This month'],
    empty: {
      heading: 'No reports yet.',
      sub: 'Run an inspection or summarize a date range — we\'ll write the report for you.',
      btnInspection: 'Start an inspection',
      btnSummarize: 'Summarize a date range',
    },
  },
  reportGenerating: {
    heading: 'Writing your report…',
    sub: 'Pulling photos, tags, sign-offs, and your style. About 20 seconds.',
  },
  reportReady: {
    heading: 'Ready to review.',
    sub: 'Read it through before sending. Edits are easy.',
    btnOpen: 'Open the PDF',
    btnSend: 'Send it',
  },
  reportSend: {
    heading: 'Who needs a copy?',
    sub: 'Add as many as you need. We\'ll track who got it and when they opened it.',
    recipientHelper: 'Email · Role',
    roles: ['Owner', 'JHSC Chair', 'MOL', 'Insurer', 'Client', 'Other'],
    btnSend: (n) => `Send to ${n} recipient${n !== 1 ? 's' : ''}`,
    btnDownload: 'Just download',
  },
  reportLocked: {
    heading: 'Report sent and locked.',
    sub: 'This version is now part of your audit trail. If anything changes, OCOS will create v2 and keep this one untouched.',
    btn: 'Done',
  },
  versionHistory: {
    heading: 'Version history',
    rowFormat: (n, date, count) => `Version ${n} · Locked ${date} · Sent to ${count} recipient${count !== 1 ? 's' : ''}`,
    btn: 'Open',
  },

  // ── Style Learning (T3) ───────────────────────────────────────────────────
  styleLearning: {
    empty: {
      heading: 'Teach OCOS your voice.',
      sub: 'Upload 3 to 10 of your past reports. OCOS will read them and write new reports the same way you do — your tone, your structure, your level of detail.',
      btn: 'Upload a report',
      privacy: 'Your samples stay in your workspace. We don\'t train AI on your data, and we don\'t share style across clients.',
    },
    uploading: {
      heading: 'Got it. Reading the file…',
      sub: 'Usually 10–20 seconds.',
    },
    ready: {
      heading: 'Sample added.',
      sub: (n) => `${n} words extracted. Tag it as "Use," "Reference Only," or "Exclude."`,
      tags: [
        { value: 'Use',           label: '✓ Use — match this style on future reports' },
        { value: 'Reference Only',label: '👁 Reference only — keep it for context but don\'t match' },
        { value: 'Exclude',       label: '✗ Exclude — don\'t read this one' },
      ],
    },
    applied: 'Style: matched against 3 of your past reports',
  },

  // ── Custom branding (T3) ──────────────────────────────────────────────────
  branding: {
    heading: 'Your reports, your brand.',
    sub: 'Upload your logo and pick your colours. We\'ll apply them to every PDF.',
    fields: [
      { key: 'logo',        label: 'Logo', hint: 'PNG or SVG, transparent background recommended' },
      { key: 'primary',     label: 'Primary colour', hint: 'hex' },
      { key: 'accent',      label: 'Accent colour', hint: 'hex' },
      { key: 'companyName', label: 'Company name as it appears on the report' },
      { key: 'footerLine',  label: 'Footer line', hint: 'optional — address, phone, website' },
    ],
    btnSave: 'Save and preview',
    footer: 'The audit-trail appendix on every report keeps a small "Generated by OCOS" line at the bottom. That\'s part of the licence and can\'t be removed.',
  },

  // ── Errors ────────────────────────────────────────────────────────────────
  errors: {
    cameraDenied: {
      headline: 'We need camera access.',
      body: 'Photos are the whole point. Open settings to allow OCOS Field to use your camera.',
      btn: 'Open settings',
    },
    micDenied: {
      headline: 'Mic access is off.',
      body: 'Voice notes won\'t work, but you can still type. Open settings if you want them back.',
      btns: ['Open settings', 'Continue without'],
    },
    gpsOff: {
      headline: 'Location is off.',
      body: 'Photos still capture, but they won\'t carry GPS evidence. We strongly recommend turning it on.',
      btns: ['Turn on location', 'Continue anyway'],
    },
    gpsDenied: {
      headline: 'Location access denied.',
      body: 'OCOS Field needs location to make photos defensible. Open settings to allow it.',
      btn: 'Open settings',
    },
    offlineCaptured: {
      headline: 'Saved offline.',
      body: 'We\'ll upload this photo when you\'re back on signal.',
      btn: 'OK',
    },
    offlineApi: {
      headline: 'No signal.',
      body: 'We\'re working offline. Everything you capture is safe and will sync later.',
      btn: 'OK',
    },
    fileTooLarge: {
      headline: 'That photo is huge.',
      body: 'OCOS will compress it down. Original quality is preserved on our side.',
      btn: 'Continue',
    },
    uploadFailed: {
      headline: 'Couldn\'t upload.',
      body: 'We\'ll try again automatically. If it keeps failing, let us know.',
      btns: ['Retry now', 'Dismiss'],
    },
    licenseExpired: {
      headline: 'Your license is on hold.',
      body: 'Field Compliance is paused. Renew to keep capturing and generating reports.',
      btn: 'Renew',
    },
    noFieldAccess: {
      headline: 'Field isn\'t on your plan.',
      body: 'Add Field Compliance to your OCOS subscription to start capturing.',
      btns: ['See plans', 'Talk to us'],
    },
    styleLimitReached: {
      headline: 'You\'ve hit your sample limit.',
      body: 'T3 includes 10 active style samples. Pause one to add another.',
      btn: 'Manage samples',
    },
    reportLocked: {
      headline: 'This report is locked.',
      body: 'It\'s been sent. Want to make changes? OCOS will create v2 and keep this one untouched.',
      btns: ['Create v2', 'Cancel'],
    },
    cannotDeleteEvidence: {
      headline: 'Can\'t delete this photo.',
      body: 'Photos linked to a locked report stay in the audit trail. You can archive it from active views instead.',
      btns: ['Archive', 'Cancel'],
    },
    aiSummaryFailed: {
      headline: 'Couldn\'t generate the summary.',
      body: 'The photo is saved. You can write a note manually or try the summary again.',
      btns: ['Try again', 'Write manually'],
    },
    styleUnsupported: {
      headline: 'We can\'t read this file.',
      body: 'Send a PDF, Word document, or plain text. Images of reports won\'t work yet.',
      btn: 'Pick a different file',
    },
  },
};
