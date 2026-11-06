#!/bin/bash
# chain-ch.sh : the chromium battery on the tree, one job at a time, after CLEAN
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/PLR-COUNT
B=$S/bin; SP=e2e/player-tally.spec.ts
G1="sheet's ground · (light|dark) · dpr 1"
GA="sheet's ground"
GP="plus. line reaches only"
while [ ! -f $S/logs/CLEAN.chromium.exit ]; do sleep 30; done
echo "chain start $(date +%T)" >> $S/logs/chain-ch.log
$B/run.sh SELFANCHOR tree $SP "$G1" chromium G14_CONTROL=http://127.0.0.1:4242;  echo "SELFANCHOR $(cat $S/logs/SELFANCHOR.chromium.exit) $(date +%T)" >> $S/logs/chain-ch.log
$B/run.sh SLK045 tree $SP "$G1" chromium G14_SLACK=0.045;  echo "SLK045 $(cat $S/logs/SLK045.chromium.exit) $(date +%T)" >> $S/logs/chain-ch.log
$B/run.sh SLK055 tree $SP "$G1" chromium G14_SLACK=0.055;  echo "SLK055 $(cat $S/logs/SLK055.chromium.exit) $(date +%T)" >> $S/logs/chain-ch.log
$B/run.sh DROPG3 tree $SP "$G1" chromium G14_DROP=G3;  echo "DROPG3 $(cat $S/logs/DROPG3.chromium.exit) $(date +%T)" >> $S/logs/chain-ch.log
$B/plant.sh PLUSSPLIT PLUSSPLIT tree $SP "$GP" chromium;  echo "PLUSSPLIT $(cat $S/logs/PLUSSPLIT.chromium.exit) $(date +%T)" >> $S/logs/chain-ch.log
$B/plant.sh PLUSATTR PLUSATTR tree $SP "$GP" chromium;  echo "PLUSATTR $(cat $S/logs/PLUSATTR.chromium.exit) $(date +%T)" >> $S/logs/chain-ch.log
$B/plant.sh TOKENF TOKENF tree $SP "$GA" chromium;  echo "TOKENF $(cat $S/logs/TOKENF.chromium.exit) $(date +%T)" >> $S/logs/chain-ch.log
$B/plant.sh OPA95F OPA95F tree $SP "$GA" chromium;  echo "OPA95F $(cat $S/logs/OPA95F.chromium.exit) $(date +%T)" >> $S/logs/chain-ch.log
echo "chain done $(date +%T)" >> $S/logs/chain-ch.log
