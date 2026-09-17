#!/usr/bin/env bash
# run: bash edge-census.sh > edge-census.jsonl
# T9-W8 A3 — read-only HEADs against the LIVE edge (sudoku.babb.dev). Never writes, never deploys.
set -u
BASE=https://sudoku.babb.dev
WASM=$(curl -sS --compressed "$BASE/assets/solver.worker-eJy8PYEB.js" | grep -oE '/assets/[A-Za-z0-9_.-]+\.wasm' | head -1)
ASSETS=$(curl -sS "$BASE/" | grep -oE '(src|href)="/[^"]+"' | sed -E 's/.*="([^"]+)"/\1/' | sort -u)
for p in "/" $ASSETS "$WASM" "/og-card.png"; do
  h=$(curl -sS -I "$BASE$p")
  get() { printf '%s' "$h" | grep -i "^$1:" | head -1 | sed -E 's/^[^:]+: *//' | tr -d '\r"'; }
  printf '{"path":"%s","status":"%s","cache_control":"%s","cf_cache_status":"%s","age":"%s","etag":"%s","content_encoding":"%s","content_length":"%s","content_type":"%s","vary":"%s"}\n' \
    "$p" "$(printf '%s' "$h" | head -1 | tr -d '\r')" "$(get cache-control)" "$(get cf-cache-status)" "$(get age)" "$(get etag)" "$(get content-encoding)" "$(get content-length)" "$(get content-type)" "$(get vary)"
done
