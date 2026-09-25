#!/bin/bash
# PLR-COUNT pass 7: the unit battery, chunked by directory, on the scratch ARCHIVE of the tree (byte-identical, cmp-checked).
cd /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrcount7-arch/web/frontend
for d in src/composables src/games/futoshiki src/games/kenken src/games/killer src/games/sudoku src/games/thermo src/games/shared "src/games/cards.test.ts src/games/posters.test.ts" src/pencil; do
  n=$(echo $d | tr '/ ' '__'); npx vitest run $d > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrcount7-rig/logs/vt-$n.log 2>&1; ec=$?
  echo "$d exit $ec :: $(grep -E 'Test Files|Tests ' /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrcount7-rig/logs/vt-$n.log | tr -s ' ' | tr '\n' ' ')"
done
echo VT-DONE
