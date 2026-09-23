#!/bin/zsh
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_308fa864-c94-2/web/frontend
B=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit/logs/battery.txt; : > $B
r() { local n=$1; shift; "$@" > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit/logs/bat-${n//[^a-zA-Z0-9]/_}.log 2>&1; echo "$n exit $?" >> $B; }
r "eslint ." npx eslint .
r "prettier --check" npx prettier --check .
r "lint:motion" npm run -s lint:motion
r "lint:ink" npm run -s lint:ink
r "typecheck:e2e" npm run -s typecheck:e2e
r "vitest useSession.test.ts" npx vitest run src/games/shared/useSession.test.ts
r "vitest src/games/shared chunk" npx vitest run src/games/shared
echo BATTERY_DONE >> $B
