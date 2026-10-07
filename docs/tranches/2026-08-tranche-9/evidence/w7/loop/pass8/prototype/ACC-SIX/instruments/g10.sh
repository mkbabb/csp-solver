#!/bin/bash
# g10.sh <label> : G10 on whatever :4237 serves — HZ 125 x3, 60 x3, 30 x2, the panel x1, per engine (RUNS overrides)
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-45/web/frontend
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/six8
label=$1; cd $W
for spec in ${RUNS:-125a 125b 125c 60a 60b 60c 30a 30b panel}; do
  for eng in ${ENGS:-chromium webkit}; do
    hz=${spec%[abc]}; grep="G10: every"; [ "$spec" = panel ] && { hz=125; grep="G10-panel"; }
    ld=$(uptime | sed 's/.*averages: //' | cut -d' ' -f1)
    HZ=$hz BASE=http://127.0.0.1:4237 PWOUT=$S/pw-g10-$label-$spec-$eng npx playwright test -c .acc6p8/pw.config.ts e2e/front-rate.spec.ts --project=$eng --grep "$grep" > $S/logs/g10-$label-$spec-$eng.log 2>&1
    rc=$?
    echo "G10RUN $label $spec $eng exit $rc load $ld served $(curl -s http://127.0.0.1:4237/ | grep -o 'index-[A-Za-z0-9_-]*\.js' | head -1) :: $(grep -h 'CLAUSES' $S/logs/g10-$label-$spec-$eng.log | sed 's/.*CLAUSES //' | head -1)"
  done
done
echo G10DONE $(date +%T)
