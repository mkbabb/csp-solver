#!/bin/bash
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/tincrit7
export T9_INSTRUMENTS=$S/instr/
cd $S/arch/web/frontend || exit 9
r() { # tag port engine grep
  local lg=$S/logs/spec-$1-$3.log
  echo "load $(uptime | sed 's/.*averages*: //') · siblings $(pgrep -f 'vitest|playwright' | wc -l | tr -d ' ') · $(date +%T)" > $lg
  if [ -n "$4" ]; then PLAYWRIGHT_BASE_URL=http://127.0.0.1:$2 TC_OUT=$S/out/$1-$3 npx playwright test --config .tincrit7/pw.mts --project $3 -g "$4" >> $lg 2>&1
  else PLAYWRIGHT_BASE_URL=http://127.0.0.1:$2 TC_OUT=$S/out/$1-$3 npx playwright test --config .tincrit7/pw.mts --project $3 >> $lg 2>&1; fi
  echo "EXIT=$? $(date +%T)" >> $lg; echo "$1 $3 $(tail -1 $lg)" >> $S/logs/spec.txt
}
r whole 4245 chromium
r whole 4245 webkit
r faint 4246 chromium "§2b"
r faint 4246 webkit "§2b"
echo DONE >> $S/logs/spec.txt
