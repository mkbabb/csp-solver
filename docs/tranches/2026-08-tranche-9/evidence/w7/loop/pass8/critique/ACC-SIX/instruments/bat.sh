#!/bin/bash
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/acc6-crit8
echo "load $(uptime | sed 's/.*averages: //')"
for r in lint:theme-tokens lint:copy lint:motion lint:ink lint:lanes lint:sleep lint:theme-selectors test:e2e:projects test:font-coverage; do
  a=$(cd $S/base/web/frontend && npm run -s $r > $S/logs/bat-tree-$r.log 2>&1; echo $?)
  b=$(cd $S/ctl/web/frontend && npm run -s $r > $S/logs/bat-ctl-$r.log 2>&1; echo $?)
  echo "$r tree|control $a|$b"
done
a=$(cd $S/base/web/frontend && node scripts/check-property-block.mjs > $S/logs/bat-tree-cpb.log 2>&1; echo $?); b=$(cd $S/ctl/web/frontend && node scripts/check-property-block.mjs > $S/logs/bat-ctl-cpb.log 2>&1; echo $?); echo "check-property-block tree|control $a|$b"
echo BAT-DONE
