#!/bin/bash
# critic's clause-sabotage battery on the critic's archive; no rm, no set -e
cd /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/acc6-crit8/base/web/frontend
echo "load $(uptime | sed 's/.*averages: //')"
node scripts/shape-census.mjs --self-test > ../../../logs/sc-self.log 2>&1; echo "shape-census --self-test $?"
node scripts/shape-census.mjs --sabotage-battery > ../../../logs/sc-sab.log 2>&1; echo "shape-census --sabotage-battery $?"
echo "clean: ctt-self $(node scripts/check-theme-tokens.mjs --self-test >../../../logs/ctt-self.log 2>&1; echo $?) ctt $(node scripts/check-theme-tokens.mjs >../../../logs/ctt.log 2>&1; echo $?) fc-self $(node scripts/check-font-coverage.mjs --self-test >../../../logs/fc-self.log 2>&1; echo $?) fc $(node scripts/check-font-coverage.mjs >../../../logs/fc.log 2>&1; echo $?)"
for c in url-dyn decode const-carried strip-regex sfc-toplevel tag-unresolved h-spread barrel pin-binds alias tok-sites tw-arbitrary at-property-site longhand element-keyed; do
  a=$(SHAPE_SABOTAGE=$c node scripts/check-theme-tokens.mjs --self-test >/dev/null 2>&1; echo $?)
  b=$(SHAPE_SABOTAGE=$c node scripts/check-theme-tokens.mjs >/dev/null 2>&1; echo $?)
  d=$(SHAPE_SABOTAGE=$c node scripts/check-font-coverage.mjs --self-test >/dev/null 2>&1; echo $?)
  e=$(SHAPE_SABOTAGE=$c node scripts/check-font-coverage.mjs >/dev/null 2>&1; echo $?)
  echo "SABOTAGE $c: ctt-self $a ctt $b fc-self $d fc $e"
done
echo SAB-DONE
