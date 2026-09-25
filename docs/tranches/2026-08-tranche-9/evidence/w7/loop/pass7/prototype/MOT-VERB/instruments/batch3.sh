#!/bin/bash
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-59/web/frontend
BASE=http://127.0.0.1:4247 npx playwright test --config .verb7/pw.config.mts fold-verb --repeat-each 5 > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/verb7/logs/fv-final5.log 2>&1; echo "GA1 final x5 exit $?"
tail -2 /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/verb7/logs/fv-final5.log
for arm in "tree 4247" "control 4248"; do set -- $arm
 BASE=http://127.0.0.1:$2 npx playwright test --config .verb7/pw.config.mts filter-census > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/verb7/logs/fc-$1.log 2>&1; echo "filter-census $1 exit $?"; grep -E "passed|failed" /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/verb7/logs/fc-$1.log | tail -2
done
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass7/prototype/MOT-VERB/instruments
for eng in chromium webkit; do for plant in "" "--plant busy:150@1500"; do
  echo "== final tree $eng $plant"
  node painted-frames.mjs --url "http://127.0.0.1:4247/?game=sudoku&board=ATMuMDM0NjA4OTEyNjAyMTk1MzQ4MTk4MzAyNTY3ODU5NzYxNDIzMDI2ODAzNzkxNzEzOTI0ODU2OTAxNTM3MjA0Mjg3NDE5NjM1MzA1Mjg2MTcw" --engine $eng --trigger load --roi .hand-drawn-grid --subject "ruled:svg.hand-drawn-grid > g:not(.boil-frame-layer) > path.grid-line" --window 3500 --runs 3 --eps 0.005 $plant > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/verb7/logs/rec3.tmp 2>&1; rc=$?
  grep -E "RECORD|SELFTEST" /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/verb7/logs/rec3.tmp | cut -c1-600; echo "exit $rc"
done; done
cd /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/verb7/inst
node frame-b23.mjs /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/verb7/b23-hinge-vs-sheet.png 100 ATMuMDM0NjA4OTEyNjAyMTk1MzQ4MTk4MzAyNTY3ODU5NzYxNDIzMDI2ODAzNzkxNzEzOTI0ODU2OTAxNTM3MjA0Mjg3NDE5NjM1MzA1Mjg2MTcw
echo ALLDONE
