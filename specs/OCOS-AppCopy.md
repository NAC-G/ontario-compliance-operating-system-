# OCOS Field Compliance — App Copy

**Version:** v1.0
**Pairs with:** `OCOS-FieldCompliance-Schema.md`, `OCOS-RegulatoryTaxonomy.json`
**Voice:** Direct. Confident. Plain language. Built by a contractor for contractors. Not Silicon-Valley cute, not corporate-stiff. Sentences are short. Buttons are verbs.

---

## Naming

| Surface | Name |
|---|---|
| Module name | **OCOS Field Compliance** |
| Internal short name | **Field** |
| PWA install name | **OCOS Field** |
| App icon label (home screen) | **OCOS Field** |
| Domain | `field.naturalalternatives.ca` |
| Tagline (long) | The compliance camera Ontario contractors actually use. |
| Tagline (short) | Photo. Tag. Filed. |
| One-liner for marketing | Your phone is now your safety binder. |

---

## Install / first-run screens

### Screen 1 — Welcome
**Headline:** Your phone is now your safety binder.
**Sub:** Snap a photo. Tag the hazard. OCOS files it. MOL-ready in seconds.
**Button:** Set up my site

### Screen 2 — Permissions
**Headline:** A few quick okays.
**Sub:** OCOS Field needs your camera, microphone, and location to record defensible evidence.
**Bullet rows:**
- 📷 **Camera** — Capture site photos.
- 🎤 **Microphone** — Voice notes instead of typing.
- 📍 **Location** — Stamp every photo with where it was taken.
**Button:** Allow access

### Screen 3 — Site setup
**Headline:** What site are we on?
**Sub:** Pick an existing site or start a new one. You can rename it later.
**Primary button:** Choose existing site
**Secondary button:** Start a new site

### Screen 4 — Ready to capture
**Headline:** You're set.
**Sub:** Tap the camera button anytime. We'll handle the paperwork.
**Button:** Open camera

---

## Main capture screen

### Empty state (no photos yet on this site)
**Headline:** No photos yet.
**Sub:** Tap the big green button to start.
**CTA:** *(camera icon, label-less)*

### Photo just captured — quick action card
**Heading:** Got it.
**Body line 1:** Tap a category to file this photo.
**Body line 2:** Or hold the mic to dictate a note first.

### Tag picker — header
**Heading:** What's in this photo?
**Sub:** Pick what fits. You can add more later.

### Tag picker — categories (mirrors taxonomy)
- Working at Heights
- Fall Protection
- Scaffolding
- Ladders
- WHMIS / Hazardous Materials
- PPE
- Excavation & Trenching
- Confined Space
- Hot Work
- Electrical Safety
- Mobile Equipment
- Housekeeping
- First Aid
- Emergency Preparedness
- JHSC / H&S Rep
- Toolbox Talk / Competency
- Incident / Near Miss
- MOL Order
- Workplace Violence & Harassment
- Naloxone & Worker Wellness

### Severity picker
**Heading:** How bad is it?
**Options:** Info · Low · Medium · High · Critical
**Helper:** OCOS sets a default based on the tag. Change it if you disagree.

### Status picker
**Heading:** What's the status?
**Options:**
- Routine — just for the record
- Hazard found — needs fixing
- Hazard fixed — pair with the before photo
- Inspection — part of a formal walk
- Incident — someone got hurt or nearly did

### Voice note prompt (idle)
**Heading:** Tap and hold to talk.
**Sub:** Up to 90 seconds. We'll transcribe it.

### Voice note prompt (recording)
**Heading:** Recording…
**Sub:** Release to stop.

### Voice note (just finished, transcribing)
**Heading:** Got it. Writing it up…
**Sub:** Usually under 5 seconds.

### Voice note (transcribed)
**Heading:** Here's what you said.
**Action button:** Looks good
**Secondary action:** Edit text

### Before/after pairing prompt
**Heading:** Pair this with a "before"?
**Sub:** Find the original photo of this hazard so we can show it fixed.
**Primary button:** Find the before photo
**Secondary button:** Skip — this is standalone

---

## Site dossier (the photo grid)

### Header — counts
*(dynamic, e.g. "12 photos · 2 open hazards · last updated 14 min ago")*

### Filter bar
- All
- Open hazards
- Fixed hazards
- Inspections
- Incidents
- This week

### Photo card overlay (hold to inspect)
**Top line:** *(timestamp, e.g. "Tue 14 Apr · 09:42")*
**Middle line:** *(tags, comma-separated)*
**Bottom line:** *(OHSA references, e.g. "OReg 213/91 s.26 · OHSA s.25")*

### Empty filtered state
**Heading:** Nothing here yet.
**Sub:** Try a different filter or capture a new photo.

---

## Sync status (header chip)

| State | Copy |
|---|---|
| Online, all synced | All synced |
| Online, syncing | Syncing 3 of 7… |
| Offline, queue building | 4 photos waiting — we'll send them when you're back online |
| Offline, idle | Offline. Capture as normal. |
| Sync error | Couldn't reach the server. Tap to retry. |

