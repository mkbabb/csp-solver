#!/bin/bash
# PLR-COUNT pass 7 pre-return battery: each gate BARE (exit unpiped), tree then control. The writers
# (vue-tsc -b, eslint over dot-dirs) run on a scratch ARCHIVE of the tree ($A), never on the tree or control.
T=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-52/web/frontend
C=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-control/web/frontend
M=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion
E=$M/docs/tranches/2026-08-tranche-9/evidence/w7/loop
R=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrcount7-rig
A=$1   # the archive's web/frontend
L=$R/logs/bat; mkdir -p $L
echo "LOAD $(sysctl -n vm.loadavg) sha1 PlayerMark $(shasum $T/src/pencil/chrome/PlayerMark/PlayerMark.vue|cut -c1-12) tally $(shasum $T/e2e/player-tally.spec.ts|cut -c1-12) mark $(shasum $T/e2e/player-mark.spec.ts|cut -c1-12)"
gate() { local name=$1 both=$2; shift 2
  (cd $T && "$@" > $L/tree-$name.log 2>&1); local t=$?; local c="—"
  if [ "$both" = 1 ]; then (cd $C && "$@" > $L/ctrl-$name.log 2>&1); c=$?; fi
  echo "$name tree=$t control=$c"; }
gate lint-sleep 1 node scripts/check-sleep-lint.mjs --self-test
gate lint-lanes 1 node scripts/check-lane-membership.mjs --self-test
gate lint-theme-tokens 1 node scripts/check-theme-tokens.mjs --self-test
gate test-e2e-projects 1 node scripts/check-pw-projects.mjs --self-test
gate check-pw-projects 1 node scripts/check-pw-projects.mjs
gate lint-copy 1 node scripts/check-copy-register.mjs --self-test
gate copy-register-bare 1 node scripts/check-copy-register.mjs
gate font-coverage 1 node scripts/check-font-coverage.mjs
gate lint-motion 1 node scripts/check-motion-contract.mjs --self-test
gate lint-live-regions 1 node scripts/check-live-regions.mjs --self-test
gate lint-ink 1 node scripts/check-ink-pressure.mjs --self-test
gate lint-catch 1 node scripts/check-empty-catch.mjs --self-test
gate lint-theme-selectors 1 node scripts/check-theme-selectors.mjs --self-test
gate lint-tdz 1 node scripts/tdz-probe.mjs --self-test
gate lint-knip 1 npx knip
gate lint-boundary 1 npx eslint --no-config-lookup --config eslint.boundary.config.js src/games
for g in lint:bands lint:verbs; do grep -q "\"$g\"" $T/package.json && echo "$g present" || echo "$g (no such script on 74a2b5d9, both trees)"; done
(cd $T && FE=$T node $E/pass6/prototype/PLR-COUNT/instruments/undefined-token-census.admitted-tap-floor.copy.mjs > $L/tree-census.log 2>&1); t=$?
(cd $C && FE=$C node $E/pass6/prototype/PLR-COUNT/instruments/undefined-token-census.admitted-tap-floor.copy.mjs > $L/ctrl-census.log 2>&1); c=$?
echo "undefined-token census (A.3 row admitted) tree=$t control=$c :: tree $(grep -E 'bare|STALE' $L/tree-census.log | tr '\n' ' ' | tr -s ' ' | cut -c1-200)"
node $E/pass6/instruments/check-property-block.mjs --fe $T > $L/tree-cpb.log 2>&1; t=$?; node $E/pass6/instruments/check-property-block.mjs --fe $C > $L/ctrl-cpb.log 2>&1; c=$?
echo "check-property-block (source) tree=$t control=$c"
(cd $M/.claude/worktrees/wf_f72f3b5a-83a-52 && node scripts/ledger-diff.mjs --verify-cites > $L/tree-cites.log 2>&1); t=$?
(cd $M && node scripts/ledger-diff.mjs --verify-cites > $L/main-cites.log 2>&1); c=$?
echo "ledger-diff --verify-cites tree=$t main(c31a92b9)=$c"
(cd $A && npx eslint . > $L/arch-eslint.log 2>&1); echo "eslint . (archive of the tree) exit $?"
(cd $A && npx prettier --check --config .prettierrc.json src/ scripts/ ../../scripts/ ../relay/ > $L/arch-prettier.log 2>&1); echo "npm run lint form: prettier --check src/ scripts/ ../../scripts/ ../relay/ (archive) exit $?"
(cd $A && npx vue-tsc -b > $L/arch-tsc-b.log 2>&1); echo "vue-tsc -b (archive) exit $?"
(cd $A && npx vue-tsc --noEmit -p tsconfig.e2e.json > $L/arch-tsc-e2e.log 2>&1); echo "typecheck:e2e (archive) exit $?"
grep -rn 'keydown.enter' $T/src | grep -v '^\s*//' | wc -l | sed 's/^/CH-70 probe keydown.enter lines (comments included) /'
echo "LOAD $(sysctl -n vm.loadavg)"
echo BATTERY-DONE
