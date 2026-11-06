#!/bin/zsh
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/ACC-FIVE
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-41/web/frontend
O=$S/logs/unit-all.log; echo "OPEN $(date +%T) $(uptime | sed 's/.*averages: //')" >> $O
CURE=$(git hash-object $S/probe/gridPaths.p10.ts)
for d in src/composables src/games src/pencil; do
  n=$(basename $d)
  for k in 1 2; do
    b0=$(git hash-object src/pencil/grid/gridPaths.ts)
    ~/.claude/guard/guarded --timeout 30 -- npx vitest run --config .acc5p10.vitest.mts --maxWorkers=2 $d > $S/logs/ua-$n.raw 2>&1; echo $? > $S/logs/ua-$n.exit
    b1=$(git hash-object src/pencil/grid/gridPaths.ts)
    if [ $b0 = $CURE ] && [ $b1 = $CURE ]; then break; fi
    echo "CHUNK $d VOID (gridPaths blob $b0 -> $b1 while a plant was in); re-run $(date +%T)" >> $O
    until [ "$(git hash-object src/pencil/grid/gridPaths.ts)" = $CURE ]; do sleep 10; done
  done
  echo "CHUNK $d exit $(cat $S/logs/ua-$n.exit) $(date +%T) blob $b0/$b1 :: $(grep -E 'Test Files|Tests ' $S/logs/ua-$n.raw | tr -s ' ' | tr '\n' ' ')" >> $O
done
echo "DONE $(date +%T) $(uptime | sed 's/.*averages: //')" >> $O
