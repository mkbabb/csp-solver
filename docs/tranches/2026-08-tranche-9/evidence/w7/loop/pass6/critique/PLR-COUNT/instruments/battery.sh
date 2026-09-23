#!/bin/bash
# PLR-COUNT pass-6 critic battery: each gate bare, tree then control.
T=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-52/web/frontend
C=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-control/web/frontend
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrcount6crit
for g in "npm run lint:sleep" "npm run lint:lanes" "npm run lint:theme-tokens" "npm run test:e2e:projects" "node scripts/check-pw-projects.mjs" "npm run lint:copy" "npm run lint"; do
  for side in tree control; do
    d=$T; [ $side = control ] && d=$C
    (cd $d && $g > $S/logs/bat-$side-$(echo $g | tr ' :/' '___').log 2>&1); rc=$?
    echo "$g | $side | $rc"
  done
done
(cd $T && npx eslint . > $S/logs/bat-tree-eslint.log 2>&1); echo "eslint . | tree | $?"
(cd $T && npx vue-tsc -p tsconfig.e2e.json --noEmit > $S/logs/bat-tree-tsce2e.log 2>&1); echo "typecheck e2e | tree | $?"
echo BATTERY-DONE
