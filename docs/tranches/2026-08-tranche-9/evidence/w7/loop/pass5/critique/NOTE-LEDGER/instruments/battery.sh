#!/bin/bash
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-46/web/frontend
cd $W
npx vue-tsc --noEmit -p tsconfig.json > /dev/null 2>&1; echo "vue-tsc exit=$?"
npx eslint . > /dev/null 2>&1; echo "eslint . exit=$?"
npm run -s lint > /dev/null 2>&1; echo "prettier --check (lint) exit=$?"
for s in lint:lanes lint:sleep test:e2e:projects lint:knip lint:boundary lint:live-regions lint:copy lint:theme-tokens; do npm run -s $s > /dev/null 2>&1; echo "$s exit=$?"; done
node scripts/check-pw-projects.mjs > /dev/null 2>&1; echo "check-pw-projects exit=$?"
echo BATTERY-DONE
