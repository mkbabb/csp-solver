#!/bin/zsh
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/crit-ACC-FIVE
T=$S/tree/web/frontend; B=http://127.0.0.1:4236
cp $S/probe/gridPaths.p7.ts $T/src/pencil/grid/gridPaths.ts; sleep 6
$S/run.sh panel-p7 $B 1 front-rate.spec.ts G10-panel "chromium webkit"
$S/run.sh g10-p7-60 $B 1 front-rate.spec.ts "G10: every" "chromium webkit" HZ=60
cp $S/probe/gridPaths.tree.ts $T/src/pencil/grid/gridPaths.ts
cmp $S/probe/gridPaths.tree.ts $T/src/pencil/grid/gridPaths.ts && echo "RESTORED-BYTE-EQUAL $(date +%T)" >> $S/logs/g10-p7-60.log
sleep 6
$S/run.sh g10-tree-60 $B 1 front-rate.spec.ts "G10: every" "chromium webkit" HZ=60
echo B5-DONE > $S/logs/b5.done
