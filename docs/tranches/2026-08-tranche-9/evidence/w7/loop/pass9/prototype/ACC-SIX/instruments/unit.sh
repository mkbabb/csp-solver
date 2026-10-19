#!/bin/bash
# unit.sh <label> <frontend dir>: vitest chunked by directory + vue-tsc -b; exits to files. no rm, no set -e
S=<SCRATCH>
cd $2
for d in src/games src/pencil src/lib src/composables src/workers; do
  [ -d $d ] || continue
  n=$(echo $d | tr / _)
  GIT_CEILING_DIRECTORIES=$S npx vitest run $d > $S/logs/unit-$1-$n.log 2>&1; echo $? > $S/logs/unit-$1-$n.exit
  echo "unit $1 $d exit $(cat $S/logs/unit-$1-$n.exit) · $(grep -E 'Test Files|Tests ' $S/logs/unit-$1-$n.log | tr -s ' ' | tr '\n' ' ') · load $(uptime | sed 's/.*averages: //')"
done
GIT_CEILING_DIRECTORIES=$S npx vitest run --exclude 'src/games/**' --exclude 'src/pencil/**' --exclude 'src/lib/**' --exclude 'src/composables/**' --exclude 'src/workers/**' > $S/logs/unit-$1-rest.log 2>&1; echo $? > $S/logs/unit-$1-rest.exit
echo "unit $1 rest exit $(cat $S/logs/unit-$1-rest.exit) · $(grep -E 'Test Files|Tests ' $S/logs/unit-$1-rest.log | tr -s ' ' | tr '\n' ' ')"
GIT_CEILING_DIRECTORIES=$S npx vue-tsc -b > $S/logs/vuetsc-$1.log 2>&1; echo $? > $S/logs/vuetsc-$1.exit
echo "vue-tsc -b $1 exit $(cat $S/logs/vuetsc-$1.exit)"
GIT_CEILING_DIRECTORIES=$S npx vue-tsc --noEmit -p tsconfig.e2e.json > $S/logs/tsce2e-$1.log 2>&1; echo $? > $S/logs/tsce2e-$1.exit
echo "typecheck:e2e $1 exit $(cat $S/logs/tsce2e-$1.exit)"
echo UNIT-DONE $1
