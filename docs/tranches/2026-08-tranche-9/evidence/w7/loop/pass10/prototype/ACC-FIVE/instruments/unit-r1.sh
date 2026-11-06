#!/bin/zsh
# R1 born-RED, both negatives in ONE run: arms p10 (the cure), p9 (min of 32, no exclusion), p8 (median of 9)
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/ACC-FIVE
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-41/web/frontend
O=$S/logs/unit-r1.log; : > $O
for arm in p10 p10v1 p9 p8; do
  cp $S/probe/gridPaths.$arm.ts src/pencil/grid/gridPaths.ts
  echo "== arm $arm blob $(git hash-object src/pencil/grid/gridPaths.ts) $(date +%T) load $(uptime | sed 's/.*averages: //')" >> $O
  ~/.claude/guard/guarded --light -- npx vitest run --config .acc5p10.vitest.mts src/pencil/grid/acc5crit.partial30.test.ts src/pencil/grid/gridPaths.poseFronts.test.ts > $S/logs/unit-r1.$arm.raw 2>&1
  echo $? > $S/logs/unit-r1.$arm.exit
  echo "exit $(cat $S/logs/unit-r1.$arm.exit) :: $(grep -E 'Test Files|Tests ' $S/logs/unit-r1.$arm.raw | tr -s ' ' | tr '\n' ' ')" >> $O
  grep -E "^\s+(✓|×|↓)" $S/logs/unit-r1.$arm.raw | grep -E "×" | cut -c1-170 >> $O
done
cp $S/probe/gridPaths.p10.ts src/pencil/grid/gridPaths.ts
cmp $S/probe/gridPaths.p10.ts src/pencil/grid/gridPaths.ts && echo "RESTORED-BYTE-EQUAL $(date +%T)" >> $O
echo DONE >> $O
