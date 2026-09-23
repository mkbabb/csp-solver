#!/bin/bash
# PLR-COUNT pass 6: the unit battery, chunked by directory (the stall law).
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-52/web/frontend
R=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrcount6-rig
for d in src/composables src/games/futoshiki src/games/kenken src/games/killer src/games/sudoku src/games/thermo src/games/shared "src/games/cards.test.ts src/games/posters.test.ts" src/pencil; do
  n=$(echo $d | tr '/ ' '__'); npx vitest run $d > $R/logs/vt-$n.log 2>&1; ec=$?
  echo "$d exit $ec :: $(grep -E 'Test Files|Tests ' $R/logs/vt-$n.log | tr -s ' ' | tr '\n' ' ')"
done
echo VT-DONE
