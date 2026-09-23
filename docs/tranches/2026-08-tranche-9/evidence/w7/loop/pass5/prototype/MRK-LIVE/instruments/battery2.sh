#!/bin/zsh
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-35/web/frontend
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad
LOG=$S/battery2.log; : > $LOG
cd $W
npx playwright test -c .mrklive/pw.estate.config.ts focus-ring.spec.ts --grep G-LIVE-19 > $S/g19-asis.log 2>&1; echo "EXIT[g19-asis] $?" >> $LOG
grep -E '✓|✘|^\s+Error:' $S/g19-asis.log >> $LOG
python3 $S/breaks.py B7-dup-reg apply >> $LOG 2>&1; sleep 4
npx playwright test -c .mrklive/pw.estate.config.ts focus-ring.spec.ts --grep G-LIVE-19 > $S/brk-B7b.log 2>&1; echo "EXIT[B7-dup-reg-recut] $?" >> $LOG
grep -E '✓|✘|^\s+Error:' $S/brk-B7b.log >> $LOG
python3 $S/breaks.py B7-dup-reg restore >> $LOG 2>&1; sleep 3
python3 $S/breaks.py B1-publisher apply >> $LOG 2>&1; sleep 4
MRKLIVE_TAG=B1-publisher-deleted-guarded npx playwright test -c .mrklive/pw.probe.config.ts p5-visible >> $S/vis.log 2>&1
python3 $S/breaks.py B1-publisher restore >> $LOG 2>&1; sleep 3
MRKLIVE_TAG=as-is-guarded npx playwright test -c .mrklive/pw.probe.config.ts p5-visible >> $S/vis.log 2>&1
MRKLIVE_TAG=cure npx playwright test -c .mrklive/pw.probe.config.ts p5-departure > $S/dep-cure.log 2>&1; echo "EXIT[dep-cure] $?" >> $LOG
python3 $S/breaks.py B4-departure apply >> $LOG 2>&1; sleep 4
MRKLIVE_TAG=nocure npx playwright test -c .mrklive/pw.probe.config.ts p5-departure > $S/dep-nocure.log 2>&1; echo "EXIT[dep-nocure] $?" >> $LOG
python3 $S/breaks.py B4-departure restore >> $LOG 2>&1; sleep 3
python3 $S/breaks.py B8-shadow-note apply >> $LOG 2>&1; sleep 4
npx playwright test -c .mrklive/pw.estate.config.ts focus-ring.spec.ts --grep G-LIVE-19 > $S/brk-B8.log 2>&1; echo "EXIT[B8-shadow-note] $?" >> $LOG
grep -E '✓|✘|^\s+Error:' $S/brk-B8.log >> $LOG
python3 $S/breaks.py B8-shadow-note restore >> $LOG 2>&1; sleep 3
MRKLIVE_TAG=lane npx playwright test -c .mrklive/pw.probe.config.ts p5-forced > $S/forced-lane.log 2>&1; echo "EXIT[forced-lane] $?" >> $LOG
MRKLIVE_TAG=control-74a2b5d9 PLAYWRIGHT_BASE_URL=http://127.0.0.1:4239 npx playwright test -c .mrklive/pw.probe.config.ts p5-forced > $S/forced-ctrl.log 2>&1; echo "EXIT[forced-ctrl] $?" >> $LOG
echo BATTERY2-DONE >> $LOG
