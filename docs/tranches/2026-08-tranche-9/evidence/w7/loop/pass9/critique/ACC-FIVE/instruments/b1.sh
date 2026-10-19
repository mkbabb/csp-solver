#!/bin/zsh
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/crit-ACC-FIVE
T=$S/tree/web/frontend; B=http://127.0.0.1:4236
$S/run.sh p30-tree $B 1 crit5-partial30.spec.ts CRIT-P30 "chromium webkit" CRIT_OFF=6
$S/run.sh p30-tree $B 1 crit5-partial30.spec.ts CRIT-P30 "chromium webkit" CRIT_OFF=15
$S/run.sh p30-tree $B 1 crit5-partial30.spec.ts CRIT-P30 "chromium webkit" CRIT_OFF=-1
cp $S/probe/gridPaths.p8.ts $T/src/pencil/grid/gridPaths.ts; sleep 5
$S/run.sh p30-p8 $B 1 crit5-partial30.spec.ts CRIT-P30 "chromium webkit" CRIT_OFF=6
$S/run.sh p30-p8 $B 1 crit5-partial30.spec.ts CRIT-P30 "chromium webkit" CRIT_OFF=15
cp $S/probe/gridPaths.tree.ts $T/src/pencil/grid/gridPaths.ts
cmp $S/probe/gridPaths.tree.ts $T/src/pencil/grid/gridPaths.ts && echo "RESTORED-BYTE-EQUAL $(date +%T)" >> $S/logs/p30-p8.log
$S/run.sh p30-ctl http://127.0.0.1:4258 1 crit5-partial30.spec.ts CRIT-P30 "chromium webkit" CRIT_OFF=6
echo B1-DONE > $S/logs/b1.done
