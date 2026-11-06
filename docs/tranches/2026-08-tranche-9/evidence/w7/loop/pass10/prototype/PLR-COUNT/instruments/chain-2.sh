#!/bin/bash
# chain-2.sh : after the tree's chromium chain — the union's chromium column, then the WebKit column (tree, then union)
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/PLR-COUNT
B=$S/bin; SP=e2e/player-tally.spec.ts; L=$S/logs/chain-2.log
G1="sheet's ground · (light|dark) · dpr 1"; GA="sheet's ground"; GP="plus. line reaches only"
until grep -q "chain done" $S/logs/chain-ch.log 2>/dev/null; do sleep 30; done
echo "chain-2 start $(date +%T)" >> $L
cp /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-52/web/frontend/e2e/player-tally.spec.ts $S/ac/uni/web/frontend/e2e/player-tally.spec.ts
$B/run.sh CPLUS tree $SP "$GP" chromium; echo "CPLUS.chromium $(cat $S/logs/CPLUS.chromium.exit) $(date +%T)" >> $L
$B/plant.sh PLUSSPLIT2 PLUSSPLIT tree $SP "$GP" chromium; echo "PLUSSPLIT2 $(cat $S/logs/PLUSSPLIT2.chromium.exit) $(date +%T)" >> $L
$B/plant.sh PLUSATTR2 PLUSATTR tree $SP "$GP" chromium; echo "PLUSATTR2 $(cat $S/logs/PLUSATTR2.chromium.exit) $(date +%T)" >> $L
$B/run.sh SLK045b tree $SP "sheet's ground · dark · dpr 1" chromium G14_SLACK=0.045; echo "SLK045b $(cat $S/logs/SLK045b.chromium.exit) $(date +%T)" >> $L
$B/run.sh UCLEAN uni $SP - chromium; echo "UCLEAN.chromium $(cat $S/logs/UCLEAN.chromium.exit) $(date +%T)" >> $L
$B/run.sh UPEERTIN uni e2e/peer-tin.spec.ts "the tally appears at the sixth player" chromium; echo "UPEERTIN.chromium $(cat $S/logs/UPEERTIN.chromium.exit) $(date +%T)" >> $L
$B/run.sh WCLEAN tree $SP - webkit; echo "WCLEAN.webkit $(cat $S/logs/WCLEAN.webkit.exit) $(date +%T)" >> $L
$B/run.sh WSLK045 tree $SP "$G1" webkit G14_SLACK=0.045; echo "WSLK045 $(cat $S/logs/WSLK045.webkit.exit) $(date +%T)" >> $L
$B/run.sh WSLK055 tree $SP "$G1" webkit G14_SLACK=0.055; echo "WSLK055 $(cat $S/logs/WSLK055.webkit.exit) $(date +%T)" >> $L
$B/plant.sh WPLUSSPLIT PLUSSPLIT tree $SP "$GP" webkit; echo "WPLUSSPLIT $(cat $S/logs/WPLUSSPLIT.webkit.exit) $(date +%T)" >> $L
$B/plant.sh WTOKENF TOKENF tree $SP "$GA" webkit; echo "WTOKENF $(cat $S/logs/WTOKENF.webkit.exit) $(date +%T)" >> $L
$B/run.sh WUCLEAN uni $SP - webkit; echo "WUCLEAN.webkit $(cat $S/logs/WUCLEAN.webkit.exit) $(date +%T)" >> $L
echo "chain-2 done $(date +%T)" >> $L
