#!/bin/zsh
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-39/web/frontend
LOG=.crit-mrkabs/battery.log; : > $LOG
run() { echo "== $*" >> $LOG; "$@" >> $LOG 2>&1; echo "EXIT[$*] $?" >> $LOG; }
run node scripts/check-copy-register.mjs
run npm run -s lint:copy
run npm run -s lint:theme-tokens
run node .crit-mrkabs/verb-census.mjs
run npm run -s lint:theme-selectors
run npm run -s lint:ink
run npm run -s lint:motion
run npm run -s lint
run npx eslint src
run npx vue-tsc -b --noEmit
echo BATTERY-DONE >> $LOG
