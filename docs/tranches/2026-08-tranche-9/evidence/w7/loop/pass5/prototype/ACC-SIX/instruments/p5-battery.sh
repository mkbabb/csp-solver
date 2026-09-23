#!/bin/sh
# ACC-SIX pass-5 pre-return battery (registry-v4 §2.11): every gate BARE, its exit code captured
# directly (no pipe), in the lane's tree AND in the read-only control tree 74a2b5d9 (only node
# scripts that read; nothing is written to the control). Output of each run goes to OUTDIR.
OUTDIR=$1
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-45/web/frontend
C=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-control/web/frontend
mkdir -p "$OUTDIR"
run() { # name, dir, cmd...
  name=$1; dir=$2; shift 2
  (cd "$dir" && "$@" > "$OUTDIR/$name.log" 2>&1); echo "$name EXIT=$?"
}
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
  run $arm.eslint $D npx eslint .
  run $arm.prettier $D npx prettier --check --config .prettierrc.json src/ scripts/ ../../scripts/ ../relay/
done
echo BATTERY-DONE
