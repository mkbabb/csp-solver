#!/bin/bash
# PLR-SELF pass-5 pre-return battery: each gate BARE (exit code unpiped), tree then control.
T=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-p4-PLR-SELF/web/frontend
C=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-control/web/frontend
L=$1
gate() { # name, both(1/0), command...
  local name=$1 both=$2; shift 2
  (cd $T && "$@" > $L/tree-$name.log 2>&1); local t=$?
  local c="—"
  if [ "$both" = 1 ]; then (cd $C && "$@" > $L/ctrl-$name.log 2>&1); c=$?; fi
  echo "$name tree=$t control=$c"
}
gate lint-sleep 1 node scripts/check-sleep-lint.mjs --self-test
gate lint-lanes 1 node scripts/check-lane-membership.mjs --self-test
gate lint-theme-tokens 1 node scripts/check-theme-tokens.mjs --self-test
gate test-e2e-projects 1 node scripts/check-pw-projects.mjs --self-test
gate check-pw-projects 1 node scripts/check-pw-projects.mjs
gate eslint 1 npx eslint .
gate prettier 1 npx prettier --check --config .prettierrc.json src/ scripts/ ../../scripts/ ../relay/
gate lint-copy 1 node scripts/check-copy-register.mjs --self-test
gate font-coverage 1 node scripts/check-font-coverage.mjs
gate lint-motion 1 node scripts/check-motion-contract.mjs --self-test
gate lint-live-regions 1 node scripts/check-live-regions.mjs --self-test
gate lint-knip 1 npx knip
gate lint-boundary 1 npx eslint --no-config-lookup --config eslint.boundary.config.js src/games
gate lint-ink 1 node scripts/check-ink-pressure.mjs --self-test
gate lint-catch 1 node scripts/check-empty-catch.mjs --self-test
gate lint-theme-selectors 1 node scripts/check-theme-selectors.mjs --self-test
gate lint-tdz 1 node scripts/tdz-probe.mjs --self-test
gate vue-tsc-b 0 npx vue-tsc -b
gate typecheck-e2e 0 npx vue-tsc --noEmit -p tsconfig.e2e.json
echo BATTERY-DONE
