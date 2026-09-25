#!/bin/bash
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/accg7
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-40/web/frontend
for proj in chromium webkit; do
  for arm in inside:4235 outside:4240; do
    n=${arm%%:*}; p=${arm##*:}
    OUTDIR=$S/occl BASE=http://127.0.0.1:$p SIZES=4 MATCH=occl7.probe.ts npx playwright test --config .accg7/pw.config.ts --project $proj > $S/logs/occl-desk-$n-$proj.log 2>&1; echo "EXIT $?" >> $S/logs/occl-desk-$n-$proj.log
    OUTDIR=$S/occl BASE=http://127.0.0.1:$p SIZES=2,3,4 VW=393 VH=699 TOUCH=1 MATCH=occl7.probe.ts npx playwright test --config .accg7/pw.config.ts --project $proj > $S/logs/occl-phone-$n-$proj.log 2>&1; echo "EXIT $?" >> $S/logs/occl-phone-$n-$proj.log
  done
  OUTDIR=$S/frames MATCH=frames7.probe.ts npx playwright test --config .accg7/pw.config.ts --project $proj > $S/logs/frames-$proj.log 2>&1; echo "EXIT $?" >> $S/logs/frames-$proj.log
done
echo ALL > $S/logs/occl.done
