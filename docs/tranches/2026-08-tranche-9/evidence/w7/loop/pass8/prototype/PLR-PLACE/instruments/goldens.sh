#!/bin/bash
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/place8
T=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-p4-PLR-PLACE/web/frontend
L=$S/logs/goldens.txt; cd $T
for p in 4243 4251; do
  PLAYWRIGHT_BASE_URL=http://127.0.0.1:$p PLAYWRIGHT_HTML_REPORT=$S/golden-report-$p PLAYWRIGHT_HTML_OPEN=never npx playwright test -c playwright-golden.config.ts --output $S/golden-out-$p > $S/logs/golden-$p.log 2>&1; echo "goldens :$p exit=$?" >> $L
  grep -E "✓|✘|passed|failed|skipped" $S/logs/golden-$p.log | cut -c1-140 >> $L
done
echo DONE >> $L
