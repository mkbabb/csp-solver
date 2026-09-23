#!/bin/zsh
for T in /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-33/web/frontend /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-control/web/frontend; do
  cd $T
  for c in "npm run -s lint:lanes" "npm run -s lint:theme-tokens" "npm run -s lint:sleep" "npm run -s test:e2e:projects" "node scripts/check-pw-projects.mjs" "npm run -s lint:copy" "npm run -s lint:motion" "npx eslint ." "npx prettier --check ." "npm run -s lint:face-engine"; do
    eval "$c" > /dev/null 2>&1
    echo "$T | $c | $?"
  done
done
