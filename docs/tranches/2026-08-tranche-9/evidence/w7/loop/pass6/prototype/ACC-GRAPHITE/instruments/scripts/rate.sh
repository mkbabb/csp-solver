#!/bin/bash
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-40/web/frontend
: > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/accg6/rate.tsv
for proj in chromium webkit; do
 for arm in tree:4235 ablated:4237; do
  for clk in driven 60 native; do
   n=${arm%%:*}; p=${arm##*:}
   BASE=http://127.0.0.1:$p CLOCK=$clk MATCH="front-rate-60hz.spec.ts" npx playwright test --config .accg6/pw.config.ts --project $proj > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/accg6/rate-$proj-$n-$clk.log 2>&1
   echo -e "$proj\t$n\t$clk\t$?\t$(grep -E 'G10 ' /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/accg6/rate-$proj-$n-$clk.log | sed 's/.*G10 [a-z]* //' | tr '\n' ' ')" >> /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/accg6/rate.tsv
  done
 done
done
echo ALLDONE >> /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/accg6/rate.tsv
