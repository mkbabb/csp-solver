#!/bin/zsh
LOG=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/crit-NOTE-LEDGER/logs/notice.txt; : > $LOG
for E in chromium webkit; do
  echo "start $E $(date +%T) load $(uptime | sed 's/.*averages: //')" >> $LOG
  node /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/crit-NOTE-LEDGER/bin/notice-probe.mjs $E Zm9vYmFyYmF6 control=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-control/web/frontend/dist union-noLEDGER9=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/crit-NOTE-LEDGER/dist-wE0 union+LEDGER9=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/crit-NOTE-LEDGER/dist-waveE tree=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/crit-NOTE-LEDGER/dist-tree >> $LOG 2>&1
  echo "exit $E $? $(date +%T) load $(uptime | sed 's/.*averages: //')" >> $LOG
done; echo DONE >> $LOG
