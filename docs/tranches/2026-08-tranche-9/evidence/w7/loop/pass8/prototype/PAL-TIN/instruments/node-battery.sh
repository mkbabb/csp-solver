#!/bin/bash
# PAL-TIN pass 8 · the pre-return battery, BARE, tree | control (git archive 74a2b5d9). No rm, no set -e.
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/tin8
TREE=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_308fa864-c94-2/web/frontend
CTL=$S/ctl/web/frontend
CDIST=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-control/web/frontend/dist
PB=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass6/instruments/check-property-block.mjs
OUT=$S/logs/node-battery.txt; L=$S/logs/nb; mkdir -p $L
echo "node battery · $(date) · load $(uptime | sed 's/.*averages*: //')" > $OUT
echo "tree sha1s: gate $(shasum $TREE/scripts/check-peer-tin.mjs | cut -c1-8) · library $(shasum $TREE/scripts/shape-census.mjs | cut -c1-8) · spec $(shasum $TREE/e2e/peer-tin.spec.ts | cut -c1-8)" >> $OUT
row() { # name, cmd (run in tree then control)
  local name=$1; shift
  local cmd="$*"
  (cd $TREE && eval "${cmd//@DIST@/$S/dist-final}" > $L/$name.tree.log 2>&1); local t=$?
  (cd $CTL && eval "${cmd//@DIST@/$CDIST}" > $L/$name.ctl.log 2>&1); local c=$?
  echo "$name | tree $t | control $c" >> $OUT
}
row lint-tin "npm run lint:tin"
row gate-bare "node scripts/check-peer-tin.mjs"
row gate-dist "node scripts/check-peer-tin.mjs --dist @DIST@"
row gate-selftest-dist "node scripts/check-peer-tin.mjs --self-test --dist @DIST@"
row library-selftest "node scripts/shape-census.mjs --self-test"
row library-sabotage "node scripts/shape-census.mjs --sabotage-battery"
row copy-register "node scripts/check-copy-register.mjs"
row lint-copy "npm run lint:copy"
row lint-lanes "npm run lint:lanes"
row lint-theme-tokens "npm run lint:theme-tokens"
row lint-sleep "npm run lint:sleep"
row lint-bands "npm run lint:bands"
row lint-verbs "npm run lint:verbs"
row lint-ink "npm run lint:ink"
row lint-motion "npm run lint:motion"
row lint-tdz "npm run lint:tdz"
row test-e2e-projects "npm run test:e2e:projects"
row check-pw-projects "node scripts/check-pw-projects.mjs"
row property-block-source "node $PB --fe ."
row property-block-dist "node $PB --fe . --dist @DIST@"
row eslint "npx eslint . --max-warnings 0"
row prettier "npm run lint"
row knip "npm run lint:knip"
row typecheck-e2e "npm run typecheck:e2e"
row typecheck-node "npm run typecheck:node"
(cd $TREE && node scripts/check-peer-tin.mjs --sabotage-battery --dist $S/dist-final > $L/gate-sabotage.tree.log 2>&1); echo "gate-sabotage-battery | tree $? | control (script absent)" >> $OUT
echo DONE >> $OUT
