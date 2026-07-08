# nacosapp Worker — canonical source & deploy

Production Worker for **naturalalternatives.ca** (account `3eff3eb9a85fbc5b027e51589d5ae634`).
It serves the console pages (`/`, `/dashboard`, `/learning`, `/admin`,
`/nac-os/command-centre`, `/nac-os/billfold`, demo pages), all `/api/*`
endpoints, and — via Workers Static Assets — the static site files
(`/nac-os-app.html` Fleet Logbook, `/pricing.html`, `/pwa/`, `/upgrade/`, …).

## Why the two 404s happened (July 2026 incident)

1. **`/nac-os/command-centre` → 404** — the Worker running in production did
   not have the Command Centre routes. The old
   `nac-os-app.naturalalternatives.ca` repo still carries
   `wrangler.toml` with `name = "nacosapp"` pointing at its v3.0.0 worker
   source (license/lead/admin only). A `wrangler deploy` from that repo
   overwrites this Worker and silently drops the `CMD_DB` (nac-command-centre
   D1) binding, killing the Command Centre page and its panel APIs
   (`/api/command-centre/draws|budget|settings|lock|sync`).
2. **`/nac-os-app.html` → 404** — no version of the Worker ever served the
   static site. Since the apex domain became a Worker custom domain, requests
   for GitHub-Pages-era files stopped reaching any static host and hit the
   Worker's JSON 404 fallback. Fixed by bundling the repo's static files as
   Workers Static Assets (`env.ASSETS` fallback in the router).

## Files

| File | Purpose |
|------|---------|
| `index.js` | Worker source (extracted from the deployed bundle `_worker.js`, plus the ASSETS fallback + CSP fix) |
| `wrangler.toml` | Canonical config: both D1 bindings, KV, cron, custom domain, assets |
| `deploy.sh` | Stages repo-root static files into `public/` and runs `wrangler deploy` |
| `public/` | Build output (gitignored) — never edit by hand |

## Pre-deploy checklist (first deploy only)

1. Authenticate: `npx wrangler login` (or set `CLOUDFLARE_API_TOKEN`).
2. Fill in the `DEMO_CODES` KV namespace id in `wrangler.toml`:
   `npx wrangler kv namespace list` → copy the id for the demo-codes
   namespace. The placeholder fails the deploy on purpose so the binding is
   never silently dropped. (If the namespace was never created:
   `npx wrangler kv namespace create DEMO_CODES`.)
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
