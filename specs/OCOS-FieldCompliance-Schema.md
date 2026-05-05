# OCOS Field Compliance Module — Notion Schema Spec

**Version:** v1.1 — adds Style Learning, locked report versions, multi-recipient delivery, custom branding, mandatory audit-trail appendix.
**Brand:** Natural Alternatives → OCOS
**Module ID:** OCOS-FC-001
**Status:** Spec ready for Claude Code implementation
**Pairs with:** `OCOS-RegulatoryTaxonomy.json`

---

## Claude Code prompt (paste this when you start the build)

> Implement Phase 1 of the OCOS Field Compliance module in the existing
> `NAC-G/ontario-compliance-operating-system-` repository.
> Extend the existing `stripe-webhook-worker.js` Cloudflare Worker — do not
> replace it. Use the schema in `OCOS-FieldCompliance-Schema.md` and the
> tagging taxonomy in `OCOS-RegulatoryTaxonomy.json`.
>
> Phase 1 deliverables:
> 1. Seven Notion databases per the schema below, provisioned automatically
>    on T2/T3 license activation (six core + FC-StyleSamples)
> 2. Worker endpoints for photo upload (R2), photo-to-Notion write, PDF
>    report generation, AI summarization, and style-sample ingestion
> 3. License-key gated mobile capture page (PWA, NAC brand system,
>    offline queue via IndexedDB, service worker installable)
> 4. PDF report template with NAC branding and a **mandatory audit-trail
>    appendix** (SHA-256 hashes, GPS, device fingerprint, OHSA mapping)
> 5. **Style Learning** for T3 tier — AI conditions report output on
>    client-uploaded historical samples
> 6. **Locked report versions** — once delivered, regeneration creates v2
> 7. **Multi-recipient delivery** with tracked send history per report
> 8. **Custom branding** for T3 — client logo + accent colour on PDFs
>
> Use NAC brand tokens: `#080A07` `#5EE830` `#E8A830`,
> Bebas Neue / DM Mono / DM Sans. Original copy only — no language lifted
> from any photo-documentation competitor.

---

## Where this lives in your existing Notion

```
IN HOUSE  (300af11add638033b7e1f00747a7f387)
├── T1 Workspace  (300af11add63802a99f2e54df827046a)
├── T2 Workspace  (2fdaf11add63808f8104ca347d88949c)
├── T3 Workspace  (2fdaf11add6380ce8e90e09db23ea7df)
├── Client Licenses DB  (24de07c6-8c01-44f4-aed2-c033c755567a)
└── Field Compliance Module  ← NEW container page
    ├── FC-Sites
    ├── FC-Photos
    ├── FC-Inspections
    ├── FC-Workers
    ├── FC-Reports
    ├── FC-Checklists
    └── FC-StyleSamples  (T3 only)
```

The seven FC-* databases get cloned per-client when a T2 or T3 license activates,
matching how the existing T2/T3 workspaces are provisioned.

---

## Database 1 — `FC-Sites`

The "project" container. One record per active job site or service location.

| Field | Type | Notes |
|---|---|---|
| `Site Name` | Title | e.g. "123 Pitt St — Roof Replace" |
| `Site ID` | Formula → unique | `FC-S-{auto}` |
| `Address` | Rich text | Full street address |
| `Geocode` | Rich text | `lat,lng` set on first photo |
| `Client License` | Relation → Client Licenses DB | Links back to existing DB |
| `Status` | Select | `Active` / `On Hold` / `Closed` / `Archived` |
| `Site Type` | Select | `Residential` / `ICI` / `Roadwork` / `Other` |
| `WAH Site?` | Checkbox | Triggers fall-protection checklist set |
| `JHSC Required?` | Formula | `true` if associated worker count ≥ 20 (OHSA s.9) |
| `Worker Count` | Rollup → FC-Workers | Count of workers on this site |
| `Open Hazards` | Rollup → FC-Photos | Count where `Status = Hazard - Open` |
| `Last Inspection` | Rollup → FC-Inspections | Most recent date |
| `Created` | Created time | |
| `Created By` | Created by | |

---

## Database 2 — `FC-Photos`

The evidence layer. Every captured image becomes one record.

