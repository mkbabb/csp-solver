#!/bin/zsh
# ACC-FIVE pass-9 browser battery: sequential, load-gated (a row waits behind 60 s polls while 1-min load > 120).
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/ACC-FIVE
FE=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-41/web/frontend
GP=$FE/src/pencil/grid/gridPaths.ts; HG=$FE/src/pencil/grid/HandDrawnGrid/HandDrawnGrid.vue; DT=$FE/src/games/shared/DifficultyTally.vue
P=$S/plants; T=http://127.0.0.1:4236; C=http://127.0.0.1:4258; B=$S/logs/g10b.log
waitload() { for k in $(seq 1 20); do l=$(uptime | sed 's/.*averages: //' | cut -d' ' -f1 | cut -d. -f1); [ $l -le 120 ] && return; echo "WAIT load $l $(date +%T)" >> $B; sleep 60; done; echo "LOAD STILL HIGH $(date +%T)" >> $B; }
one() { waitload; zsh $S/run.sh "$@"; }
both() { local L=$1 B_=$2 SP=$3 G=$4; shift 4; for e in chromium webkit; do one $L $B_ 1 $SP $G $e "$@"; done; }
cp $GP $P/gridPaths.clean.ts
restore() { cp $P/gridPaths.clean.ts $GP; cp $P/HandDrawnGrid.clean.vue $HG; cp $P/tally.clean.vue $DT; cmp -s $GP $P/gridPaths.clean.ts && cmp -s $HG $P/HandDrawnGrid.clean.vue && cmp -s $DT $P/tally.clean.vue && echo "RESTORED $(date +%T)" >> $B || echo "RESTORE FAILED $(date +%T)" >> $B; sleep 4; }
plant() { cp $1 $2; echo "PLANT $(basename $1) in $(date +%T)" >> $B; sleep 4; }
echo "OPEN $(date +%T) $(uptime)" >> $B
FL="never paint whole"; FR=front-rate.spec.ts; TF=tally-flash.spec.ts
both d10-slack+e $T $FR "D10-stallrun" D10_SLACK=0.1
both d10-slack-e $T $FR "D10-stallrun" D10_SLACK=-0.1
both flash-tree $T $TF "$FL"
both flash-ctl $C $TF "$FL"
plant $P/tally.p7t.vue $DT; both flash-p7t $T $TF "$FL"; restore
both panel $T $FR "G10-panel"
both panel-ctl $C $FR "G10-panel"
both panel-share-0.99 $T $FR "G10-panel" G10_PANEL_SHARE=0.99
both panel-share-1.01 $T $FR "G10-panel" G10_PANEL_SHARE=1.01
for i in 1 2 3 4 5; do both g10-125 $T $FR "G10: every"; done
for i in 1 2 3 4 5; do both g10-60 $T $FR "G10: every" HZ=60; done
both g10-ctl $C $FR "G10: every"
both p-clock $T $FR "G10: every" CLOCK=60
both p-interleave $T $FR "G10: every" DEAL=EASY
plant $P/g10.ceil.ts $GP; both p-ceil $T $FR "G10: every" HZ=128; restore
plant $P/g10.floor.ts $GP; both p-floor $T $FR "G10: every"; restore
plant $P/g10.gap.ts $GP; both p-gap $T $FR "G10: every"; restore
plant $P/g10.seen.vue $HG; both p-seen $T $FR "G10: every"; restore
plant $P/tally.p8.vue $DT; for i in 1 2; do both g10-p8tally $T $FR "G10: every"; done; restore
echo "DONE $(date +%T) $(uptime)" >> $B
