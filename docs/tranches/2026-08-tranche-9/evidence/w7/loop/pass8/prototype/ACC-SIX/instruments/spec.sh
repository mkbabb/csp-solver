#!/bin/bash
# spec.sh <label> <spec> [engines] : run one spec against :4237 (tree or plant) with the control on :4250; bare exits
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-45/web/frontend
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/six8
label=$1; spec=$2; cd $W
for eng in ${3:-chromium webkit}; do
  ld=$(uptime | sed 's/.*averages: //' | cut -d' ' -f1)
  env $EXTRA BASE=http://127.0.0.1:4237 CONTROL=http://127.0.0.1:4250 PWOUT=$S/pw-$label-$eng npx playwright test -c .acc6p8/pw.config.ts e2e/$spec --project=$eng > $S/logs/$label-$eng.log 2>&1
  rc=$?
  echo "$label $eng exit $rc · load $ld · served $(curl -s http://127.0.0.1:4237/ | grep -o 'index-[A-Za-z0-9_-]*\.js' | head -1)"
done
