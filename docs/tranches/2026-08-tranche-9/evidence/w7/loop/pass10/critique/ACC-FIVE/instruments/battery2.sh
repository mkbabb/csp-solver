#!/bin/zsh
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/crit-ACC-FIVE
GP=$S/tree/web/frontend/src/pencil/grid/gridPaths.ts
E=$1; TB=http://127.0.0.1:4236; O=$S/logs/battery-$E.log; R=$S/run.sh
cp $S/probe/gridPaths.slow95.ts $GP; echo "SWAP slow95 $(date +%T)" >> $O; sleep 4
$R p30-slow95 $TB "D10-partial30" $E
cp $S/probe/gridPaths.f67c70ee.ts $GP; cmp $S/probe/gridPaths.f67c70ee.ts $GP && echo "RESTORED-BYTE-EQUAL $(date +%T)" >> $O
echo "DONE2 $E $(date +%T)" >> $O
