#!/bin/zsh
# usage: prereturn.sh <web/frontend dir> <label>
D=$1; L=$2; S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad
LOG=$S/prereturn-$L.log; : > $LOG
cd $D
run() { n=$1; shift; "$@" > $S/pr-$L-$n.log 2>&1; echo "EXIT[$n] $?" >> $LOG; tail -2 $S/pr-$L-$n.log | sed 's/^/    /' >> $LOG; }
run lint-lanes npm run -s lint:lanes
run lint-theme-tokens npm run -s lint:theme-tokens
run lint-sleep npm run -s lint:sleep
run test-e2e-projects npm run -s test:e2e:projects
run check-pw-projects node scripts/check-pw-projects.mjs
run lint-copy npm run -s lint:copy
run lint-motion npm run -s lint:motion
run lint-knip npm run -s lint:knip
run prettier-lint npm run -s lint
run eslint npx eslint .
run vue-tsc npx vue-tsc --noEmit
echo PRERETURN-DONE >> $LOG
