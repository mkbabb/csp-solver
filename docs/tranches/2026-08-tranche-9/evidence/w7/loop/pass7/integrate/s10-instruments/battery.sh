#!/bin/bash
cd "$1"
OUT="$2"
: > "$OUT"
run() { local name="$1"; shift; local t0=$(date +%s); "$@" > "$OUT.$name.log" 2>&1; local ec=$?; echo "$name EXIT $ec ($(( $(date +%s)-t0 ))s) :: $(tail -2 "$OUT.$name.log" | tr '\n' ' ' | cut -c1-240)" >> "$OUT"; }
run lint-lanes npm run lint:lanes
run lint-theme-tokens npm run lint:theme-tokens
run lint-sleep npm run lint:sleep
run test-e2e-projects npm run test:e2e:projects
run check-pw-projects node scripts/check-pw-projects.mjs
run lint-tape-foot npm run lint:tape-foot
run lint-copy npm run lint:copy
run check-copy-register node scripts/check-copy-register.mjs
run lint-motion npm run lint:motion
run font-coverage node scripts/check-font-coverage.mjs
run prettier npm run lint
run eslint npx eslint .
echo DONE >> "$OUT"
