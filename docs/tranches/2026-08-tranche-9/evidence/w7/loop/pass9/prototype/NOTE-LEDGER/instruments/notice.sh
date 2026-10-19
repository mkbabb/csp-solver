#!/bin/bash
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/NOTE-LEDGER
CTL=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-control/web/frontend/dist
for E in ${ENGINES:-chromium webkit}; do
  echo "start $E $(date +%T) load $(uptime | sed 's/.*averages: //')"
  node $S/bin/notice-probe.mjs $E Zm9vYmFyYmF6 control=$CTL union-preLEDGER9=$S/dist-wE union+LEDGER9=$S/dist-union tree=$S/dist-tree ${EXTRA}
  echo "exit $E $? $(date +%T) load $(uptime | sed 's/.*averages: //')"
done; echo DONE
