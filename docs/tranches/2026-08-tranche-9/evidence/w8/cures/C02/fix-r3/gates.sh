#!/bin/zsh
# T9-W8 C02 repair round 3 — the gates, BARE (a pipe to tail eats the exit code), each with its
# own exit line. Run from the worktree's web/frontend against the edited source and the served
# cured dist on :4253. The e2e half goes through THIS directory's scratch config, never the
# estate default (which would start :3000).
E=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w8/cures/C02
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w8-bake/web/frontend
cd $W
g() { # $1 = npm script, $2 = out file
  echo "== npm run $1"
  npm run $1 > $E/fix-r3/$2 2>&1
  local x=$?
  echo "EXIT=$x" >> $E/fix-r3/$2
  echo "   exit $x"
}
g test:unit         gate-unit.txt
g lint:eslint       gate-lint-eslint.txt
g lint              gate-lint.txt
g lint:knip         gate-lint-knip.txt
g lint:boundary     gate-lint-boundary.txt
g lint:tdz          gate-lint-tdz.txt
g lint:copy         gate-lint-copy.txt
g lint:live-regions gate-lint-live-regions.txt
g lint:motion       gate-lint-motion.txt
g typecheck:e2e     gate-typecheck-e2e.txt
g typecheck:node    gate-typecheck-node.txt

echo "== goldens vs :4253 (no --update-snapshots)"
PLAYWRIGHT_BASE_URL=http://127.0.0.1:4253 npx playwright test --config playwright-golden.config.ts > $E/fix-r3/goldens-cured.txt 2>&1
echo "EXIT=$?" >> $E/fix-r3/goldens-cured.txt
tail -3 $E/fix-r3/goldens-cured.txt

echo "== surface specs, BOTH engines, vs :4253, scratch config"
PLAYWRIGHT_BASE_URL=http://127.0.0.1:4253 npx playwright test --config $E/fix-r3/playwright-cured.config.ts theme-bake-freshness.spec.ts filter-census.spec.ts wordmark-integrity.spec.ts theme-quadrants.spec.ts > $E/fix-r3/gate-e2e-surface-cured.txt 2>&1
echo "EXIT=$?" >> $E/fix-r3/gate-e2e-surface-cured.txt
tail -3 $E/fix-r3/gate-e2e-surface-cured.txt

echo "GATES COMPLETE"
