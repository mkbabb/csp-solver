#!/bin/bash
# chain-3.sh : after chain 2 (which ends on the union) — the union's re-read of the re-authored tall phone, then the
# tree's re-read of TOKENF's flaked cell, then the servers stopped and the unit battery
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/PLR-COUNT
B=$S/bin; SP=e2e/player-tally.spec.ts; L=$S/logs/chain-3.log
until grep -q "chain-2 done" $S/logs/chain-2.log 2>/dev/null; do sleep 30; done
echo "chain-3 start $(date +%T)" >> $L
$B/run.sh UTALL uni $SP "the tall phone" chromium; echo "UTALL.chromium $(cat $S/logs/UTALL.chromium.exit) $(date +%T)" >> $L
$B/run.sh UTALLW uni $SP "the tall phone" webkit; echo "UTALLW.webkit $(cat $S/logs/UTALLW.webkit.exit) $(date +%T)" >> $L
$B/run.sh CTALL tree $SP "the tall phone" chromium; echo "CTALL.chromium $(cat $S/logs/CTALL.chromium.exit) $(date +%T)" >> $L
$B/plant.sh TOKENFb TOKENF tree $SP "sheet's ground · light · dpr 2" chromium; echo "TOKENFb $(cat $S/logs/TOKENFb.chromium.exit) $(date +%T)" >> $L
$B/srv.sh stop >> $L 2>&1
$B/unit.sh; echo "unit $(tail -2 $S/logs/unit.exit | head -1) $(date +%T)" >> $L
echo "chain-3 done $(date +%T)" >> $L
