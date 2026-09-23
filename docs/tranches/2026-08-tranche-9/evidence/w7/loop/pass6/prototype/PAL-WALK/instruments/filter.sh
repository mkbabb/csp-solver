#!/bin/bash
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_308fa864-c94-1/web/frontend || exit 1
: > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/palwalk6/logs/filter-summary.txt
for sch in dark light; do for arm in tree:4240 control:4245; do n=${arm%%:*}; p=${arm#*:}; for e in chromium webkit; do
  WALK_SCHEME=$sch PLAYWRIGHT_BASE_URL=http://127.0.0.1:$p WALK_OUT=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/palwalk6/tr-filter-$n-$sch-$e npx playwright test --config .palwalk6/pw-filter.mts --project $e > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/palwalk6/logs/filter-$n-$sch-$e.log 2>&1
  echo "$n $sch $e exit $? · $(grep -E '^ +[0-9]+ (passed|failed)' /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/palwalk6/logs/filter-$n-$sch-$e.log | tr -s ' ' | tr '\n' ' ')" >> /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/palwalk6/logs/filter-summary.txt
done; done; done
echo FILTER_DONE >> /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/palwalk6/logs/filter-summary.txt
