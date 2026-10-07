#!/bin/bash
C=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit-acc5
T=http://127.0.0.1:4236; K=http://127.0.0.1:4251; F=front-rate.spec.ts; TF=tally-flash.spec.ts
echo "CHAIN-A START $(date +%T) load $(uptime | sed 's/.*averages: //')" > $C/logs/chainA.log
$C/run.sh tpanel $T 1 $F "G10-panel" "chromium webkit"; echo "tpanel $(date +%T)" >> $C/logs/chainA.log
$C/run.sh t60 $T 2 $F "G10: every" "chromium webkit" HZ=60; echo "t60 $(date +%T)" >> $C/logs/chainA.log
$C/run.sh t30 $T 1 $F "G10: every" "chromium webkit" HZ=30; echo "t30 $(date +%T)" >> $C/logs/chainA.log
$C/run.sh tflash $T 1 $TF "tally" "chromium webkit"; echo "tflash $(date +%T)" >> $C/logs/chainA.log
$C/run.sh kflash $K 1 $TF "tally" "chromium webkit"; echo "kflash $(date +%T)" >> $C/logs/chainA.log
echo "CHAIN-A DONE $(date +%T) load $(uptime | sed 's/.*averages: //')" >> $C/logs/chainA.log
