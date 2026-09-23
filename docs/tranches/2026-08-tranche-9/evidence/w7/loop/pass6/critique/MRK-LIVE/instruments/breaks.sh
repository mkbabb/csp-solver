#!/bin/bash
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-35/web/frontend
C=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/mrklivecrit6
LOG=$C/breaks.log; : > $LOG
cd $W
run() { echo "== $1" >> $LOG; npx playwright test -c .mrklivecrit6/pw.config.ts focus-ring.spec.ts $2 > $C/brk-$1.log 2>&1; echo "EXIT[$1] $?" >> $LOG; grep -E '✓|✘|passed|failed' $C/brk-$1.log | sed -E 's/ \([0-9.]+s\)//' | sed 's/^/   /' >> $LOG; grep -E '^\s+Error: |G-LIVE-16\]|G-LIVE-16 plants\]' $C/brk-$1.log | cut -c1-700 | sed 's/^/     /' >> $LOG; }
for n in $PLANTS; do
  python3 $C/plants.py $n apply >> $LOG 2>&1
  sleep 5
  run $n "$GREP"
  python3 $C/plants.py $n restore >> $LOG 2>&1
  sleep 4
done
echo BREAKS-DONE >> $LOG
