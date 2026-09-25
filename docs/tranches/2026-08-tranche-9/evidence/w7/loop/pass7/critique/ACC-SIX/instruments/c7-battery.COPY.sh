#!/bin/bash
# ACC-SIX pass-7 CRITIC COPY of the lane's battery.sh: control = a fresh git archive of 74a2b5d9 (acc6crit7-base74), dist = the critic's own build, logs re-pointed
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad
I6=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass6/instruments
T=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-45/web/frontend
C=$S/acc6crit7-base74/web/frontend
O=$S/acc6crit7-logs/battery; mkdir -p $O
g() { local name=$1; shift; local rt rc
  (cd $T && "$@" > $O/$name.tree.log 2>&1); rt=$?
  (cd $C && "$@" > $O/$name.ctl.log 2>&1); rc=$?
  echo "$name · tree $rt · control $rc"; }
g check-copy-register node scripts/check-copy-register.mjs
g lint-copy node scripts/check-copy-register.mjs --self-test
g check-theme-tokens node scripts/check-theme-tokens.mjs
g lint-theme-tokens node scripts/check-theme-tokens.mjs --self-test
g check-font-coverage node scripts/check-font-coverage.mjs
g test-font-coverage node scripts/check-font-coverage.mjs --self-test
g lint-lanes node scripts/check-lane-membership.mjs --self-test
g lint-sleep node scripts/check-sleep-lint.mjs --self-test
g lint-motion node scripts/check-motion-contract.mjs --self-test
g lint-ink node scripts/check-ink-pressure.mjs --self-test
g lint-live-regions node scripts/check-live-regions.mjs --self-test
g lint-theme-selectors node scripts/check-theme-selectors.mjs --self-test
g test-e2e-projects node scripts/check-pw-projects.mjs --self-test
g check-pw-projects node scripts/check-pw-projects.mjs
(cd $T && node $I6/check-property-block.mjs --fe $T > $O/cpb.tree.log 2>&1); a=$?; (cd $C && node $I6/check-property-block.mjs --fe $C > $O/cpb.ctl.log 2>&1); b=$?; echo "check-property-block (source) · tree $a · control $b"
(cd $T && node $I6/check-property-block.mjs --fe $T --dist $S/acc6crit7-dist-tree > $O/cpbd.tree.log 2>&1); a=$?; (cd $C && node $I6/check-property-block.mjs --fe $C --dist /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-control/web/frontend/dist > $O/cpbd.ctl.log 2>&1); b=$?; echo "check-property-block (built dist) · tree $a · control $b"
(FE=$T node $I6/undefined-token-census.mjs --self-test > $O/utc.tree.log 2>&1); a=$?; (FE=$C node $I6/undefined-token-census.mjs --self-test > $O/utc.ctl.log 2>&1); b=$?; echo "undefined-token census --self-test · tree $a · control $b"
g eslint npx eslint .
g npm-run-lint npm run lint
g knip npx knip
echo ALLDONE
