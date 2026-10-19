#!/bin/zsh
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/crit-ACC-FIVE
T=$S/tree/web/frontend; B=http://127.0.0.1:4236
$S/run.sh d10-tree $B 1 front-rate.spec.ts D10-stallrun "chromium webkit"
$S/run.sh d10-tree9 $B 1 front-rate.spec.ts D10-stallrun "chromium webkit" D10_STALLS=9
$S/run.sh panel-tree $B 1 front-rate.spec.ts G10-panel "chromium webkit"
$S/run.sh panel-share101 $B 1 front-rate.spec.ts G10-panel "chromium webkit" G10_PANEL_SHARE=1.01
cp $S/probe/gridPaths.p8.ts $T/src/pencil/grid/gridPaths.ts; sleep 6
$S/run.sh d10-p8 $B 1 front-rate.spec.ts D10-stallrun "chromium webkit"
cp $S/probe/gridPaths.tree.ts $T/src/pencil/grid/gridPaths.ts
cmp $S/probe/gridPaths.tree.ts $T/src/pencil/grid/gridPaths.ts && echo "RESTORED-BYTE-EQUAL $(date +%T)" >> $S/logs/d10-p8.log
$S/run.sh d10-ctl http://127.0.0.1:4258 1 front-rate.spec.ts D10-stallrun "chromium webkit"
echo B2-DONE > $S/logs/b2.done
