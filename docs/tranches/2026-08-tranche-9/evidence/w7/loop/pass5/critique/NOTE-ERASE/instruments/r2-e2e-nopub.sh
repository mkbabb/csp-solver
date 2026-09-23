#!/bin/zsh
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-47/web/frontend
echo "== N1 drop-clock row on the NO-PUBLISHER dist (4248 rDNFsnQN1BD6), both engines"; PLAYWRIGHT_BASE_URL=http://127.0.0.1:4248 npx playwright test --config .erase-crit5/pw.e2e.config.ts e2e/affordances.spec.ts -g "drop clock"; echo "N1 exit=$?"
echo "== N2 drop-clock row on the TREE dist (4246 B5bclKNTuHnj), both engines"; PLAYWRIGHT_BASE_URL=http://127.0.0.1:4246 npx playwright test --config .erase-crit5/pw.e2e.config.ts e2e/affordances.spec.ts -g "drop clock"; echo "N2 exit=$?"
echo DONE
