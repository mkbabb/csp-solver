#!/bin/zsh
# MRK-ABS pass-4 battery: vue-tsc, chunked vitest, lints — each BARE, exit codes recorded.
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-39/web/frontend
LOG=.p4-mrkabs/battery.log; : > $LOG
run() { echo "== $*" >> $LOG; "$@" >> $LOG 2>&1; echo "EXIT[$*] $?" >> $LOG; }
run npx vue-tsc -b --noEmit
for d in src/composables src/games/cards.test.ts src/games/posters.test.ts src/games/futoshiki src/games/kenken src/games/killer src/games/sudoku src/games/thermo src/games/shared src/pencil; do run npx vitest run $d; done
for s in lint:theme-tokens lint:theme-selectors lint:ink lint:motion lint:copy lint:knip lint:eslint lint; do run npm run -s $s; done
echo BATTERY-DONE >> $LOG
