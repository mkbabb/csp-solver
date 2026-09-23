#!/bin/sh
# On the final prototype dist: G6 re-read, then a11y 3.4 and the filter census in both engines against BOTH
# served dists (control 4256, prototype 4255), chunked by project; never the estate's webServer (port 3000).
P=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_3b66f064-970-17/docs/tranches/2026-08-tranche-9/evidence/w7/intake-owner-2026-09-22/prototype/G-INFO/probe
F=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_3b66f064-970-17/web/frontend
O=$F/.intake/out
cd "$F" || exit 1
uptime
node $P/rate.mjs webkit 12 $O/rate2-webkit.json > $O/rate2-webkit.log 2>&1; echo "rate2-webkit $?"
node $P/rate.mjs chromium 10 $O/rate2-chromium.json > $O/rate2-chromium.log 2>&1; echo "rate2-chromium $?"
uptime
for port in 4255 4256; do
  for pr in chromium webkit; do
    PLAYWRIGHT_BASE_URL=http://127.0.0.1:$port/ ./node_modules/.bin/playwright test --config .intake/pw.mts --project $pr e2e/a11y.spec.ts -g "keyboard-shortcuts help" > $O/a11y-$port-$pr.log 2>&1; echo "a11y-$port-$pr $?"
    PLAYWRIGHT_BASE_URL=http://127.0.0.1:$port/ ./node_modules/.bin/playwright test --config playwright-throttle.config.ts --project filter-census-$pr --output .intake/pw-out-fc > $O/fc-$port-$pr.log 2>&1; echo "fc-$port-$pr $?"
  done
done
echo DONE
