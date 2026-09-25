#!/bin/bash
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-40/web/frontend
cp /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/accg7crit-cfg/occl7.crit.ts.staged .accg7crit/occl7.crit.ts
for arm in "INSIDE 4235" "OUTSIDE 4237"; do set -- $arm
for proj in chromium webkit; do
  BASE=http://127.0.0.1:$2 SIZES=4 VW=812 VH=375 TOUCH=1 OUTDIR=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/accg7crit-occl MATCH=occl7.crit.ts npx playwright test --config .accg7crit/pw.config.ts --project $proj > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/accg7crit-logs/occl-812-$1-$proj.log 2>&1
  echo "EXIT $proj $? load $(sysctl -n vm.loadavg)" >> /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/accg7crit-logs/occl-812-$1-$proj.log
done; done
sed -i '' 's/transform:translateY(-12px) !important/translate:0 -12px !important/' .accg7crit/clear.crit.ts
for proj in chromium webkit; do
  ARMS='[["OUTSIDE","http://127.0.0.1:4237"],["control","http://127.0.0.1:4236"]]' VW=393 VH=699 TOUCH=1 MATCH=clear.crit.ts npx playwright test --config .accg7crit/pw.config.ts --project $proj > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/accg7crit-logs/clear2-393-$proj.log 2>&1
  echo "EXIT $proj $? load $(sysctl -n vm.loadavg)" >> /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/accg7crit-logs/clear2-393-$proj.log
done
/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/accg7crit-cfg/band-x6.sh
echo DONE > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/accg7crit-logs/occl.done
