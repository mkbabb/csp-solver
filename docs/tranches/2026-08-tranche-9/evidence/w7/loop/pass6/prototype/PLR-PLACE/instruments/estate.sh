#!/bin/bash
R=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plr-place-p6-work
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-p4-PLR-PLACE/web/frontend
for pr in chromium webkit; do
  PLC_PORT=4243 npx playwright test -c .plr-place/pw.config.ts e2e/player-place.spec.ts --project=$pr > $R/est-place-$pr.log 2>&1; echo "player-place $pr exit=$? $(grep -E '^\s+[0-9]+ (passed|failed|skipped|flaky)' $R/est-place-$pr.log | tr -s ' ' | tr '\n' ' ')" >> $R/estate.txt
  PLC_PORT=4243 npx playwright test -c .plr-place/pw.config.ts e2e/player-mark.spec.ts e2e/session-substrate.spec.ts e2e/presence.spec.ts e2e/join-language-prm.spec.ts e2e/multiplayer.spec.ts --project=$pr > $R/est-other-$pr.log 2>&1; echo "mark+substrate+presence+join+multiplayer $pr exit=$? $(grep -E '^\s+[0-9]+ (passed|failed|skipped|flaky)' $R/est-other-$pr.log | tr -s ' ' | tr '\n' ' ')" >> $R/estate.txt
done
PLC_PORT=4247 npx playwright test -c .plr-place/pw.config.ts e2e/filter-census.spec.ts > $R/est-filter.log 2>&1; echo "filter-census dist 4247 both exit=$? $(grep -E '^\s+[0-9]+ (passed|failed|skipped)' $R/est-filter.log | tr -s ' ' | tr '\n' ' ')" >> $R/estate.txt
echo DONE >> $R/estate.txt
