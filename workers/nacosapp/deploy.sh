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
npx wrangler deploy
