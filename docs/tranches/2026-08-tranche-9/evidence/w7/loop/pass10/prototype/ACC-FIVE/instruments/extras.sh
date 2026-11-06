#!/bin/zsh
# usage: extras.sh <engine> — the ±ε share pair (literals read off the clean run's printed held share,
# chromium 16:58: min 0.9333) and the healthy clause's vacuity plant (cap × 0.3)
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/ACC-FIVE
T=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-41/web/frontend
GP=$T/src/pencil/grid/gridPaths.ts; E=$1; TB=http://127.0.0.1:4236; R=$S/run.sh
O=$S/logs/battery-$E.log; echo "OPEN extras $E $(date +%T) load $(uptime | sed 's/.*averages: //') $(tail -1 ~/.claude/guard/log/zone.log | grep -o 'inuse=[0-9]*')" >> $O
$R g10-share092-$E $TB 1 front-rate.spec.ts "G10: every" $E G10_FLOOR_SHARE=0.92
$R g10-share095-$E $TB 1 front-rate.spec.ts "G10: every" $E G10_FLOOR_SHARE=0.95
cp $S/probe/gridPaths.slow3.ts $GP; echo "SWAP slow3 blob $(git -C $T hash-object $GP) $(date +%T)" >> $O; sleep 3
$R d10-slow3-$E $TB 1 front-rate.spec.ts "D10-stallrun" $E
cp $S/probe/gridPaths.p10.ts $GP; cmp $S/probe/gridPaths.p10.ts $GP && echo "RESTORED-BYTE-EQUAL $(date +%T)" >> $O; sleep 3
echo "DONE extras $E $(date +%T) load $(uptime | sed 's/.*averages: //')" >> $O
