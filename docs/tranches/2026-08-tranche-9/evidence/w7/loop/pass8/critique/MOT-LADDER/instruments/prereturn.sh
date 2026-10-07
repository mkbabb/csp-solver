#!/bin/bash
# critic pre-return battery, bare, per arm. nothing written except logs.
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit-ladder8
for arm in snap:dist-btree ctl:CTLDIST; do
LAB=${arm%%:*}; D=${arm##*:}; [ $D = CTLDIST ] && D=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-control/web/frontend/dist || D=$S/$D
FE=$S/$LAB/web/frontend; OUT=$S/prereturn-$LAB.tsv; : > $OUT; cd $FE
run() { local name=$1; shift; "$@" > $S/pr-$LAB-$name.log 2>&1; printf "%s\t%s\n" "$name" $? >> $OUT; }
run lint-lanes npm run --silent lint:lanes
run lint-theme-tokens npm run --silent lint:theme-tokens
run lint-sleep npm run --silent lint:sleep
run lint-bands npm run --silent lint:bands
run lint-verbs npm run --silent lint:verbs
run lint-motion npm run --silent lint:motion
run lint-copy npm run --silent lint:copy
run test-e2e-projects npm run --silent test:e2e:projects
run check-pw-projects node scripts/check-pw-projects.mjs
run propblock-src-dist node $S/check-property-block.mjs --fe $FE --dist $D
run npm-lint npm run --silent lint
run eslint npx eslint . --max-warnings 0
run knip npm run --silent lint:knip
echo DONE >> $OUT
done
