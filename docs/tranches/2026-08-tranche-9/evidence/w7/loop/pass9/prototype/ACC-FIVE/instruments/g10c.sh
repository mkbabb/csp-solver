#!/bin/zsh
# follow-up isolating plants: ceiling alone (FRONT_MIN_MS 15.5 with the gap held at 15.5, HZ=128) and gap alone
# (FRONT_GAP_MS 7 with 9/20 ms alternating slots at HZ=240: ~60/s, every other gap 12.5 ms).
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/ACC-FIVE
FE=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-41/web/frontend
GP=$FE/src/pencil/grid/gridPaths.ts; P=$S/plants; T=http://127.0.0.1:4236; B=$S/logs/g10d.log
waitload() { for k in $(seq 1 20); do l=$(uptime | sed 's/.*averages: //' | cut -d' ' -f1 | cut -d. -f1); [ $l -le 120 ] && return; echo "WAIT load $l $(date +%T)" >> $B; sleep 60; done; echo "LOAD STILL HIGH $(date +%T)" >> $B; }
both() { local L=$1; shift; for e in chromium webkit; do waitload; zsh $S/run.sh $L $T 1 front-rate.spec.ts "G10: every" $e "$@"; done; }
echo "OPEN $(date +%T) $(uptime)" >> $B
cmp -s $GP $P/gridPaths.clean.ts || { echo "TREE NOT CLEAN AT OPEN" >> $B; exit 1; }
cp $P/g10.ceil2.ts $GP; sleep 4; both p-ceil2b HZ=126; cp $P/gridPaths.clean.ts $GP; sleep 4

cmp -s $GP $P/gridPaths.clean.ts && echo "RESTORED $(date +%T)" >> $B || echo "RESTORE FAILED" >> $B
echo "DONE $(date +%T) $(uptime)" >> $B
