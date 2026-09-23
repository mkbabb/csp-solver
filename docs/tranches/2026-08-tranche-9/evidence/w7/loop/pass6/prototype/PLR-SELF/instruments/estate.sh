#!/bin/bash
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-p4-PLR-SELF/web/frontend
for proj in chromium webkit; do
  npx playwright test -c .plr-self/pw.estate.mts player-mark.spec.ts multiplayer.spec.ts session-substrate.spec.ts join-language-prm.spec.ts presence.spec.ts masthead-alignment.spec.ts a11y.spec.ts --project=$proj --retries=0 > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrself6/logs/estate-$proj.log 2>&1; echo "$proj exit $?"
done
echo ESTATE-DONE
