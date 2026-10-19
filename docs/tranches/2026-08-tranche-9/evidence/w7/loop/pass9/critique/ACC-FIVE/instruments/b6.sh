#!/bin/zsh
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/crit-ACC-FIVE
T=$S/tree/web/frontend; B=http://127.0.0.1:4236
$S/run.sh flash-tree $B 1 tally-flash.spec.ts "never paint whole" "chromium webkit"
cp $S/probe/Tally.p7.vue $T/src/games/shared/DifficultyTally.vue; sleep 6
$S/run.sh flash-p7 $B 1 tally-flash.spec.ts "never paint whole" "chromium webkit"
cp $S/probe/Tally.tree.vue $T/src/games/shared/DifficultyTally.vue
cmp $S/probe/Tally.tree.vue $T/src/games/shared/DifficultyTally.vue && echo "RESTORED-BYTE-EQUAL $(date +%T)" >> $S/logs/flash-p7.log
$S/run.sh flash-ctl http://127.0.0.1:4258 1 tally-flash.spec.ts "never paint whole" "chromium webkit"
echo B6-DONE > $S/logs/b6.done
