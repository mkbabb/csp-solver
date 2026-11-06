#!/bin/bash
# chain-4.sh : the union (chromium UTALL, then the union's WebKit column in ONE lock), then the tree (CTALL, TOKENFb), then unit
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/PLR-COUNT
B=$S/bin; SP=e2e/player-tally.spec.ts; L=$S/logs/chain-4.log
cp /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-52/web/frontend/e2e/player-tally.spec.ts $S/ac/uni/web/frontend/e2e/player-tally.spec.ts
echo "chain-4 start $(date +%T)" >> $L
$B/run.sh UTALL uni $SP "the tall phone" chromium; echo "UTALL.chromium $(cat $S/logs/UTALL.chromium.exit) $(date +%T)" >> $L
echo "queued $(date +%T)" > $S/logs/wk-uni.guard
$HOME/.claude/guard/guarded --exclusive webkit --timeout 90 -- /bin/bash $B/wk-inner.sh uni $S/wk-uni.jobs >> $S/logs/wk-uni.guard 2>&1; echo "guard exit=$? $(date +%T)" >> $S/logs/wk-uni.guard
echo "WUCLEAN.webkit $(cat $S/logs/WUCLEAN.webkit.exit) $(date +%T)" >> $L
$B/run.sh CTALL tree $SP "the tall phone" chromium; echo "CTALL.chromium $(cat $S/logs/CTALL.chromium.exit) $(date +%T)" >> $L
$B/plant.sh TOKENFb TOKENF tree $SP "sheet's ground · light · dpr 2" chromium; echo "TOKENFb $(cat $S/logs/TOKENFb.chromium.exit) $(date +%T)" >> $L
$B/srv.sh stop >> $L 2>&1
$B/unit.sh; echo "unit done $(date +%T)" >> $L
echo "chain-4 done $(date +%T)" >> $L
