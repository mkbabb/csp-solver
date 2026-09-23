#!/bin/sh
# vue-tsc + the unit battery in two chunks (src/games, the rest) + the font-coverage gate, on the final source.
F=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_3b66f064-970-17/web/frontend
O=$F/.intake/out
cd "$F" || exit 1
./node_modules/.bin/vue-tsc -b > $O/vue-tsc.log 2>&1; echo "vue-tsc $?"
./node_modules/.bin/vitest run src/games > $O/unit-games.log 2>&1; echo "unit-games $?"
grep -E "Test Files|Tests " $O/unit-games.log
./node_modules/.bin/vitest run --exclude "src/games/**" > $O/unit-rest.log 2>&1; echo "unit-rest $?"
grep -E "Test Files|Tests " $O/unit-rest.log
node scripts/check-font-coverage.mjs > $O/font-coverage.log 2>&1; echo "font-coverage $?"
echo DONE
