#!/bin/zsh
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/ACC-FIVE
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-41/web/frontend
O=$S/logs/unit-sab.log; : > $O
for arm in sabA sabB sabC sabD sabE p10; do
  cp $S/probe/gridPaths.$arm.ts src/pencil/grid/gridPaths.ts
  echo "== arm $arm blob $(git hash-object src/pencil/grid/gridPaths.ts) $(date +%T) load $(uptime | sed 's/.*averages: //')" >> $O
  ~/.claude/guard/guarded --light -- npx vitest run --config .acc5p10.vitest.mts src/pencil/grid/gridPaths.poseFronts.test.ts -t "PARTIAL first tick|RUN of stalls|displacement clause" > $S/logs/unit-sab.$arm.raw 2>&1
  echo $? > $S/logs/unit-sab.$arm.exit
  echo "exit $(cat $S/logs/unit-sab.$arm.exit) :: $(grep -E 'Tests ' $S/logs/unit-sab.$arm.raw | tr -s ' ' | tr '\n' ' ')" >> $O
  grep -E "^\s+×" $S/logs/unit-sab.$arm.raw | cut -c1-150 >> $O
done
cmp $S/probe/gridPaths.p10.ts src/pencil/grid/gridPaths.ts && echo "RESTORED-BYTE-EQUAL $(date +%T)" >> $O
echo DONE >> $O
