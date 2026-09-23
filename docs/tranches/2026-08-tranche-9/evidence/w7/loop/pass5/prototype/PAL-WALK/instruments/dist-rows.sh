#!/bin/zsh
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_308fa864-c94-1/web/frontend || exit 1
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/palwalk5
PLAYWRIGHT_BASE_URL=http://127.0.0.1:${PORT:-4230} npx playwright test --config playwright-golden.config.ts --output $S/tr-golden > .palwalk5/logs/golden-${TAG:-tree}.log 2>&1; echo "EXIT=$?" >> .palwalk5/logs/golden-${TAG:-tree}.log
for e in chromium webkit; do
PLAYWRIGHT_BASE_URL=http://127.0.0.1:${PORT:-4230} WALK_DPR=1 WALK_MATCH='filter-census\.spec\.ts$' WALK_OUT=$S/tr-census-$e npx playwright test --config .palwalk5/pw.mts --project $e > .palwalk5/logs/census-${TAG:-tree}-$e.log 2>&1; echo "EXIT=$?" >> .palwalk5/logs/census-${TAG:-tree}-$e.log
done