---

## Inspections — toolbox talks, JHSC, daily pre-task

### Start inspection — picker
**Heading:** What kind of walk?
**Options:**
- Daily pre-task (10–15 min)
- Toolbox talk (15–20 min)
- JHSC monthly (60–90 min)
- Pre-shift safety briefing (5–10 min)
- Incident investigation
- MOL order response
- Custom

### During inspection — checklist screen
**Heading:** *(checklist title, e.g. "Working at Heights — Pre-Task")*
**Item state default:** Not checked
**Item state checked:** ✓ Done
**Item state flagged:** ⚠ Issue — *(prompts photo capture)*
**Item helper, when photo required:** Tap to capture proof.

### Sign-off prompt — workers present
**Heading:** Who was here?
**Sub:** Add or pick workers. Each one signs off.
**Primary button:** Add a worker
**Secondary button:** I was alone

### Sign-off — drawing pad
**Heading:** Sign here.
**Sub:** *(worker name)* — by signing, you confirm you attended this *(inspection type)* on *(date)* at *(site)*.
**Primary button:** Save signature
**Secondary button:** Use PIN instead

### Sign-off — PIN
**Heading:** Enter your PIN.
**Sub:** This stands in for your signature.

### Inspection complete — confirmation
**Heading:** Inspection filed.
**Sub:** Report ready. Send it now or save for later.
**Primary button:** Generate the report
**Secondary button:** Save to drafts

---

## Reports

### Report list — header
**Title:** Reports
**Filter chips:** All · Toolbox · JHSC · Incident · This month

### Empty state
**Heading:** No reports yet.
**Sub:** Run an inspection or summarize a date range — we'll write the report for you.
**Primary button:** Start an inspection
**Secondary button:** Summarize a date range

### Report generation — in progress
**Heading:** Writing your report…
**Sub:** Pulling photos, tags, sign-offs, and your style. About 20 seconds.

### Report generation — complete
**Heading:** Ready to review.
**Sub:** Read it through before sending. Edits are easy.
**Primary button:** Open the PDF
**Secondary button:** Send it

### Report send — multi-recipient
**Heading:** Who needs a copy?
**Sub:** Add as many as you need. We'll track who got it and when they opened it.
**Recipient row helper:** Email · Role *(Owner · JHSC Chair · MOL · Insurer · Client · Other)*
**Primary button:** Send to *(N)* recipients
**Secondary button:** Just download

### Report locked confirmation
**Heading:** Report sent and locked.
**Sub:** This version is now part of your audit trail. If anything changes, OCOS will create v2 and keep this one untouched.
**Primary button:** Done

### Version history
**Heading:** Version history
**Row format:** *Version N · Locked Tue 14 Apr · 09:42 · Sent to 3 recipients*
**Action:** Open

---

## Style Learning (T3 only)

### Empty state
**Heading:** Teach OCOS your voice.
**Sub:** Upload 3 to 10 of your past reports. OCOS will read them and write new reports the same way you do — your tone, your structure, your level of detail.
**Primary button:** Upload a report
**Privacy line:** Your samples stay in your workspace. We don't train AI on your data, and we don't share style across clients.

### Sample uploaded
**Heading:** Got it. Reading the file…
**Sub:** Usually 10–20 seconds.

### Sample ready for review
**Heading:** Sample added.
**Sub:** *(N)* words extracted. Tag it as "Use," "Reference Only," or "Exclude."
**Tag picker:**
- ✓ Use — match this style on future reports
- 👁 Reference only — keep it for context but don't match
- ✗ Exclude — don't read this one

### Style applied confirmation (on report generation)
**Inline chip:** Style: matched against 3 of your past reports

---

## Custom branding (T3 only)

### Setup screen
**Heading:** Your reports, your brand.
**Sub:** Upload your logo and pick your colours. We'll apply them to every PDF.
**Field 1:** Logo *(PNG or SVG, transparent background recommended)*
**Field 2:** Primary colour *(hex)*
**Field 3:** Accent colour *(hex)*
**Field 4:** Company name as it appears on the report
**Field 5:** Footer line *(optional — address, phone, website)*
**Primary button:** Save and preview
**Footer note:** The audit-trail appendix on every report keeps a small "Generated by OCOS" line at the bottom. That's part of the licence and can't be removed.

---

## Errors and edge cases