| Field | Type | Notes |
|---|---|---|
| `Caption` | Title | First 80 chars of voice note or AI-generated |
| `Photo` | Files & media | Cloudflare R2 signed URL |
| `Photo ID` | Formula | `FC-P-{auto}` |
| `Site` | Relation → FC-Sites | Required |
| `Captured At` | Date | UTC, set client-side |
| `Captured By` | Relation → FC-Workers | |
| `Geo Lat` | Number | EXIF or GPS API |
| `Geo Lng` | Number | EXIF or GPS API |
| `Device ID` | Rich text | Hashed device fingerprint |
| `Tags` | Multi-select | Driven by `OCOS-RegulatoryTaxonomy.json` |
| `OHSA References` | Formula | Computed from tags |
| `Status` | Select | `Hazard - Open` / `Hazard - Corrected` / `Routine` / `Incident` / `Inspection` |
| `Severity` | Select | `Info` / `Low` / `Med` / `High` / `Critical` |
| `Pair: Before` | Relation → FC-Photos (self) | For before/after pairing |
| `Pair: After` | Relation → FC-Photos (self) | |
| `Voice Note` | Files & media | Optional `.m4a` |
| `AI Summary` | Rich text | Generated from photo + voice note |
| `Annotations` | Rich text | JSON of arrows/circles/text overlays |
| `Inspection` | Relation → FC-Inspections | If captured during a formal inspection |
| `Hash` | Rich text | SHA-256 of original file — chain of custody |

**Chain-of-custody note:** The `Hash` field is critical. On upload, the Worker
computes SHA-256 of the original bytes before any processing. This is what
makes a photo defensible if challenged in an MOL or WSIB matter.

---

## Database 3 — `FC-Inspections`

Formal inspection events: JHSC monthly walks, daily pre-task, toolbox talks,
pre-shift briefings, MOL order responses.

| Field | Type | Notes |
|---|---|---|
| `Inspection Title` | Title | |
| `Inspection ID` | Formula | `FC-I-{auto}` |
| `Type` | Select | `JHSC Monthly` / `Daily Pre-Task` / `Toolbox Talk` / `Pre-Shift` / `Incident Investigation` / `MOL Response` / `Other` |
| `Site` | Relation → FC-Sites | |
| `Date` | Date | |
| `Lead` | Relation → FC-Workers | Inspector / talk leader |
| `Attendees` | Relation → FC-Workers | Multi |
| `Checklist` | Relation → FC-Checklists | The template used |
| `Photos` | Rollup → FC-Photos | |
| `Findings Count` | Rollup → FC-Photos | Where `Status = Hazard - Open` |
| `Signatures` | Files & media | PDFs or images of sign-off page |
| `Topic Reference` | Rich text | OHSA section / OReg cited in talk |
| `Notes` | Rich text | |
| `Report` | Relation → FC-Reports | Generated PDF |
| `Status` | Select | `Draft` / `Complete` / `Submitted` |

---

## Database 4 — `FC-Workers`

Personnel registry per site. Drives sign-offs and competency tracking.

| Field | Type | Notes |
|---|---|---|
| `Name` | Title | |
| `Worker ID` | Formula | `FC-W-{auto}` |
| `Role` | Select | `Worker` / `Supervisor` / `JHSC Member` / `H&S Rep` / `Subcontractor` / `Visitor` |
| `Email` | Email | |
| `Phone` | Phone | |
| `Sites` | Relation → FC-Sites | Multi |
| `WAH Trained?` | Checkbox | OReg 297/13 |
| `WAH Cert Expiry` | Date | 3-yr cycle |
| `WHMIS Trained?` | Checkbox | OReg 860 |
| `WHMIS Refresh Due` | Date | Annual |
| `Other Certs` | Multi-select | `Confined Space` / `Hot Work` / `Trenching` / `Lift Truck` / `First Aid` / etc. |
| `Cert Files` | Files & media | Scanned cards |
| `Sign-off Method` | Select | `Tap` / `Drawn Sig` / `PIN` |
| `Active?` | Checkbox | |

---

## Database 5 — `FC-Reports`

Generated PDF outputs. One record per export. Supports versioning, multi-recipient delivery, lock-once-sent, and per-client branding overrides.

