#!/bin/bash
SP=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad; T=$SP/nlcrit6-tree/web/frontend; cd $T
for pair in control:4231 hold:4232 tint:4233; do n=${pair%%:*}; p=${pair#*:}
  PLAYWRIGHT_BASE_URL=http://127.0.0.1:$p/ npx playwright test --config .nlcrit6/pw.fc.config.ts > $SP/nlcrit6-logs/fc-$n.log 2>&1
  echo "filter-census $n :$p exit=$? $(grep -E '[0-9]+ (passed|failed)' $SP/nlcrit6-logs/fc-$n.log | tr '\n' ' ')"
done; echo FC-DONE
