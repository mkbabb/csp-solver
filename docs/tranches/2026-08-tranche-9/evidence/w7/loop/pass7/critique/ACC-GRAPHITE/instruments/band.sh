#!/bin/bash
# band.sh <tag> <MATCH> [env...]
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad; TAG=$1; M=$2; shift 2
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-40/web/frontend
for proj in chromium webkit; do
  env "$@" OUTDIR=$S/accg7crit-band-$TAG TREE_URL=${TREE_URL:-http://127.0.0.1:4235} CONTROL_URL=${CONTROL_URL:-http://127.0.0.1:4236} MATCH=$M npx playwright test --config .accg7crit/pw.config.ts --project $proj > $S/accg7crit-logs/band-$TAG-$proj.log 2>&1
  echo "EXIT $proj $? load $(sysctl -n vm.loadavg)" >> $S/accg7crit-logs/band-$TAG-$proj.log
done
echo DONE > $S/accg7crit-logs/band-$TAG.done