| Field | Type | Notes |
|---|---|---|
| `Report Title` | Title | |
| `Report ID` | Formula | `FC-R-{auto}` |
| `Type` | Select | `Toolbox Talk Record` / `JHSC Inspection` / `Incident Report` / `Daily Log` / `Hazard Summary` / `Custom` |
| `Site` | Relation → FC-Sites | |
| `Inspection` | Relation → FC-Inspections | If applicable |
| `PDF` | Files & media | Generated artifact (current version) |
| `Version` | Number | Starts at 1; increments on regeneration after lock |
| `Parent Report` | Relation → FC-Reports (self) | Links v2+ back to v1 |
| `Generated At` | Created time | |
| `Generated By` | Created by | |
| `Photo Count` | Number | |
| `Date Range Start` | Date | |
| `Date Range End` | Date | |
| `Recipients` | Rich text | JSON array of `{email, role, sent_at, opened_at}` — supports multi-send |
| `Send History` | Rich text | Append-only log of every send event |
| `Sent Via` | Multi-select | `Resend Email` / `Download` / `Link Share` |
| `Locked?` | Checkbox | If `true`, future edits create a v2 instead of overwriting |
| `Locked At` | Date | First-send timestamp |
| `PDF Hash` | Rich text | SHA-256 of the locked PDF — committed audit trail |
| `Style-Conditioned?` | Checkbox | `true` if T3 Style Learning was applied |
| `Style Samples Used` | Relation → FC-StyleSamples | Multi |
| `Branding Profile` | Select | `NAC Default` / `Client Custom` |
| `Audit Appendix Included?` | Checkbox | Required `true` for any locked report |

**Locking behaviour:**
1. Report is generated → `Locked? = false`, editable, regenerable in place.
2. First send (any channel) → Worker computes SHA-256, sets `Locked? = true`, `Locked At = now`, `PDF Hash = <sha256>`.
3. Any subsequent regeneration creates a *new* FC-Reports record with `Version = N+1` and `Parent Report` pointing back. Original is preserved untouched.
4. Notion view filters default to "current version only" but admin view exposes full version history.

---

## Database 6 — `FC-Checklists`

Reusable templates. Phase 1 ships with eight Ontario-specific defaults.

| Field | Type | Notes |
|---|---|---|
| `Checklist Title` | Title | |
| `Checklist ID` | Formula | `FC-CL-{auto}` |
| `Category` | Select | matches taxonomy categories |
| `Items` | Rich text | JSON array of `{id, prompt, type, requires_photo, regulatory_ref}` |
| `Required Frequency` | Select | `Per Task` / `Daily` / `Weekly` / `Monthly` / `Annual` / `Once` |
| `Applies To Site Types` | Multi-select | |
| `Regulatory Anchors` | Multi-select | Pulled from taxonomy |
| `Active?` | Checkbox | |
| `Default?` | Checkbox | Ships with module |

### Phase 1 default checklists (ship eight)

1. **Working at Heights — Pre-Task** (OReg 213/91 s.26 + OReg 297/13)
2. **Ladder Inspection** (CSA Z11)
3. **Scaffold Daily Sign-off** (OReg 213/91 Part III)
4. **Confined Space Entry Permit** (OReg 632/05)
5. **Hot Work Permit** (NFPA 51B + OReg 213/91)
6. **JHSC Monthly Workplace Inspection** (OHSA s.9(26))
7. **Toolbox Talk Record** (OHSA s.25(2)(a) competency)
8. **Incident / Near Miss Report** (OHSA s.51 + WSIB Form 7 prep)

---

## Database 7 — `FC-StyleSamples`  *(T3 only — Style Learning)*

Client-uploaded historical reports used to condition AI-generated output. The model reads matching samples on every report generation so OCOS reports come out sounding like *the client*, not generic compliance boilerplate. **This is the headline T3 differentiator.**

| Field | Type | Notes |
|---|---|---|
| `Sample Title` | Title | e.g. "Smith Bros — JHSC Sept 2024" |
| `Sample ID` | Formula | `FC-SS-{auto}` |
| `Source File` | Files & media | Original PDF/DOCX/TXT upload |
| `Extracted Text` | Rich text | Plain text extracted on upload (parsed by Worker) |
| `Word Count` | Number | Computed |
| `Report Type` | Select | Same enum as FC-Reports `Type` — used for matching |
| `Site Type` | Multi-select | `Residential` / `ICI` / `Roadwork` / `All` — narrows matching |
| `Quality Score` | Select | `Use` / `Reference Only` / `Exclude` — admin curation |
| `Voice Notes` | Rich text | Optional admin annotations: tone, vocabulary preferences |
| `Active?` | Checkbox | If `false`, excluded from prompt context |
| `Uploaded At` | Created time | |
| `Times Used` | Number | Incremented on every report generation that includes it |

