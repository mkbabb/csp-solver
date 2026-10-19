#!/bin/zsh
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/crit-ACC-FIVE
T=$S/tree/web/frontend; B=http://127.0.0.1:4236
$S/run.sh g10-tree $B 1 front-rate.spec.ts "G10: every" "chromium webkit"
cp $S/probe/gridPaths.heavy.ts $T/src/pencil/grid/gridPaths.ts; sleep 6
$S/run.sh g10-heavy $B 1 front-rate.spec.ts "G10: every" "chromium webkit"
cp $S/probe/gridPaths.tree.ts $T/src/pencil/grid/gridPaths.ts
cmp $S/probe/gridPaths.tree.ts $T/src/pencil/grid/gridPaths.ts && echo "RESTORED-BYTE-EQUAL $(date +%T)" >> $S/logs/g10-heavy.log
echo B3-DONE > $S/logs/b3.done
