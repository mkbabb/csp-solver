#!/bin/bash
# NOTE-LEDGER pass 5 — the whole unit estate, chunked by directory (STALL LAW), on the work tree.
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-46/web/frontend
L=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/ledger/unit
mkdir -p $L; cd $W
for d in src/games/shared src/games/sudoku src/games/futoshiki src/games/kenken src/games/killer src/games/thermo src/pencil src/composables "src/games/*.test.ts"; do
  n=$(echo "$d" | tr '/*.' '___')
  npx vitest run $d > $L/$n.log 2>&1; c=$?
  echo "$d exit=$c $(grep -E '^ +Test Files ' $L/$n.log | tr -s ' ') · $(grep -E '^ +Tests ' $L/$n.log | tr -s ' ')"
done
npx vitest run > $L/whole.log 2>&1; echo "WHOLE exit=$? $(grep -E '^ +Test Files ' $L/whole.log | tr -s ' ') · $(grep -E '^ +Tests ' $L/whole.log | tr -s ' ')"
echo UNIT-DONE
