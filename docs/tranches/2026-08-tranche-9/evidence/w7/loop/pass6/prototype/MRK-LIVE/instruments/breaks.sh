#!/bin/bash
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-35/web/frontend
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/mrklive-p6
LOG=$S/breaks-final.log; : > $LOG
cd $W
run() { echo "== $1" >> $LOG; npx playwright test -c .mrklive-p6/pw.estate.config.ts focus-ring.spec.ts > $S/brkF-$1.log 2>&1; echo "EXIT[$1] $?" >> $LOG; grep -E '✓|✘|passed|failed' $S/brkF-$1.log | sed -E 's/ \([0-9.]+s\)//' | sed 's/^/   /' >> $LOG; grep -E '^\s+Error: |G-LIVE-16 plants\]|\[G-LIVE-21 guard\]' $S/brkF-$1.log | cut -c1-260 | sed 's/^/     /' >> $LOG; }
for n in X1-ring-ink-deleted X2-ghost-opacity-0 X3-laminate-masked R2-stop-on-reversed G-guard-outline-none G22-inset-100; do
  python3 $S/plants.py $n apply >> $LOG 2>&1
  sleep 4
  run $n
  python3 $S/plants.py $n restore >> $LOG 2>&1
  sleep 3
done
run LANE-RESTORED
echo BREAKS-DONE >> $LOG
