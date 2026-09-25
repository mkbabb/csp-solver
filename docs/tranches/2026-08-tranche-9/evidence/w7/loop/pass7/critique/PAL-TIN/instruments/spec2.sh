#!/bin/bash
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/tincrit7
until grep -q DONE $S/logs/spec.txt; do sleep 5; done
cd $S/arch/web/frontend || exit 9
r() { # tag port engine instr
  local lg=$S/logs/spec-$1-$3.log
  echo "load $(uptime | sed 's/.*averages*: //') · siblings $(pgrep -f 'vitest|playwright' | wc -l | tr -d ' ') · $(date +%T)" > $lg
  T9_INSTRUMENTS=$4 PLAYWRIGHT_BASE_URL=http://127.0.0.1:$2 TC_OUT=$S/out/$1-$3 npx playwright test --config .tincrit7/pw.mts --project $3 -g "§2b" >> $lg 2>&1
  echo "EXIT=$? $(date +%T)" >> $lg; echo "$1 $3 $(tail -1 $lg)" >> $S/logs/spec.txt
}
r rerun2 4245 chromium $S/instr/
r rerun3 4245 chromium $S/instr/
r chaircopy 4245 chromium /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass7/instruments/
echo DONE2 >> $S/logs/spec.txt