**Selection logic on report generation:**
1. Filter by `Report Type` match.
2. Narrow by `Site Type` overlap with current site.
3. Where `Active? = true` and `Quality Score = Use`.
4. Pick top 3 by `Times Used` ascending (keeps style fresh, prevents over-fitting to one sample).
5. Inject extracted text into system prompt with framing: *"The following are examples of how this organisation writes reports of this type. Match the tone, structure, vocabulary, and level of detail."*

**Caps (T3):** 10 active samples max. Total combined token count ≤ 40k for prompt budget. If exceeded, truncate longest sample first.

**Privacy:** Samples are stored in client's own provisioned Notion workspace + their R2 prefix. **OCOS does not pool style data across clients.** This is also a marketing line.

---

## Audit-Trail Appendix (mandatory on every locked PDF)

Every locked report PDF **must** include a final-page appendix titled **"Evidence & Audit Trail"** containing:

| Section | Contents |
|---|---|
| Report metadata | `Report ID`, `Version`, `Generated At`, `Generated By`, `License ID` (truncated) |
| Site metadata | `Site ID`, `Site Name`, `Geocode`, `Site Type` |
| Photo manifest | One row per photo: `Photo ID`, captured timestamp (UTC + local), GPS lat/lng (5 decimal places), device fingerprint hash (truncated), SHA-256 of original bytes (full), tags applied, OHSA references derived |
| Sign-off manifest | Each signature: `Worker ID`, role, sign-off method, timestamp, IP truncated to /24 |
| Regulatory anchors | Every OHSA section, O.Reg, and standard cited in this report, listed once with full citation |
| Document hash | SHA-256 of the PDF itself (computed at lock time) |
| Verification statement | Plain-language footer: "This document was generated by OCOS on behalf of [Licensee]. Photo and signature evidence carry SHA-256 cryptographic hashes verifiable on request. This document is not legal advice." |

**Why this matters:** This is the moat. CompanyCam, Guild AI, and most compliance SaaS competitors don't print cryptographic chain-of-custody on the document itself. For an MOL inspector, WSIB adjudicator, or insurance defence lawyer, this appendix is the difference between "useful" and "admissible."

---

## Custom Branding (T3 only)

T3 clients may override default NAC branding on their PDFs. Stored as part of the license record (extension to Client Licenses DB):

| Field | Type | Notes |
|---|---|---|
| `Branding: Logo` | Files & media | PNG/SVG, transparent bg recommended |
| `Branding: Primary Colour` | Rich text | Hex, e.g. `#0A2540` |
| `Branding: Accent Colour` | Rich text | Hex |
| `Branding: Company Name` | Rich text | As it should appear on PDF header |
| `Branding: Footer Line` | Rich text | Optional address/contact line |

**Hard rule:** Even with custom branding, the audit-trail appendix retains a "Generated by OCOS" attribution line at the bottom. This is non-negotiable — it's the licence terms, not optional white-label.

---

## Cloudflare Worker endpoints to add

