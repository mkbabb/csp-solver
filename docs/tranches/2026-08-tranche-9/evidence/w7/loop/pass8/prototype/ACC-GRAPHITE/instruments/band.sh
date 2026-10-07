#!/bin/bash
# band.sh <tag> <MATCH> [env...] — both engines, one run each; OUTDIR + log per tag; tree 4259, control 4260.
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/graphite8
TAG=$1; M=$2; shift 2
cd $S/pw
for proj in chromium webkit; do
  LOG=$S/logs/band-$TAG-$proj.log
  echo "START $proj load $(sysctl -n vm.loadavg) tree $(curl -s http://127.0.0.1:4259/ | grep -o 'index-[A-Za-z0-9_-]*\.js' | head -1) control $(curl -s http://127.0.0.1:4260/ | grep -o 'index-[A-Za-z0-9_-]*\.js' | head -1) env $*" > $LOG
  env "$@" OUTDIR=$S/out-band-$TAG TREE_URL=http://127.0.0.1:4259 CONTROL_URL=http://127.0.0.1:4260 MATCH=$M PW_OUT=$S/pwout-$TAG-$proj \
    /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-40/web/frontend/node_modules/.bin/playwright test --config $S/pw/pw.config.ts --project=$proj >> $LOG 2>&1
  echo "EXIT $proj $? load $(sysctl -n vm.loadavg)" >> $LOG
done
echo DONE > $S/logs/band-$TAG.done
