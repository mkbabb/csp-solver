#!/bin/zsh
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/crit-ACC-FIVE
cd $S/wave/web/frontend
echo "== WAVE+delta b4596539 gridPaths $(git hash-object src/pencil/grid/gridPaths.ts) $(date +%T) load $(uptime | sed 's/.*averages: //')"
for d in src/pencil src/games/shared src/composables; do
  n=$(echo $d | tr / _)
  npx vitest run --config .crit5.vitest.mts --maxWorkers=2 $d > $S/logs/wave.$n.log 2>&1
  echo $? > $S/logs/wave.$n.exit
  echo "-- $d exit $(cat $S/logs/wave.$n.exit) $(date +%T)"
  grep -E "Test Files|Tests " $S/logs/wave.$n.log
  grep -E "^ FAIL" $S/logs/wave.$n.log | sort | uniq | head -20
done
echo WAVE-DONE
