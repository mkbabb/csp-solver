#!/bin/bash
TREE=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-40/web/frontend
CTRL=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-control/web/frontend
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/accgcrit5/battery
mkdir -p $S; : > $S/gates.tsv
run() { name="$1"; shift; for arm in tree ctrl; do d=$TREE; [ $arm = ctrl ] && d=$CTRL; ( cd $d && "$@" > $S/$name-$arm.log 2>&1 ); echo -e "$name\t$arm\t$?" >> $S/gates.tsv; done; }
run copy-register node scripts/check-copy-register.mjs
run copy-register-selftest node scripts/check-copy-register.mjs --self-test
run ink-pressure-selftest node scripts/check-ink-pressure.mjs --self-test
run lint-theme-tokens npm run -s lint:theme-tokens
run lint-lanes npm run -s lint:lanes
run lint-sleep npm run -s lint:sleep
run lint-motion npm run -s lint:motion
run test-e2e-projects npm run -s test:e2e:projects
run check-pw-projects node scripts/check-pw-projects.mjs
run eslint npx eslint .
run prettier npm run -s lint
echo ALLDONE >> $S/gates.tsv
