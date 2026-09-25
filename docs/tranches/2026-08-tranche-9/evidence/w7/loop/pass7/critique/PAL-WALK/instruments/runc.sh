#!/bin/bash
cd /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw7/rep/web/frontend
for cfg in "chromium 2" "webkit 2" "chromium 1"; do
  set -- $cfg
  echo "LOAD $(sysctl -n vm.loadavg) procs $(pgrep -f 'playwright|vitest' | wc -l)" > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw7/logs/c-$1-$2.log
  WALK_DPR=$2 WALK_MATCH='critw7\.spec\.ts$' WALK_OUT=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw7/pwout-$1-$2 npx playwright test -c .critpw7/pw.mts --project $1 -g "§C" >> /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw7/logs/c-$1-$2.log 2>&1
  echo "EXIT=$?" >> /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw7/logs/c-$1-$2.log
done
echo ALLDONE > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw7/logs/c-done.log
