#!/bin/sh
# The e2e specs that address the strip (share-truth's re-addressed Share, zone-grammar's bar rows, access.spec's
# focus-under-the-bar row), on the prototype dist and the HEAD control, one engine per run.
F=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_3b66f064-970-17/web/frontend
O=$F/.intake/out
cd "$F" || exit 1
for port in 4255 4256; do
  for pr in chromium webkit; do
    PLAYWRIGHT_BASE_URL=http://127.0.0.1:$port/ ./node_modules/.bin/playwright test e2e/share-truth.spec.ts e2e/zone-grammar.spec.ts e2e/access.spec.ts --config .intake/pw.mts --project=$pr --workers=2 > $O/e2e-$port-$pr.log 2>&1
    echo "e2e-$port-$pr $?"
    grep -E "passed|failed|skipped|flaky" $O/e2e-$port-$pr.log | tail -4
  done
done
echo DONE
