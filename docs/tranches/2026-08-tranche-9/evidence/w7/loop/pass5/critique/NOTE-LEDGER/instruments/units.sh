#!/bin/bash
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/ledger-critic
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-46/web/frontend
F=$W/src/games/shared/GameBoard.vue
cd $W
SHA=$(shasum $F | cut -d' ' -f1); cp $F $S/gb-orig2.vue
for arm in hold age step tint; do
  sed -i '' "s/^const LEDGER_FULFILLED = \"[a-z]*\" as/const LEDGER_FULFILLED = \"$arm\" as/" $F
  npx vitest run src/games/shared/GameBoard.receipt.test.ts src/games/shared/GameBoard.notes.test.ts > $S/unit-$arm.log 2>&1
  echo "ARM=$arm exit=$?"; grep -E "Tests |Test Files" $S/unit-$arm.log; grep -E "^ +(×|✗|FAIL)| FAIL " $S/unit-$arm.log | head -8
done
cp $S/gb-orig2.vue $F
[ "$(shasum $F | cut -d' ' -f1)" = "$SHA" ] && echo "RESTORED $SHA" || echo "RESTORE MISMATCH"
echo UNITS-DONE
