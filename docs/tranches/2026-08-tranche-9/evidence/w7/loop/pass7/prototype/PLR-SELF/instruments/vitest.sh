#!/bin/bash
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-p4-PLR-SELF/web/frontend
for d in src/composables src/games/futoshiki src/games/kenken src/games/killer src/games/sudoku src/games/thermo src/games/shared src/pencil scripts; do
  npx vitest run $d > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrself7b/logs/vt-$(echo $d | tr / _).log 2>&1; ec=$?
  echo "$d exit $ec :: $(grep -E 'Test Files|Tests ' /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrself7b/logs/vt-$(echo $d | tr / _).log | tr -s ' ' | tr '\n' ' ')"
done
echo VT-DONE
