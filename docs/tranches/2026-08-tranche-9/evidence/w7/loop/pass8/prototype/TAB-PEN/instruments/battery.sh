#!/usr/bin/env bash
# TAB-PEN pass 8 pre-return battery: each gate BARE (exit unpiped, output to its own log), on the tree
# archive (1d0dc4fd + the draft bank) and on main's archive (1d0dc4fd, the waiver's base).
# No deletes; no set -e. usage: bash battery.sh <label> <archive web/frontend dir> <out dir>
LABEL="$1"; FE="$2"; OUT="$3"
mkdir -p "$OUT"
cd "$FE" || exit 9
row() {
  local name="$1"; shift
  "$@" > "$OUT/$LABEL-$name.log" 2>&1
  local code=$?
  echo "$LABEL $name $code" | tee -a "$OUT/$LABEL-exits.txt"
}
echo "$LABEL start $(date +%T) load $(uptime | sed 's/.*averages: //')" >> "$OUT/$LABEL-exits.txt"
row lint-favicon npm run --silent lint:favicon
row lint-lanes npm run --silent lint:lanes
row lint-theme-tokens npm run --silent lint:theme-tokens
row lint-sleep npm run --silent lint:sleep
row lint-motion npm run --silent lint:motion
row lint-theme-selectors npm run --silent lint:theme-selectors
row lint-catch npm run --silent lint:catch
row lint-ink npm run --silent lint:ink
row lint-copy npm run --silent lint:copy
row check-copy-register-bare node scripts/check-copy-register.mjs
row test-e2e-projects npm run --silent test:e2e:projects
row eslint-max0 npx eslint . --max-warnings 0
row prettier-npm-lint npm run --silent lint
row knip npm run --silent lint:knip
row typecheck-node npm run --silent typecheck:node
row typecheck-e2e npm run --silent typecheck:e2e
row vue-tsc-b npx vue-tsc -b
row shape-census-selftest node scripts/shape-census.mjs --self-test
echo "$LABEL end $(date +%T) load $(uptime | sed 's/.*averages: //')" >> "$OUT/$LABEL-exits.txt"
echo "BATTERY DONE $LABEL" >> "$OUT/$LABEL-exits.txt"
