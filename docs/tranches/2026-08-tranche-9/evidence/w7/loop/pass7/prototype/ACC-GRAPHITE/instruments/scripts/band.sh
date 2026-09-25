#!/bin/bash
# band.sh <tag> [env...]: band7.crit.ts both engines, tree :4235 vs control :4236; prints G2p7 lines
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/accg7
TAG=$1; shift
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-40/web/frontend
for proj in chromium webkit; do
  env "$@" OUTDIR=$S/band-$TAG TREE_URL=${TREE_URL:-http://127.0.0.1:4235} CONTROL_URL=${CONTROL_URL:-http://127.0.0.1:4236} MATCH=band7.crit.ts npx playwright test --config .accg7/pw.config.ts --project $proj > $S/logs/band-$TAG-$proj.log 2>&1
  echo "EXIT $proj $? load $(sysctl -n vm.loadavg)" >> $S/logs/band-$TAG-$proj.log
done
echo DONE > $S/logs/band-$TAG.done
