#!/bin/bash
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass7/prototype/MOT-VERB/instruments
echo "== RECORDER boot draw-in (subject: the RULED SUM of the transition layer; ROI the grid; eps 0.005 PROPOSED)"
for arm in "tree 4247 busy:150@1500" "front 4244 busy:150@700" "control 4248 busy:150@300"; do set -- $arm
 for eng in chromium webkit; do
  for plant in "" "--plant $3"; do
   echo "== $1 $eng $plant"
   node painted-frames.mjs --url http://127.0.0.1:$2/ --engine $eng --trigger load --roi .hand-drawn-grid --subject "ruled:svg.hand-drawn-grid > g:not(.boil-frame-layer) > path.grid-line" --window 3500 --runs 3 --eps 0.005 $plant > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/verb7/logs/rec.tmp 2>&1; rc=$?
   grep -E "RECORD|SELFTEST" /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/verb7/logs/rec.tmp | cut -c1-700; echo "exit $rc"
  done
 done
done
echo ALLDONE-REC
cd /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/verb7/inst
for arm in "serial 4247 150@1200" "front 4244 150@700" "control 4248 150@300"; do set -- $arm
 for eng in chromium webkit; do
  node boot-probe.mjs http://127.0.0.1:$2/ $eng 5 light no-preference 2>&1 | sed "s/^/$1 /" | cut -c1-560
  node boot-probe.mjs http://127.0.0.1:$2/ $eng 3 light no-preference $3 2>&1 | sed "s/^/$1 /" | cut -c1-560
 done
done
for arm in "serial 4247" "control 4248"; do set -- $arm
 node boot-probe.mjs http://127.0.0.1:$2/ chromium 2 dark no-preference 2>&1 | sed "s/^/$1 /" | cut -c1-560
 node boot-probe.mjs http://127.0.0.1:$2/ chromium 2 light reduce 2>&1 | sed "s/^/$1 /" | cut -c1-560
 node boot-probe.mjs http://127.0.0.1:$2/ webkit 2 light reduce 2>&1 | sed "s/^/$1 /" | cut -c1-560
done
echo ALLDONE
