#!/bin/zsh
# G-TOGGLE lane: vue-tsc + the unit battery, chunked
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_b6676cd9-8c6-14/web/frontend
L=../../.gt
date +%T
npx vue-tsc -b > $L/vuetsc.log 2>&1; echo "vue-tsc exit $?"; node scripts/check-copy-register.mjs > $L/copy.log 2>&1; echo "copy-register exit $?"; node scripts/check-motion-contract.mjs > $L/motion.log 2>&1; echo "lint:motion exit $?"; npx prettier --check --config .prettierrc.json src/ > $L/prettier.log 2>&1; echo "prettier exit $?"; npx eslint src/pencil src/composables > $L/eslint.log 2>&1; echo "eslint exit $?"
date +%T
npx vitest run src/pencil src/composables > $L/unit-pencil.log 2>&1; echo "unit pencil+composables exit $?"
date +%T
npx vitest run src/games > $L/unit-games.log 2>&1; echo "unit games exit $?"
date +%T
npx vitest run src/lib src/probe src/assets > $L/unit-rest.log 2>&1; echo "unit rest exit $?"
date +%T
