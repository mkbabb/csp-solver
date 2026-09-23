#!/bin/bash
# PLR-COUNT pass-5 unit battery, chunked by directory; each chunk's vitest exit is PIPESTATUS[0].
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-52/web/frontend
chunk() { echo "### $*"; npx vitest run "$@" 2>&1 | grep -E 'Test Files|Tests  |FAIL|No test files'; echo "EXIT[$1]=${PIPESTATUS[0]}"; }
chunk src/games/shared
chunk src/games/sudoku src/games/futoshiki src/games/thermo src/games/killer src/games/kenken
chunk src/games/cards.test.ts src/games/posters.test.ts
chunk src/pencil
chunk src/composables
chunk --exclude 'src/**'
echo "### DONE"
