#!/bin/zsh
# MODE and env per call; one engine per call; exit logged.
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_308fa864-c94-2/web/frontend || exit 1
tag=$1; eng=$2
PLAYWRIGHT_BASE_URL=${BASE:-http://127.0.0.1:4245} TIN_DPR=${DPR:-2} TIN_DIR=./inst TIN_MATCH='rows\.spec\.ts$' TIN_OUT=/tmp/tin5-rows-$tag-$eng \
  npx playwright test --config .paltin5/pw.mts --project $eng > .paltin5/logs/rows-$tag-$eng.log 2>&1
echo "EXIT=$?" >> .paltin5/logs/rows-$tag-$eng.log
