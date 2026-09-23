#!/bin/zsh
# e2e-battery.sh <port> <tag> — drawer.spec (both engines), the throttle-config bake specs, goldens; against a lane port
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_3b66f064-970-16/web/frontend
L=.gmotion/e2e-$2.log; : > $L
export PLAYWRIGHT_BASE_URL=http://127.0.0.1:$1
echo "== drawer.spec chromium" >> $L; timeout 280 npx playwright test --config .gmotion/pw-main.config.mts e2e/drawer.spec.ts --project chromium >> $L 2>&1; echo "exit $?" >> $L
echo "== drawer.spec webkit" >> $L; timeout 280 npx playwright test --config .gmotion/pw-main.config.mts e2e/drawer.spec.ts --project webkit >> $L 2>&1; echo "exit $?" >> $L
echo "== gallery.spec chromium" >> $L; timeout 280 npx playwright test --config .gmotion/pw-main.config.mts e2e/gallery.spec.ts --project chromium >> $L 2>&1; echo "exit $?" >> $L
echo "== throttle-config bake specs" >> $L; timeout 400 npx playwright test --config playwright-throttle.config.ts e2e/filter-census.spec.ts e2e/theme-bake-freshness.spec.ts e2e/wordmark-integrity.spec.ts e2e/theme-quadrants.spec.ts --reporter=line --output .gmotion/pw-results-t >> $L 2>&1; echo "exit $?" >> $L
echo "== goldens" >> $L; timeout 280 npx playwright test --config playwright-golden.config.ts --reporter=line --output .gmotion/pw-results-g >> $L 2>&1; echo "exit $?" >> $L
echo DONE >> $L
