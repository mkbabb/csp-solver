#!/bin/bash
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/mrklivecrit7
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend
for arm in "4236 lane-dist" "4239 control-dist"; do set -- $arm; port=$1; lab=$2
 for sc in "chromium dark" "chromium light"; do set -- $sc
  echo "=== $lab $1 $2 rest load $(sysctl -n vm.loadavg)"
  node /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass7/instruments/paint-probes.mjs --url "http://127.0.0.1:$port/?size=3&board=ATMuMDAzMDA2MDgwMDUwNzAwMTAzMDA5MDIwMDUwMjAwNTA3MDAxMDYwMDkwMjAwODAxMDA0MDYwMDQwNjAwOTAyMDA4MDEwMDQwOTAwMzA1MDA4" --engine $1 --probe glyph --subject ".info-btn .info-glyph" --scheme $2 --dpr 2 --plants --frac-bound auto > $S/logs/row44-$lab-$1-$2.txt 2>&1
  echo "EXIT $?"; grep -vE "^\s*$" $S/logs/row44-$lab-$1-$2.txt | cut -c1-230 | head -12
 done
done
echo ALLDONE
