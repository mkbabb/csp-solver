#!/bin/zsh
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-35/web/frontend
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad
LOG=$S/breaks.log; : > $LOG
cd $W
run() { echo "== $1 :: $2" >> $LOG; npx playwright test -c .mrklive/pw.estate.config.ts focus-ring.spec.ts --grep "$2" > $S/brk-$1.log 2>&1; echo "EXIT[$1] $?" >> $LOG; grep -E '✓|✘|^\s+Error:' $S/brk-$1.log | sed 's/^/   /' >> $LOG; }
run LANE-AS-IS "G-LIVE"
MRKLIVE_TAG=as-is npx playwright test -c .mrklive/pw.probe.config.ts p5-visible >> $S/vis.log 2>&1
for b in B1-publisher:G-LIVE-19 B2-motion-note:G-LIVE-19 B3-fallback:G-LIVE-19 B4-departure:G-LIVE-20 B5-tier1:G-LIVE-14 B6-no-ring:G-LIVE-16 B7-dup-reg:G-LIVE-19; do
  n=${b%%:*}; g=${b##*:}
  python3 $S/breaks.py $n apply >> $LOG 2>&1
  sleep 4
  run $n "$g"
  [ $n = B1-publisher ] && MRKLIVE_TAG=B1-publisher-deleted npx playwright test -c .mrklive/pw.probe.config.ts p5-visible >> $S/vis.log 2>&1
  python3 $S/breaks.py $n restore >> $LOG 2>&1
  sleep 3
done
run LANE-RESTORED "G-LIVE"
echo BREAKS-DONE >> $LOG
