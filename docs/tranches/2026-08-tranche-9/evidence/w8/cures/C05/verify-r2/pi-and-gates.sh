#!/bin/sh
# T9-W8 C05 — NON-AUTHOR VERIFIER, ROUND 2. pi and the gates, my own run, on HEAD da33cb8e.
# BARE (a pipe to tail eats the exit code); each block prints its own exit code.
# RUN from the worktree's web/frontend, with the cured dist served on :4253.
set -u
EV=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w8/cures/C05
V=$EV/verify-r2

out=$(PLAYWRIGHT_BASE_URL=http://127.0.0.1:4253 npx playwright test --config playwright-golden.config.ts 2>&1)
code=$?
printf '===== goldens (no --update-snapshots) => EXIT %s =====\n%s\n' "$code" "$out" >"$V/golden.txt"

out=$(PLAYWRIGHT_BASE_URL=http://127.0.0.1:4253 npx playwright test --config playwright-throttle.config.ts \
  --project=filter-census-chromium --project=filter-census-webkit --project=wordmark-webkit \
  --project=theme-bake-chromium --project=theme-bake-webkit 2>&1)
code=$?
printf '===== pi surface (built-dist config, external preview :4253) => EXIT %s =====\n%s\n' \
  "$code" "$out" >"$V/e2e-bake-surface.txt"

out=$(npx playwright test --config "$V/playwright-verify-r2.config.ts" \
  e2e/gallery.spec.ts e2e/gallery-deal.spec.ts e2e/gallery-guard.spec.ts e2e/spoken-gallery.spec.ts \
  e2e/masthead-alignment.spec.ts 2>&1)
code=$?
printf '===== e2e surface (gallery + masthead, both engines, cured dist :4253) => EXIT %s =====\n%s\n' \
  "$code" "$out" >"$V/e2e-surface.txt"

: >"$V/gates.txt"
for g in test:unit lint:eslint lint:knip lint:motion lint:boundary lint:tdz lint:copy typecheck:node; do
  out=$(npm run "$g" 2>&1)
  code=$?
  printf '\n===== npm run %s => EXIT %s =====\n' "$g" "$code" >>"$V/gates.txt"
  printf '%s\n' "$out" | tail -14 >>"$V/gates.txt"
done
echo "ALL DONE"
