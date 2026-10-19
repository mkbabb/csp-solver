#!/bin/bash
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/NOTE-LEDGER
LOG=$S/logs/union-src.txt; : > $LOG; cd $S/wL/web/frontend
echo "load $(uptime | sed 's/.*averages: //')" >> $LOG
npx vitest run src/games/shared/GameBoard.notes.test.ts > $S/logs/u-vt-notes.txt 2>&1; echo "union GameBoard.notes vitest exit $? · $(grep -E '^ +Tests ' $S/logs/u-vt-notes.txt | tr -s ' ')" >> $LOG
node scripts/check-ink-pressure.mjs > $S/logs/u-ink-bare.txt 2>&1; echo "union lint:ink bare exit $?" >> $LOG
node scripts/check-ink-pressure.mjs --self-test --plants --sabotage-battery > $S/logs/u-ink-st.txt 2>&1; echo "union lint:ink self-test+plants+sabotage exit $? · plants ok $(grep -c 'plant ok' $S/logs/u-ink-st.txt) · clauses RED $(grep -c 'sabotage .* → RED' $S/logs/u-ink-st.txt)" >> $LOG
npx vue-tsc --noEmit -p tsconfig.e2e.json > $S/logs/u-tsc-e2e.txt 2>&1; echo "union typecheck:e2e exit $?" >> $LOG
npx eslint --max-warnings 0 scripts/check-ink-pressure.mjs e2e/note-reserve.spec.ts src/games/shared/GameBoard.vue src/games/shared/GameBoard.notes.test.ts > $S/logs/u-eslint.txt 2>&1; echo "union eslint (4 files) exit $?" >> $LOG
echo DONE >> $LOG
