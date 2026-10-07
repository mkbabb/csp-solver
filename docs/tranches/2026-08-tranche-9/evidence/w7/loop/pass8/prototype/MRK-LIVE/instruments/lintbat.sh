#!/bin/bash
# usage: lintbat.sh <web/frontend dir> <label> <dist dir>  — each gate BARE, its exit printed (no pipes on the gate)
N=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/mrklive8b
I6=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass6/instruments
cd $1
echo "### $2 $(pwd) load $(sysctl -n vm.loadavg)"
for s in lint:lanes lint:theme-tokens lint:sleep lint:bands lint:verbs lint:copy lint:motion lint:ink test:e2e:projects lint lint:eslint lint:knip typecheck:e2e; do
  npm run -s $s > $N/logs/lint-$2-$s.log 2>&1; echo "$s EXIT $?"
done
echo "eslint problems line: $(grep -E 'problem' $N/logs/lint-$2-lint:eslint.log | tail -1)"
echo "eslint warnings count: $(grep -cE '^\s+[0-9]+:[0-9]+\s+warning' $N/logs/lint-$2-lint:eslint.log)"
node $I6/check-property-block.mjs --fe $1 > $N/logs/lint-$2-cpb.log 2>&1; echo "check-property-block(source) EXIT $?"
node $I6/check-property-block.mjs --fe $1 --dist $3 > $N/logs/lint-$2-cpb-dist.log 2>&1; echo "check-property-block(--dist) EXIT $?"
FE=$1 node $I6/undefined-token-census.mjs --self-test > $N/logs/lint-$2-utc.log 2>&1; echo "undefined-token-census EXIT $?"
echo DONE
