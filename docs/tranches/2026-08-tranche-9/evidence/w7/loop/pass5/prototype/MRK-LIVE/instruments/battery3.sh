#!/bin/zsh
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-35/web/frontend
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad
LOG=$S/battery3.log; : > $LOG
cd $W
npx playwright test -c .mrklive/pw.estate.config.ts focus-ring.spec.ts > $S/b3-lane-precure.log 2>&1; echo "EXIT[lane-precure-forced] $?" >> $LOG
grep -E '✓|✘|-\s+skipped|^\s+Error:' $S/b3-lane-precure.log >> $LOG
python3 $S/breaks.py B4-departure apply >> $LOG 2>&1; sleep 4
npx playwright test -c .mrklive/pw.estate.config.ts focus-ring.spec.ts --grep G-LIVE-20 > $S/brk-B4b.log 2>&1; echo "EXIT[B4-departure-recut] $?" >> $LOG
grep -E '✓|✘|^\s+Error:' $S/brk-B4b.log >> $LOG
python3 $S/breaks.py B4-departure restore >> $LOG 2>&1
echo BATTERY3-DONE >> $LOG
