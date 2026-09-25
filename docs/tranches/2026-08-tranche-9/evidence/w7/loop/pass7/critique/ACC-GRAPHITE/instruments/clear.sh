#!/bin/bash
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-40/web/frontend
for vp in "393 699" "812 375"; do set -- $vp
for proj in chromium webkit; do
  ARMS='[["INSIDE","http://127.0.0.1:4235"],["OUTSIDE","http://127.0.0.1:4237"],["control","http://127.0.0.1:4236"]]' VW=$1 VH=$2 TOUCH=1 MATCH=clear.crit.ts npx playwright test --config .accg7crit/pw.config.ts --project $proj > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/accg7crit-logs/clear-$1-$proj.log 2>&1
  echo "EXIT $proj $? load $(sysctl -n vm.loadavg)" >> /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/accg7crit-logs/clear-$1-$proj.log
done; done
echo DONE > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/accg7crit-logs/clear.done
