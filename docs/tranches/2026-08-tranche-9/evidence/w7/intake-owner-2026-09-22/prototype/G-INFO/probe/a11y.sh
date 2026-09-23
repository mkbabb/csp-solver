#!/bin/sh
# a11y 3.4 (e2e/a11y.spec.ts, the "3.4" describe) on both served dists, both engines, one project per run.
F=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_3b66f064-970-17/web/frontend
O=$F/.intake/out
cd "$F" || exit 1
for port in 4255 4256; do
  for pr in chromium webkit; do
    PLAYWRIGHT_BASE_URL=http://127.0.0.1:$port/ ./node_modules/.bin/playwright test e2e/a11y.spec.ts --config .intake/pw.mts --project=$pr -g "3.4" > $O/a11y-$port-$pr.log 2>&1
    echo "a11y-$port-$pr $?"
    grep -E "passed|failed|skipped" $O/a11y-$port-$pr.log | tail -3
  done
done
echo DONE
