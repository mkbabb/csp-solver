#!/bin/sh
# T9-W8 C05 REPAIR ROUND 1 — pi and the gates, re-run on the fix commit's tree.
# BARE (a pipe to tail eats the exit code); each block prints its own exit code.
# RUN from the worktree's web/frontend, with the cured dist served on :4253.
set -u
EV=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w8/cures/C05
F=$EV/fix-r1

out=$(PLAYWRIGHT_BASE_URL=http://127.0.0.1:4253 npx playwright test --config playwright-golden.config.ts 2>&1)
code=$?
printf '===== goldens (no --update-snapshots) => EXIT %s =====\n%s\n' "$code" "$out" >"$F/golden.txt"

# The three specs that assert over the BUILT dist ride their own config, and `playwright-c05`
# testIgnores them by design. PLAYWRIGHT_BASE_URL suppresses that config's build+preview and
# points it at the cured arm already being served.
out=$(PLAYWRIGHT_BASE_URL=http://127.0.0.1:4253 npx playwright test --config playwright-throttle.config.ts \
  --project=filter-census-chromium --project=filter-census-webkit --project=wordmark-webkit \
  --project=theme-bake-chromium --project=theme-bake-webkit 2>&1)
code=$?
printf '===== pi surface (built-dist config, external preview :4253): filter-census + wordmark-integrity + theme-bake-freshness => EXIT %s =====\n%s\n' \
  "$code" "$out" >"$F/e2e-bake-surface.txt"

out=$(npx playwright test --config "$EV/playwright-c05.config.ts" \
  e2e/gallery.spec.ts e2e/gallery-deal.spec.ts e2e/gallery-guard.spec.ts e2e/spoken-gallery.spec.ts \
  e2e/masthead-alignment.spec.ts 2>&1)
code=$?
printf '===== e2e surface (gallery + masthead, both engines) => EXIT %s =====\n%s\n' \
  "$code" "$out" >"$F/e2e-surface.txt"

: >"$F/gates.txt"
for g in test:unit lint:eslint lint lint:knip lint:boundary lint:tdz lint:copy lint:live-regions lint:motion typecheck:e2e typecheck:node; do
  out=$(npm run "$g" 2>&1)
  code=$?
  printf '\n===== npm run %s => EXIT %s =====\n' "$g" "$code" >>"$F/gates.txt"
  printf '%s\n' "$out" | tail -14 >>"$F/gates.txt"
done
echo "ALL DONE"
