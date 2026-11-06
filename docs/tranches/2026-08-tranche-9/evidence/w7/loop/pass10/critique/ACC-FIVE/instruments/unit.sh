#!/bin/zsh
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/crit-ACC-FIVE
T=$S/tree/web/frontend
cd $T
for arm in ${=ARMS:-f67c70ee 458bb26f eeb58de2 c0fbe399}; do
  cp $S/probe/gridPaths.$arm.ts src/pencil/grid/gridPaths.ts
  echo "== arm $arm blob $(git hash-object src/pencil/grid/gridPaths.ts) $(date +%T) load $(uptime | sed 's/.*averages: //')"
  npx vitest run --config .crit5.vitest.mts --maxWorkers=2 src/pencil/grid/crit.partial30.test.ts src/pencil/grid/crit.remainder.test.ts src/pencil/grid/gridPaths.poseFronts.test.ts > $S/logs/unit.$arm.log 2>&1
  echo $? > $S/logs/unit.$arm.exit
  grep -E "Test Files|Tests " $S/logs/unit.$arm.log
  grep -E "^\s+(×|✗|FAIL)|^ FAIL" $S/logs/unit.$arm.log | sed 's/^ *//' | sort | uniq | head -40
  echo "exit $(cat $S/logs/unit.$arm.exit)"
done
cp $S/probe/gridPaths.f67c70ee.ts src/pencil/grid/gridPaths.ts
cmp $S/probe/gridPaths.f67c70ee.ts src/pencil/grid/gridPaths.ts && echo "RESTORED-BYTE-EQUAL $(git hash-object src/pencil/grid/gridPaths.ts)"
echo UNIT-DONE
