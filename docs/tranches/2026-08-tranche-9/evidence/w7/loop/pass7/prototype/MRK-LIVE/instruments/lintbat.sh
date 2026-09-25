#!/bin/bash
# usage: lintbat.sh <web/frontend dir> <label>
cd $1
echo "### $2 $(pwd) load $(sysctl -n vm.loadavg)"
for s in lint:lanes lint:theme-tokens lint:sleep lint:copy lint:motion test:e2e:projects lint; do
  npm run -s $s > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/mrklive-p7/logs/lint-$2-$s.log 2>&1; echo "$s EXIT $?"
done
node /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass6/instruments/check-property-block.mjs --fe $1 > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/mrklive-p7/logs/lint-$2-cpb.log 2>&1; echo "check-property-block(source) EXIT $?"
FE=$1 node /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass6/instruments/undefined-token-census.mjs --self-test > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/mrklive-p7/logs/lint-$2-utc.log 2>&1; echo "undefined-token-census EXIT $?"
echo DONE
