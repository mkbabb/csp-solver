#!/bin/bash
# ACC-SIX pass-6 pre-return battery (registry-v4 §2.11 + LAWS P5): every gate BARE, its exit captured directly
# (no pipe), in the lane's tree AND in the read-only control tree 74a2b5d9 (node scripts that read only; nothing
# is written to the control; no git in the control). Adds the chair's pass-6 instruments (ONE copy each):
# check-property-block and the cured undefined-token census, and the scoped prettier (`npm run lint`, named).
# usage: p6-battery.sh <outdir>
OUTDIR=$1
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-45/web/frontend
C=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-control/web/frontend
I=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass6/instruments
mkdir -p "$OUTDIR"
run() { name=$1; dir=$2; shift 2; (cd "$dir" && "$@" > "$OUTDIR/$name.log" 2>&1); echo "$name EXIT=$?"; }
for arm in tree control; do
  [ $arm = tree ] && D=$W || D=$C
  run $arm.check-copy-register $D node scripts/check-copy-register.mjs
  run $arm.lint-copy $D node scripts/check-copy-register.mjs --self-test
  run $arm.test-font-coverage $D node scripts/check-font-coverage.mjs --self-test
  run $arm.lint-theme-tokens $D node scripts/check-theme-tokens.mjs --self-test
  run $arm.lint-lanes $D node scripts/check-lane-membership.mjs --self-test
  run $arm.lint-sleep $D node scripts/check-sleep-lint.mjs --self-test
  run $arm.lint-motion $D node scripts/check-motion-contract.mjs --self-test
  run $arm.lint-ink $D node scripts/check-ink-pressure.mjs --self-test
  run $arm.lint-live-regions $D node scripts/check-live-regions.mjs --self-test
  run $arm.lint-theme-selectors $D node scripts/check-theme-selectors.mjs --self-test
  run $arm.test-e2e-projects $D node scripts/check-pw-projects.mjs --self-test
  run $arm.check-pw-projects $D node scripts/check-pw-projects.mjs
  run $arm.check-property-block $D node $I/check-property-block.mjs --fe $D
  run $arm.undefined-token-census $D env FE=$D node $I/undefined-token-census.mjs --self-test
  run $arm.eslint $D npx eslint .
  run $arm.npm-run-lint-scoped-prettier $D npx prettier --check --config .prettierrc.json src/ scripts/ ../../scripts/ ../relay/
  run $arm.vue-tsc-app $D npx vue-tsc --noEmit -p tsconfig.json
  run $arm.vue-tsc-e2e $D npx vue-tsc --noEmit -p tsconfig.e2e.json
  run $arm.knip $D npx knip
done
echo BATTERY-DONE
