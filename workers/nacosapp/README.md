# nacosapp Worker — canonical source & deploy

Production Worker for **naturalalternatives.ca** (account `3eff3eb9a85fbc5b027e51589d5ae634`).
It serves the console pages (`/`, `/dashboard`, `/learning`, `/admin`,
`/nac-os/command-centre`, `/nac-os/billfold`, demo pages), all `/api/*`
endpoints, and — via Workers Static Assets — the static site files
(`/nac-os-app.html` Fleet Logbook, `/pricing.html`, `/pwa/`, `/upgrade/`, …).

## Why the two 404s happened (July 2026 incident)

**Confirmed root cause (verified against the live account on 2026-07-17):
the apex domain lost its attachment to the Worker.** Requests to
naturalalternatives.ca never reach `nacosapp`, so every path 404s.

Evidence:
- The live `nacosapp` script (modified 2026-07-12) DOES contain the
  `/nac-os/command-centre` route — its code is functionally identical to
  `index.js` here, minus the ASSETS/CSP fixes.
- The `nac-command-centre` D1 is healthy: all tables present
  (`draws`, `budget_items`, `draw_line_items`, `settings`, `audit_log`,
  `field_jobs`, `field_scans`), with writes up to **2026-07-06** — the
  Command Centre worked until then.
- DNS for the apex resolves to Cloudflare (not GitHub Pages), so the zone
  is fine; the missing piece is the Worker custom-domain binding.
- The 2026-07-12 `modified_on` shows someone re-deployed the same bundle
  (it is visibly a re-bundle of the identical code) — a plain deploy
  cannot fix this, because it does not re-attach a detached custom domain.

Why this config fixes it:
1. **`/nac-os/command-centre`** — `wrangler.toml` declares
   `pattern = "naturalalternatives.ca", custom_domain = true`, so
   `wrangler deploy` re-attaches the apex to the Worker. Both D1 bindings
   are declared so no deploy can silently drop `CMD_DB` again.
2. **`/nac-os-app.html`** — no version of the Worker ever served the
   static site; even with the domain attached, GitHub-Pages-era files hit
   the JSON 404 fallback. Fixed by bundling the repo's static files as
   Workers Static Assets (`env.ASSETS` fallback in the router).

Secondary hazard (also fixed): the old `nac-os-app.naturalalternatives.ca`
repo carried `wrangler.toml` with `name = "nacosapp"` and v3.0.0 source
(license/lead/admin only, no `CMD_DB`). A deploy from that repo would
overwrite production; it has been renamed to `nacosapp-legacy`.

## Files

| File | Purpose |
|------|---------|
| `index.js` | Worker source (extracted from the deployed bundle `_worker.js`, plus the ASSETS fallback + CSP fix) |
| `wrangler.toml` | Canonical config: both D1 bindings, KV, cron, custom domain, assets |
| `deploy.sh` | Stages repo-root static files into `public/` and runs `wrangler deploy` |
| `public/` | Build output (gitignored) — never edit by hand |

## Pre-deploy checklist (first deploy only)

1. Authenticate: `npx wrangler login` (or set `CLOUDFLARE_API_TOKEN`).
2. `DEMO_CODES` KV namespace id: `deploy.sh` auto-fills it on first run by
   querying the account (`wrangler kv namespace list`, matching a title
   containing "demo") and rewriting `wrangler.toml` — commit that change.
   If lookup fails, fill it in manually, or create the namespace first:
   `npx wrangler kv namespace create DEMO_CODES`. The placeholder fails the
   deploy on purpose so the binding is never silently dropped.
3. Confirm secrets exist (they persist across deploys):
   `npx wrangler secret list` should show `ADMIN_PASSWORD`,
   `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`,
   `FC_INTERNAL_SECRET`.
4. `keep_vars = true` preserves dashboard vars (`FRONTEND_URL`,
   `FC_WORKER_URL`, `OCOS_T1_PRODUCT_ID`, `OCOS_T2_PRODUCT_ID`,
   `OCOS_T3_PRODUCT_ID`, `OCOS_BUNDLE_PRODUCT_ID`) — verify they are present
   in the dashboard under Worker → Settings → Variables before deploying.

## Deploy

```bash
workers/nacosapp/deploy.sh
```

## Post-deploy smoke test

```bash
curl -s https://naturalalternatives.ca/api/health            # {"status":"ok",...}
curl -sI https://naturalalternatives.ca/nac-os/command-centre # 200 text/html
curl -sI https://naturalalternatives.ca/nac-os-app.html       # 200 text/html (Fleet Logbook)
curl -s https://naturalalternatives.ca/api/command-centre/settings | head -c 200
# License validation smoke test (Fleet Logbook):
curl -s -X POST https://naturalalternatives.ca/api/license/validate \
  -H 'Content-Type: application/json' \
  -d '{"license_key":"<known-test-key>"}'
```

## Local dev

```bash
cd workers/nacosapp
./deploy.sh --dry-run 2>/dev/null || true   # or just stage assets manually
npx wrangler dev                             # local D1/KV are empty
```

## ⚠ Never do this

- Do **not** run `wrangler deploy` from the `nac-os-app.naturalalternatives.ca`
  repo — its config has been renamed to `nacosapp-legacy` to prevent exactly
  the outage this package fixes, but old checkouts may still say `nacosapp`.
- Do not edit bindings in the Cloudflare dashboard without mirroring them
  here: the next `wrangler deploy` replaces bindings with this file's contents.
