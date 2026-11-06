#!/bin/bash
# chain-5.sh : the tree (CTALL, TOKENFb), then the ONE-ROUTE tree (SELF + COUNT + PLACE on 8c46d9de; chromium, then WebKit in one lock), then unit
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/PLR-COUNT
B=$S/bin; SP=e2e/player-tally.spec.ts; L=$S/logs/chain-5.log
echo "chain-5 start $(date +%T)" >> $L
$B/run.sh CTALL tree $SP "the tall phone" chromium; echo "CTALL.chromium $(cat $S/logs/CTALL.chromium.exit) $(date +%T)" >> $L
$B/plant.sh TOKENFb TOKENF tree $SP "sheet's ground · light · dpr 2" chromium; echo "TOKENFb $(cat $S/logs/TOKENFb.chromium.exit) $(date +%T)" >> $L
$B/run.sh TRI tri $SP - chromium; echo "TRI.chromium $(cat $S/logs/TRI.chromium.exit) $(date +%T)" >> $L
echo "queued $(date +%T)" > $S/logs/wk-tri.guard
$HOME/.claude/guard/guarded --exclusive webkit --timeout 90 -- /bin/bash $B/wk-inner.sh tri $S/wk-tri.jobs >> $S/logs/wk-tri.guard 2>&1; echo "guard exit=$? $(date +%T)" >> $S/logs/wk-tri.guard
echo "WTRI.webkit $(cat $S/logs/WTRI.webkit.exit) $(date +%T)" >> $L
$B/srv.sh stop >> $L 2>&1
$B/unit.sh; echo "unit done $(date +%T)" >> $L
echo "chain-5 done $(date +%T)" >> $L
