#!/bin/bash
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-52/web/frontend
PLRC_DIR=. PLRC_WORKERS=1 npx playwright test -c .plrc7crit/pw.config.ts crit7b.spec.ts -g SEEDCRIT > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrc7crit/logs/seed.log 2>&1; echo "EXIT[seed]=$? load $(sysctl -n vm.loadavg)"
python3 /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrc7crit/breaks.py HEAD12F
PLRC_DIR=. PLRC_WORKERS=1 npx playwright test -c .plrc7crit/pw.config.ts pi7.spec.ts > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrc7crit/logs/pi7.log 2>&1; echo "EXIT[pi7]=$? load $(sysctl -n vm.loadavg)"
echo RUN2-DONE
