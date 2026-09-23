#!/bin/bash
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/ledger-critic
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-46/web/frontend
F=$W/src/games/shared/GameBoard.vue; M=$W/src/pencil/chrome/MarginNote.vue
cd $W; SF=$(shasum $F | cut -d' ' -f1); SM=$(shasum $M | cut -d' ' -f1); cp $F $S/b-gb.vue; cp $M $S/b-mn.vue
T="src/games/shared/GameBoard.receipt.test.ts src/games/shared/GameBoard.notes.test.ts"
# B1: TINT arm, un-spend clause deleted
sed -i '' 's/^const LEDGER_FULFILLED = "[a-z]*" as/const LEDGER_FULFILLED = "tint" as/' $F
sed -i '' 's/^  else if (live.spent) live.spent = undefined;$/  \/\/ BROKEN/' $F; grep -c "// BROKEN" $F
npx vitest run $T > $S/b1.log 2>&1; echo "B1 tint+no-unspend exit=$?"; grep -E "Tests |×" $S/b1.log
# B1c: control for B1: TINT arm intact
cp $S/b-gb.vue $F; sed -i '' 's/^const LEDGER_FULFILLED = "[a-z]*" as/const LEDGER_FULFILLED = "tint" as/' $F
npx vitest run $T > $S/b1c.log 2>&1; echo "B1c tint intact exit=$?"; grep -E "Tests |×" $S/b1c.log
cp $S/b-gb.vue $F
# B2: HOLD, row 7's voice reserve deleted
perl -0pi -e 's/  \.margin-note \{\n    min-height: inherit;\n  \}\n/  \/* BROKEN *\/\n/' $M; grep -c "BROKEN" $M
npx vitest run $T > $S/b2.log 2>&1; echo "B2 no-voice-reserve unit exit=$?"; grep -E "Tests " $S/b2.log
npm run -s lint:ink > /dev/null 2>&1; echo "B2 lint:ink exit=$?"; npm run -s lint:motion > /dev/null 2>&1; echo "B2 lint:motion exit=$?"
cp $S/b-mn.vue $M
[ "$(shasum $F | cut -d' ' -f1)" = "$SF" ] && [ "$(shasum $M | cut -d' ' -f1)" = "$SM" ] && echo "RESTORED $SF $SM" || echo "RESTORE MISMATCH"
echo BREAKS-DONE
