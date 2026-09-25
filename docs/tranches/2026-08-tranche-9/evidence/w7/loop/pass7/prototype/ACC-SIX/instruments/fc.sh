#!/bin/bash
# the filter census (e2e/filter-census.spec.ts, SIX's G3.1d/G3.3d dark arms) on three built dists, both engines
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-45/web/frontend
O=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/acc6p7-fc; mkdir -p $O; cd $W
for arm in integ:4241 control:4238 tree:4239; do n=${arm%%:*}; p=${arm##*:}
  for e in chromium webkit; do
    BASE=http://127.0.0.1:$p PWOUT=$O/pw-$n-$e npx playwright test -c .acc6p7/pw.config.ts e2e/filter-census.spec.ts --project=$e > $O/fc-$n-$e.log 2>&1
    echo "$n $e exit $? · load $(uptime | sed 's/.*averages: //' | cut -d' ' -f1) :: $(grep -E '^ +[0-9]+ (passed|failed|flaky|skipped)' $O/fc-$n-$e.log | tr -s ' ' | tr '\n' ' ') :: $(grep -E '✘' $O/fc-$n-$e.log | sed 's/.*› //' | cut -c1-70 | tr '\n' '|')"
  done
done
echo ALLDONE
