#!/bin/zsh
# battery.sh <label> <frontend dir> — the pre-return battery (registry-v4 §2.11), each gate BARE.
LABEL=$1; FE=$2
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad
LOG=$S/logs/battery-$LABEL.log; : > $LOG
cd $FE
run() { echo "== $*" >> $LOG; "$@" >> $LOG 2>&1; echo "EXIT[$*] $?" >> $LOG; }
run npm run -s lint:lanes
run npm run -s lint:theme-tokens
run npm run -s lint:theme-selectors
run npm run -s lint:sleep
run npm run -s lint:copy
run npm run -s lint:motion
run npm run -s lint:ink
run npm run -s test:e2e:projects
run node scripts/check-pw-projects.mjs
run node scripts/check-copy-register.mjs
run npx eslint .
run npm run -s lint
run npx vue-tsc -b --noEmit
run npm run -s typecheck:e2e
echo BATTERY-DONE >> $LOG