Recommend a sibling worker `field-compliance-worker.js` routed at `/fc/*` rather than extending `stripe-webhook-worker.js`. Cleaner separation, easier to deploy independently, keeps the webhook path low-risk.

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/fc/photo` | Receive photo + metadata, hash, write to R2, create FC-Photos record |
| `GET`  | `/fc/site/:id` | Fetch site dossier (sites + recent photos + open hazards) |
| `POST` | `/fc/inspection` | Create FC-Inspections record |
| `POST` | `/fc/inspection/:id/signoff` | Append signature to inspection |
| `POST` | `/fc/report/generate` | Generate PDF, write FC-Reports, return signed URL |
| `POST` | `/fc/report/:id/lock` | Compute SHA-256, set `Locked? = true`, freeze version |
| `POST` | `/fc/report/:id/send` | Multi-recipient send via Resend, append to `Send History` |
| `POST` | `/fc/report/:id/regenerate` | Creates v2 (parent linked) — only allowed if locked |
| `GET`  | `/fc/report/:id/versions` | List version history |
| `GET`  | `/fc/checklist/:id` | Fetch checklist template |
| `POST` | `/fc/ai/summarize` | Photo + voice → AI summary (Anthropic API, Haiku 4.5) |
| `POST` | `/fc/style/upload` | T3 only. Accept PDF/DOCX/TXT, extract text, store FC-StyleSamples record |
| `GET`  | `/fc/style/list` | T3 only. List active style samples for license |
| `DELETE` | `/fc/style/:id` | T3 only. Soft-delete (sets `Active? = false`) |

**Model split:**
- `/fc/ai/summarize` → `claude-haiku-4-5-20251001` (fast, cheap, summaries are short)
- `/fc/report/generate` → `claude-sonnet-4-6` when style samples are in context (better long-context instruction following), Haiku otherwise

**Auth:** All `/fc/*` endpoints require the existing OCOS license-key header
(`X-OCOS-License`). Reuse the validator already in the webhook worker.

**Storage:**
- Photos → R2 bucket `ocos-fc-photos`
- Voice notes → R2 bucket `ocos-fc-voice`
- Generated PDFs → R2 bucket `ocos-fc-reports`
- Style samples (originals) → R2 bucket `ocos-fc-style`

**Bucket key convention:** `{license_id}/{site_id}/{photo_id}.{ext}` (style samples: `{license_id}/style/{sample_id}.{ext}`)

---

## License tier mapping (updated)

| OCOS Tier | Field Compliance access |
|---|---|
| **T1** ($497) | View-only sample workspace; upgrade prompt |
| **T2** ($797) | Full module, 2 sites, 5 workers, unlimited photos, NAC-branded PDFs, audit-trail appendix |
| **T3** ($1,297) | Everything in T2 + unlimited sites/workers + **Style Learning** (10 samples) + **custom branding** + multi-recipient send + version history |
| **Compliance Operations Toolkit Add-on** ($247) | Adds 8 default checklists + JHSC dashboard to T2 + **5 style sample slots** (T2-only style preview, upgrade lever to T3) |

The **Style Learning + custom branding combination** is what makes T3 feel "elite." A buyer can clearly see the upgrade path: standard reports at T2, *your* reports on *your* letterhead at T3.

---

## What ships in Phase 1 vs deferred

**Phase 1 (build now):**
- All 7 databases (incl. FC-StyleSamples for T3)
- All 14 Worker endpoints
- License-gated mobile capture page (PWA, IndexedDB offline queue, service worker)
- 8 default checklists
- 3 PDF report templates: Toolbox Talk, JHSC Inspection, Incident
- AI photo summary (Haiku 4.5) and AI report generation (Sonnet 4.6 with style)
- Mandatory audit-trail appendix on every locked PDF
- Locked report versioning + multi-recipient send + send history
- Custom branding for T3
- NAC-branded sign-off page

**Phase 2 (later):**
- LiDAR measurements (iOS-only, defer until v2)
- Project QR codes
- Subcontractor guest access
- Tap-to-Pay style payment collection
- Multi-language (FR-CA) — high value in Cornwall corridor
- Real-time multi-user editing
- Push notifications

---

## Implementation Corrections (v1.1 supplement — post-audit, 2026-05-05)

Five corrections against spec assumptions, confirmed by auditing the live
Cloudflare Worker (`nacosapp`) and Notion workspace:

**1. Provisioning architecture**
`provisionNotionWorkspace()` does not exist in `nacosapp`. Notion workspace
fulfillment is currently manual. For Phase 1:
- `field-compliance-worker.js` owns all Notion provisioning (`lib/notion.js`).
- `nacosapp` gets one 5-line hook in `handleStripeWebhook()` that calls the
  FC worker's `POST /fc/provision` on `checkout.session.completed` when the
  purchased product includes Field Compliance.
- `stripe-webhook-worker.js` in all spec references means the deployed worker
  named `nacosapp`; its source lives at `workers/nacosapp/` in this repo.

**2. License validation — dual-layer**
`nacosapp` validates licenses against a D1 `licenses` table, not the Notion
`Client Licenses` DB. The `X-OCOS-License` header expected by all `/fc/*`
endpoints is validated by `lib/auth.js` using the same D1 table (binding
`env.DB`). The Notion `Client Licenses` DB is used for branding/provisioning
metadata only, not for live request auth.

**3. Client Licenses DB — branding columns do not exist yet**
The five branding fields (`Branding: Logo`, `Branding: Primary Colour`,
`Branding: Accent Colour`, `Branding: Company Name`, `Branding: Footer Line`)
are absent from the live Notion DB. `lib/notion.js` must add them on first
FC provision via Notion API (idempotent — read schema, add only if missing).

**4. FC Module page — does not exist yet**
No "Field Compliance Module" container page exists under IN HOUSE. The
provisioning flow auto-creates it on first invocation as a child of
`300af11add638033b7e1f00747a7f387` (IN HOUSE). Subsequent provisions skip
creation if the page already exists (look up by title before creating).

**5. File tree — actual structure**
```
workers/
  nacosapp/          ← existing source (committed 2026-05-05)
  field-compliance-worker.js   ← NEW
  wrangler.toml      ← NEW (FC worker config + R2/D1/secrets bindings)
  lib/               ← NEW (shared by FC worker only)
pwa/                 ← NEW (field.naturalalternatives.ca, single Pages project)
specs/               ← existing
```

---

## Notes for Claude Code

- The `nacosapp` worker (`workers/nacosapp/`) handles Stripe webhooks and
  D1-based license management. Add a single 5-line call to the FC provisioning
  endpoint inside `handleStripeWebhook()` when Field Compliance is in the
  purchase. Do not touch anything else in that file.
  FC-StyleSamples is provisioned but hidden in the workspace UI for T2 clients.
- Use the existing Resend integration. `/fc/report/:id/send` should support
  an array of recipients in a single call and append each send to `Send History`.
- The Generator Update Log pattern from T2 should be replicated for FC —
  each version of the regulatory taxonomy gets logged.
- Style sample text extraction: `pdf-parse` for PDFs, `mammoth` for DOCX,
  raw read for TXT/MD. All run fine in a Cloudflare Worker.
- PDF generation: recommend `@pdf-lib/pdf-lib` for the layout + audit-trail
  appendix. Pure JS, Worker-compatible.
- Hash everything at the right moment: photo bytes on upload (before any
  transform), PDF bytes on lock (after final render). Store hashes in
  hex format, lowercase, no separators.
- Test fixtures (Phase 1.1):
  - 1 site, 2 workers, 5 photos with mixed tags, 1 toolbox talk,
  - 1 unlocked report (regenerable), 1 locked report (versioned),
  - 1 v2 report linked to a v1 parent,
  - 3 style samples (T3 path), 1 inactive sample,
  - 1 multi-recipient send with 3 recipients tracked in Send History,
  - 1 PDF with mandatory audit-trail appendix verified end-to-end (hash on
    appendix matches hash on FC-Reports record).
- Branding: T2 uses NAC defaults; T3 reads branding fields from Client
  Licenses DB and falls back to NAC defaults if any field missing.
- **Hard rule the Worker must enforce:** Every locked PDF must include the
  audit-trail appendix. If appendix generation fails, abort the lock —
  do not produce a locked PDF without the appendix. This is the moat.

---

# APPENDIX A — Phase 3 (PARKED) — Toolbox Talk Studio

> **Status: PARKED. Do not build in this Claude Code session.**
> This appendix is captured here so the design intent is preserved across
> future planning sessions. Claude Code should ignore this section when
> implementing Phase 1. Revisit only after: (a) Field Compliance Phase 1
> is shipped and stable, (b) ≥10 paying T2/T3 customers active, and
> (c) Maren Kyra is past the Day 14 warm-up and producing engagement.

## Concept

A T3 add-on (or standalone OCOS module) that generates short, narrated,
site-specific compliance training videos — toolbox talks, WAH briefings,
JHSC monthly summaries, incident debriefs, new-hire site orientations —
using OCOS's own data (regulatory taxonomy, site photos, course content)
and an AI presenter avatar.

The differentiator: every other AI video tool generates *generic* training.
OCOS Toolbox Talk Studio generates videos with *the actual hazard, on the
actual site, captured an hour ago,* tagged to the actual OHSA section.

## What it borrows (mechanic, not IP)

- Document → script → narrated video pipeline
- Script-edit → regenerate workflow (no re-recording when regulations change)
- Brand-kit consistency across video library
- Multilingual one-click (priority: EN-CA, FR-CA for Cornwall–Ottawa corridor)
- Inline knowledge checks (acknowledgement = OHSA s.25(2)(a) competency proof)
- Per-video analytics (drop-off rate per scene → which topics confuse workers)

## What it does not build

- Avatar generation tech (lip-sync, voice cloning, rendering) — integrate via
  API or reuse the Maren Kyra production pipeline
- Generic-purpose video editing UI — out of scope, defeats the moat

## Inputs

- Topic (free text or chosen from taxonomy category)
- Site (FC-Sites record) → pulls 2–5 most recent relevant photos
- OHSA / O.Reg anchors (from FC-RegulatoryTaxonomy)
- Audience (worker / supervisor / sub / orientation / JHSC member)
- Language (EN-CA default, FR-CA toggle, others Phase 4)
- Presenter avatar (NAC default avatar, Maren Kyra, or T3+ custom)
- Length target (2 min default, 4 min max for toolbox talks)

## Outputs

- MP4 video file (R2-hosted, signed URL)
- Auto-generated transcript (caption file + searchable text)
- Inline acknowledgement checkpoints (worker taps to confirm understanding)
- Sign-off log written back to FC-Inspections (treated as a Toolbox Talk
  inspection record — fully integrated with existing audit trail)
- Analytics dashboard: views, completion rate, per-scene drop-off, ack rate

## Proposed databases

| Database | Purpose |
|---|---|
| `FC-VideoScripts` | Generated scripts, scene breakdowns, regulatory anchors per scene |
| `FC-Videos` | Rendered MP4s, hashes, language variants, version lineage |
| `FC-VideoSessions` | Per-worker viewing sessions: started, completed, scene drop-off, ack timestamps |
| `FC-AvatarProfiles` | Available presenters per license tier (NAC default / Maren Kyra / custom) |

## Proposed Worker endpoints

```
POST /fc/video/script          Generate script from topic + site + taxonomy
POST /fc/video/render          Send script to avatar API, store MP4
POST /fc/video/translate       Generate language variant
GET  /fc/video/:id             Fetch metadata + signed URL
POST /fc/video/:id/session     Start a viewing session for a worker
POST /fc/video/:id/ack         Record scene acknowledgement
GET  /fc/video/:id/analytics   View counts, completion, drop-off
```

## Tier mapping (proposed)

| Tier | Toolbox Talk Studio access |
|---|---|
| T2 | Locked. Upgrade prompt. |
| T3 | 5 videos/month, NAC default avatar, EN-CA only |
| **Toolbox Talk Studio Add-on** ($497/mo) | Unlimited videos, all avatars, EN-CA + FR-CA, custom client avatar, full analytics |

## Avatar / rendering integration options

Three paths, ranked by build cost vs. control:

1. **Reuse Maren Kyra production pipeline.** If Maren is already rendering
   video (not just stills), adapt the rig to drive scripted compliance
   content. Lowest variable cost. Requires Maren pipeline to be
   video-capable, which is a separate decision tree.

2. **Integrate a third-party avatar API** (HeyGen, Synthesia API,
   D-ID, or similar). Pay per render. Fastest path to ship. Subject
   to per-video unit economics — likely $1–$10 per render at OCOS lengths.
   Verify pricing and whether their TOS permits compliance/safety content
   at the time of build.

3. **Self-host an open-source avatar stack** (e.g. Wav2Lip + voice clone +
   custom rendering). Highest control, highest engineering load, defer
   until volume justifies it.

Decision: **Option 1 if Maren Kyra is video-ready by Phase 3 trigger,
otherwise Option 2 with a clear unit-economics threshold to migrate to
Option 1 or 3.**

## Hard rules carried forward from Phase 1

- Every rendered video gets a SHA-256 hash committed at lock time
- Acknowledgement events are append-only (cannot be edited or deleted)
- Audit-trail appendix in PDF reports must reference any video toolbox
  talks delivered in the reporting period (video ID, hash, ack count)
- Original copy only — no language lifted from any video-SOP competitor
- "Generated by OCOS" attribution preserved on every video footer

## Phase 3 entry checklist (revisit when triggers met)

- [ ] Field Compliance Phase 1 shipped and ≥10 paying customers active
- [ ] Maren Kyra past warm-up and producing measurable engagement
- [ ] Avatar pipeline decision made (Option 1, 2, or 3)
- [ ] Per-video unit economics modeled at expected volume
- [ ] FR-CA translation quality validated against a test compliance script
- [ ] Acknowledgement → FC-Inspections integration designed
- [ ] Pricing for Studio Add-on validated with 3+ existing customers

---

*End of Appendix A. PARKED — do not implement in current build.*

---

*End of spec v1.1. Pairs with `OCOS-RegulatoryTaxonomy.json` and `OCOS-AppCopy.md`.*