| Trigger | Headline | Body | Action |
|---|---|---|---|
| Camera permission denied | We need camera access. | Photos are the whole point. Open settings to allow OCOS Field to use your camera. | Open settings |
| Mic permission denied | Mic access is off. | Voice notes won't work, but you can still type. Open settings if you want them back. | Open settings · Continue without |
| GPS off | Location is off. | Photos still capture, but they won't carry GPS evidence. We strongly recommend turning it on. | Turn on location · Continue anyway |
| GPS denied | Location access denied. | OCOS Field needs location to make photos defensible. Open settings to allow it. | Open settings |
| Offline, captured | Saved offline. | We'll upload this photo when you're back on signal. | OK |
| Offline, can't reach API | No signal. | We're working offline. Everything you capture is safe and will sync later. | OK |
| File too large | That photo is huge. | OCOS will compress it down. Original quality is preserved on our side. | Continue |
| Upload failed | Couldn't upload. | We'll try again automatically. If it keeps failing, let us know. | Retry now · Dismiss |
| License expired | Your license is on hold. | Field Compliance is paused. Renew to keep capturing and generating reports. | Renew |
| License doesn't include Field | Field isn't on your plan. | Add Field Compliance to your OCOS subscription to start capturing. | See plans · Talk to us |
| Style sample upload over limit (T3) | You've hit your sample limit. | T3 includes 10 active style samples. Pause one to add another. | Manage samples |
| Trying to edit a locked report | This report is locked. | It's been sent. Want to make changes? OCOS will create v2 and keep this one untouched. | Create v2 · Cancel |
| Trying to delete evidence | Can't delete this photo. | Photos linked to a locked report stay in the audit trail. You can archive it from active views instead. | Archive · Cancel |
| AI summary failed | Couldn't generate the summary. | The photo is saved. You can write a note manually or try the summary again. | Try again · Write manually |
| Style upload — file unsupported | We can't read this file. | Send a PDF, Word document, or plain text. Images of reports won't work yet. | Pick a different file |

---

## Notifications (PWA push, Phase 2 — copy ready)

| Trigger | Title | Body |
|---|---|---|
| Open hazard 24h+ unfixed | Hazard still open at *(site)* | A *(severity)* *(category)* issue logged *(time)* hasn't been resolved. |
| WAH cert expiring | WAH renewal due | *(Worker name)*'s Working at Heights certification expires in *(N)* days. |
| WHMIS refresh due | WHMIS refresh coming up | *(Worker count)* workers are due for WHMIS refresher this month. |
| JHSC monthly walk reminder | JHSC walk due this week | Your monthly inspection at *(site)* hasn't been logged this month. |
| Report opened by recipient | Report opened | *(Recipient)* opened *(report title)* *(time)*. |
| MOL order response deadline | MOL deadline approaching | *(Order ref)* response is due in *(N)* days. |

---

## PDF report — boilerplate copy

### Cover page
- **Header:** *(client logo or NAC logo — left)* — *(report type — right)*
- **Title:** *(report-specific, e.g. "JHSC Monthly Workplace Inspection")*
- **Site:** *(site name)*
- **Date:** *(date range or single date)*
- **Lead:** *(name and role)*
- **Generated:** *(timestamp)*

### Section divider line (under cover)
**Inspection summary**

### Section divider line (after content)
**Photo evidence**

### Section divider line (audit appendix)
**Evidence & Audit Trail**

### Audit appendix preamble (mandatory verbatim)
> The records on this page document the photographic evidence, sign-offs, and regulatory references contained in this report. Each photograph carries a SHA-256 cryptographic hash computed at the moment of upload, before any processing. GPS coordinates and capture timestamps are recorded by the device. The hashes below allow third-party verification of the original evidence.
>
> This document is a record-keeping aid generated by OCOS. It is not legal advice. Operators remain responsible for compliance with the Occupational Health and Safety Act and its regulations.

### Audit appendix footer line (mandatory verbatim, even on white-labelled reports)
> Generated by OCOS — Ontario Compliance Operating System · naturalalternatives.ca

### Verification statement (above the document hash)
> This document was generated by OCOS on behalf of *(licensee company name)*. The document hash below was computed at the moment of locking and corresponds to the bytes of this PDF as delivered.

---

## Marketing copy (one-liners ready to drop into landing pages, emails, ads)

### Headlines
- The compliance camera Ontario contractors actually use.
- Your phone is now your safety binder.
- Photo. Tag. Filed.
- Defensible evidence. Without the binder.
- The MOL-ready paper trail that builds itself.

### Sub-headlines
- Built around the OHSA. Tagged to every section. Time-stamped, GPS-stamped, cryptographically hashed.
- Snap a photo on site. OCOS files it under the right OHSA section, the right O.Reg, the right inspection.
- Less time on paperwork. More time on the job.

### Three-bullet feature list
- **Capture.** Camera, mic, GPS — your phone is the field tool.
- **File.** Every photo tagged to the OHSA section it relates to.
- **Defend.** Cryptographic chain-of-custody on every report.

### Time-saved hook (the headline benefit)
- Monthly JHSC inspection report: ninety minutes becomes eight.
- Toolbox talk record: fifteen minutes becomes two.
- MOL order response file: same day, not next week.

### T3 hook (Style Learning + branding)
- T3 reads three of your past reports and writes new ones in your voice — on your letterhead.
- Standard reports at T2. *Your* reports at T3.

### Trust copy
- We do not train AI models on your compliance data. Your samples stay in your workspace.
- Photos are hashed before processing. Original bytes remain verifiable.

---

*End of copy spec. Ready for Claude Code handoff.*
