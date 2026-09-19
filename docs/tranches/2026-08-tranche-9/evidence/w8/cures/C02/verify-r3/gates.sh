#!/bin/zsh
# T9-W8 C02 round 3 — the verifier's gates, BARE (no pipe to tail: a pipe eats the exit code).
V=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w8/cures/C02/verify-r3
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w8-bake/web/frontend
cd $W
for g in test:unit lint:eslint lint:knip lint:motion lint:copy lint:boundary lint:tdz lint:live-regions typecheck:node typecheck:e2e; do
  out=$V/gate-${g//:/-}.txt
  npm run $g > $out 2>&1
  rc=$?
  echo "GATE $g EXIT=$rc"
  echo "EXIT=$rc" >> $out
done
echo "=== goldens vs :4253 (no --update-snapshots) ==="
PLAYWRIGHT_BASE_URL=http://127.0.0.1:4253 npx playwright test --config playwright-golden.config.ts > $V/goldens-cured.txt 2>&1
rc=$?; echo "GOLDENS EXIT=$rc"
tail -5 $V/goldens-cured.txt
echo "=== surface specs vs :4253, both engines ==="
npx playwright test --config $V/playwright-verify.config.ts theme-bake-freshness filter-census wordmark-integrity theme-quadrants > $V/gate-e2e-surface-cured.txt 2>&1
rc=$?; echo "E2E EXIT=$rc"
tail -6 $V/gate-e2e-surface-cured.txt
echo "GATES COMPLETE"
