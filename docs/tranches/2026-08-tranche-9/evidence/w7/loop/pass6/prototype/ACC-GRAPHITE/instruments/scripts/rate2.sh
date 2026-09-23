#!/bin/bash
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-40/web/frontend
: > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/accg6/rate2.tsv
for i in 2 3 4 5; do for proj in chromium webkit; do
  BASE=http://127.0.0.1:4235 CLOCK=driven MATCH="front-rate-60hz.spec.ts" npx playwright test --config .accg6/pw.config.ts --project $proj > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/accg6/rate2-$proj-$i.log 2>&1
  echo -e "$proj\t$i\t$?\t$(grep -o 'join: [0-9]* d records, [0-9]* frames, [0-9]* bursts, worst [0-9.]*/s' /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/accg6/rate2-$proj-$i.log)" >> /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/accg6/rate2.tsv
done; done
echo ALLDONE >> /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/accg6/rate2.tsv
