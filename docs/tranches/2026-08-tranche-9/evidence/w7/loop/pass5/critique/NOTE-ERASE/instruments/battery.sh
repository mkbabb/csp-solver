#!/bin/zsh
# NOTE-ERASE pass-5 CRITIC: the §2.11 battery, each gate bare, tree vs a git-archive control of 74a2b5d9.
SP=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-47/web/frontend
CT=$SP/ctrl/web/frontend
for g in "npm run lint:lanes" "npm run lint:theme-tokens" "npm run lint:sleep" "npm run test:e2e:projects" "node scripts/check-pw-projects.mjs" "npx eslint ." "npm run lint" "npm run lint:copy" "node scripts/check-copy-register.mjs" "npm run lint:motion" "npm run lint:ink" "node scripts/check-ink-pressure.mjs" "npx vue-tsc --noEmit"; do
  (cd $W && eval $g > $SP/b.t 2>&1); t=$?
  (cd $CT && eval $g > $SP/b.c 2>&1); c=$?
  echo "$g | tree $t | control $c"
  [ $t -ne 0 ] && tail -4 $SP/b.t | sed 's/^/    T: /'
  [ $c -ne 0 ] && tail -4 $SP/b.c | sed 's/^/    C: /'
done
echo DONE
