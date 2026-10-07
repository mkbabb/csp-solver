#!/bin/bash
N=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/mrklive8b
cd $1
echo "### $2 $(pwd)"
for d in src/composables src/games src/lib src/pencil; do
  echo "=== vitest $d load $(sysctl -n vm.loadavg)"
  npx vitest run $d > $N/logs/vitest-$2-$(basename $d).log 2>&1; echo "vitest $d EXIT $?"
  grep -E 'Test Files|Tests ' $N/logs/vitest-$2-$(basename $d).log
done
echo "=== vitest scripts+e2e-unit load $(sysctl -n vm.loadavg)"
echo "=== vue-tsc -b load $(sysctl -n vm.loadavg)"
npx vue-tsc -b > $N/logs/vuetsc-$2.log 2>&1; echo "vue-tsc -b EXIT $?"; tail -3 $N/logs/vuetsc-$2.log
echo UNITDONE
