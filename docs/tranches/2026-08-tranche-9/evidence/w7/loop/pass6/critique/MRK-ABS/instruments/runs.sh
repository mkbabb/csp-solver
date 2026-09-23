#!/bin/bash
cd /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit6-abs/lane/web/frontend
run() { # tag base e2e grep project
  echo "=== $1 start $(date +%T)" >> /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit6-abs/runs.log
  TAG=$1 BASE=$2 E2E=$3 npx playwright test --config .crit6abs/pw.config.ts $4 > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit6-abs/run-$1.log 2>&1
  echo "=== $1 EXIT $? $(date +%T)" >> /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit6-abs/runs.log
}
run p18 http://127.0.0.1:4239 /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit6-abs/p18/web/frontend/e2e "--grep G-ABS-5 --project chromium"
run lane http://127.0.0.1:4239 /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit6-abs/lane/web/frontend/e2e ""
run armH http://127.0.0.1:4244 /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit6-abs/lane/web/frontend/e2e "--grep G-ABS-5"
run plantclip http://127.0.0.1:4245 /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit6-abs/lane/web/frontend/e2e "--grep G-ABS-(3|4 ) --project chromium"
run ctl http://127.0.0.1:4240 /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit6-abs/lane/web/frontend/e2e ""
echo ALLDONE >> /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit6-abs/runs.log
