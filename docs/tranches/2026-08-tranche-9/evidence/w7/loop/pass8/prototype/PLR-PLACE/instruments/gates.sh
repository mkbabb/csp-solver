#!/bin/bash
# PLR-PLACE pass 8 · the pre-return battery, BARE, on the tree's bytes (gate = git archive 74a2b5d9 +
# the product diff) and on the control (ctlg = git archive 74a2b5d9). Exit codes only; logs per gate.
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/place8
L=$S/logs/gates; mkdir -p $L; OUT=$S/readings/gates.txt
g() { # side name cmd...
  local side=$1 name=$2; shift 2
  ( cd $S/$side/web/frontend && "$@" ) > $L/$side.$name.log 2>&1; local e=$?
  echo "$side|$name|exit=$e" >> $OUT
}
for side in gate ctlg; do
  echo "== $side $(date +%T) load $(uptime | sed 's/.*averages: //')" >> $OUT
  g $side eslint npx eslint . --max-warnings 0
  g $side lint npm run lint
  g $side knip npm run lint:knip
  for s in lint:lanes lint:theme-tokens lint:sleep lint:motion lint:copy lint:ink lint:catch lint:theme-selectors lint:live-regions lint:tdz lint:boundary lint:bands lint:verbs test:e2e:projects test:font-coverage typecheck:e2e typecheck:node; do g $side ${s//:/_} npm run $s; done
  g $side check-pw-projects node scripts/check-pw-projects.mjs
  g $side property-block-fe node $S/cfg/check-property-block.p6copy.mjs --fe $S/$side/web/frontend
done
g gate vue-tsc-b npx vue-tsc -b
echo "DONE $(date +%T)" >> $OUT
