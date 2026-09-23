#!/bin/bash
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad
F=$S/motladder6crit-t6/web/frontend
cd $F
for s in lint:lanes lint:theme-tokens lint:sleep test:e2e:projects lint:motion lint:copy lint:verbs lint:bands lint; do npm run $s > $S/motladder6crit-bat-$s.log 2>&1; echo "$s $?"; done
node scripts/check-pw-projects.mjs > $S/motladder6crit-bat-pwproj.log 2>&1; echo "check-pw-projects $?"
npx eslint . > $S/motladder6crit-bat-eslint.log 2>&1; echo "eslint . $?"
npx vue-tsc -b > $S/motladder6crit-bat-vuetsc.log 2>&1; echo "vue-tsc -b $?"
echo BATTERY-DONE
