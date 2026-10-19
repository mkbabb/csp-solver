#!/bin/zsh
# D10-stallrun e2e battery: tree (5 and 9 stalls), control, born-RED (the exact pass-8 gridPaths.ts served by the
# tree's dev server), vacuity (no stall injected), threshold (slack ±ε around the measured margin). Both engines.
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/ACC-FIVE
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-41
F=$W/web/frontend/src/pencil/grid/gridPaths.ts; P=$S/plants
T=http://127.0.0.1:4236; C=http://127.0.0.1:4258; G="D10-stallrun"; SP=front-rate.spec.ts
cp $F $P/gridPaths.e2e-clean.ts
zsh $S/run.sh d10-tree $T 1 $SP $G "chromium webkit"
zsh $S/run.sh d10-tree9 $T 1 $SP $G "chromium webkit" D10_STALLS=9
zsh $S/run.sh d10-ctl $C 1 $SP $G "chromium webkit"
zsh $S/run.sh d10-vacuous $T 1 $SP $G "chromium webkit" D10_STALL_MS=0
zsh $S/run.sh d10-slackP $T 1 $SP $G "chromium webkit" D10_SLACK=-0.9
zsh $S/run.sh d10-slackM $T 1 $SP $G "chromium webkit" D10_SLACK=-1.1
cp $P/gp.p8file.ts $F; sleep 4
zsh $S/run.sh d10-p8file $T 1 $SP $G "chromium webkit"
zsh $S/run.sh d10-p8file9 $T 1 $SP $G "chromium webkit" D10_STALLS=9
cp $P/gridPaths.e2e-clean.ts $F; sleep 4
cmp $F $P/gridPaths.e2e-clean.ts && echo "RESTORED byte-equal $(date +%T)" >> $S/logs/d10-e2e.done
echo "DONE $(date +%T)" >> $S/logs/d10-e2e.done
