#!/usr/bin/env bash
# Stage the static site into ./public, then deploy the nacosapp Worker.
# Run from anywhere: workers/nacosapp/deploy.sh
set -euo pipefail
cd "$(dirname "$0")"

SITE_ROOT="$(git rev-parse --show-toplevel)"

rm -rf public
mkdir -p public

# Repo-root static files (marketing pages, Fleet Logbook app, styles, assets)
cp "$SITE_ROOT"/*.html "$SITE_ROOT"/*.css "$SITE_ROOT"/*.png "$SITE_ROOT"/*.pdf public/
cp "$SITE_ROOT"/_headers public/ 2>/dev/null || true

# Static sub-apps
for dir in pwa upgrade course-portal; do
  [ -d "$SITE_ROOT/$dir" ] && cp -r "$SITE_ROOT/$dir" public/
done

echo "Staged $(find public -type f | wc -l) static files into public/"

# First deploy only: auto-fill the DEMO_CODES KV namespace id from the account
if grep -q "REPLACE_WITH_DEMO_CODES_NAMESPACE_ID" wrangler.toml; then
  echo "Looking up DEMO_CODES KV namespace id..."
  KV_ID=$(npx wrangler kv namespace list 2>/dev/null | node -e '
    let s = "";
    process.stdin.on("data", d => s += d).on("end", () => {
      try {
        const ns = JSON.parse(s).find(n => /demo/i.test(n.title));
        if (ns) console.log(ns.id);
      } catch {}
    });')
  if [ -z "${KV_ID:-}" ]; then
    echo "ERROR: could not find a KV namespace with 'demo' in its title."
    echo "Run 'npx wrangler kv namespace list' and paste the id into wrangler.toml,"
    echo "or create it first: npx wrangler kv namespace create DEMO_CODES"
    exit 1
  fi
  sed -i.bak "s/REPLACE_WITH_DEMO_CODES_NAMESPACE_ID/$KV_ID/" wrangler.toml
  rm -f wrangler.toml.bak
  echo "Filled DEMO_CODES KV namespace id: $KV_ID (commit this wrangler.toml change)"
fi

npx wrangler deploy
