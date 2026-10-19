#!/bin/zsh
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/crit-ACC-FIVE
T=$S/tree/web/frontend
cd $T
for arm in tree p8; do
  cp $S/probe/gridPaths.$arm.ts src/pencil/grid/gridPaths.ts
  echo "== arm $arm load $(uptime | sed 's/.*averages: //')"
  npx vitest run --config .crit5.vitest.mts src/pencil/grid/crit.partial30.test.ts src/pencil/grid/gridPaths.poseFronts.test.ts > $S/probe/unit.$arm.log 2>&1
  echo $? > $S/probe/unit.$arm.exit
  grep -E "✓|×|FAIL|Tests " $S/probe/unit.$arm.log | grep -iE "critic|run of|stall|Tests " | head -30
  echo "exit $(cat $S/probe/unit.$arm.exit)"
done
cp $S/probe/gridPaths.tree.ts src/pencil/grid/gridPaths.ts
cmp $S/probe/gridPaths.tree.ts src/pencil/grid/gridPaths.ts && echo RESTORED-BYTE-EQUAL
