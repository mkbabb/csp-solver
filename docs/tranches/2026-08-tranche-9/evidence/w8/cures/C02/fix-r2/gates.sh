#!/bin/zsh
# T9-W8 C02 repair round 2 — the gates, BARE (a pipe to tail eats the exit code), each with its
# own exit line. Run from the worktree's web/frontend against the edited source and the served
# cured dist on :4253.
E=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w8/cures/C02
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w8-bake/web/frontend
cd $W
g() { # $1 = npm script, $2 = out file
  echo "== npm run $1"
  npm run $1 > $E/fix-r2/$2 2>&1
  local x=$?
  echo "EXIT=$x" >> $E/fix-r2/$2
  echo "   exit $x"
}
g test:unit        gate-unit.txt
g lint:eslint      gate-lint-eslint.txt
g lint             gate-lint.txt
g lint:knip        gate-lint-knip.txt
g lint:boundary    gate-lint-boundary.txt
g lint:tdz         gate-lint-tdz.txt
g lint:copy        gate-lint-copy.txt
g lint:live-regions gate-lint-live-regions.txt
g lint:motion      gate-lint-motion.txt
g typecheck:e2e    gate-typecheck-e2e.txt
g typecheck:node   gate-typecheck-node.txt

echo "== goldens vs :4253 (no --update-snapshots)"
PLAYWRIGHT_BASE_URL=http://127.0.0.1:4253 npx playwright test --config playwright-golden.config.ts > $E/fix-r2/goldens-cured.txt 2>&1
echo "EXIT=$?" >> $E/fix-r2/goldens-cured.txt

echo "== built-dist specs, BOTH engines, vs :4253"
PLAYWRIGHT_BASE_URL=http://127.0.0.1:4253 npx playwright test --config playwright-throttle.config.ts > $E/fix-r2/gate-e2e-bakespecs-cured.txt 2>&1
echo "EXIT=$?" >> $E/fix-r2/gate-e2e-bakespecs-cured.txt

echo "GATES COMPLETE"
