#!/bin/bash
C=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit-erase8
run() { local n=$1; shift; for arm in tree ctl; do (cd $C/$arm/web/frontend && "$@" > $C/logs/bat-$arm-$n.log 2>&1); echo "$n $arm exit=$?"; done; }
{
run theme-tokens npm run -s lint:theme-tokens
run motion npm run -s lint:motion
run ink npm run -s lint:ink
run sleep npm run -s lint:sleep
run lanes npm run -s lint:lanes
run copy node scripts/check-copy-register.mjs
run knip npm run -s lint:knip
run typecheck-e2e npm run -s typecheck:e2e
run eslint npx eslint . --max-warnings 0
echo "reserve-law tree: $(cd $C/tree/web/frontend && node scripts/shape-census.mjs --tree . > $C/logs/bat-tree-reserve.log 2>&1; echo $?) ; ctl has no library at 74a2b5d9"
echo "shape-census self-test tree: $(cd $C/tree/web/frontend && node scripts/shape-census.mjs --self-test > $C/logs/bat-tree-sc-self.log 2>&1; echo $?)"
echo BATTERY-DONE
} > $C/logs/battery.txt 2>&1
