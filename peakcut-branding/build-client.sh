#!/bin/bash
# Public, credential-free build steps for the modified community client.
# Run from the repository root with Node 24, pnpm 11.3.0, Python 3 and Pillow.
set -euo pipefail
python3 peakcut-branding/render_icons.py
pnpm install --frozen-lockfile
node scripts/check-community-entry.cjs
pnpm --filter stoat.js build
pnpm --filter solid-livekit-components build
pnpm --filter client exec lingui compile --typescript
pnpm --filter client exec node scripts/copyAssets.mjs
pnpm --filter client exec panda codegen
pnpm --filter client exec lingui extract
pnpm --filter client exec lingui compile --typescript
export VITE_HOST=${VITE_HOST:-chat.peakcut.ai}
export VITE_API_URL=${VITE_API_URL:-https://chat.peakcut.ai/api}
export VITE_DEV_GIFBOX_URL=${VITE_DEV_GIFBOX_URL:-https://chat.peakcut.ai/gifbox}
NODE_OPTIONS=--max-old-space-size=4096 pnpm --filter client exec vite build
