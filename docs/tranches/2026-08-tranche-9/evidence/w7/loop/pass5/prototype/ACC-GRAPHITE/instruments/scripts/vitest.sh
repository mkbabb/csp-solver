#!/bin/bash
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-40/web/frontend
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/accg5
: > $S/vitest.done
i=0
for chunk in "src/composables src/games/cards.test.ts src/games/posters.test.ts src/games/futoshiki src/games/kenken src/games/killer src/games/sudoku src/games/thermo" "src/games/shared" "src/pencil"; do
  i=$((i+1)); npx vitest run $chunk > $S/vitest-$i.log 2>&1; rc=$?
  echo "chunk $i exit $rc :: $(grep -E 'Test Files|Tests  ' $S/vitest-$i.log | tr -s ' ' | tr '\n' ' ')" >> $S/vitest.done
done
echo ALLDONE >> $S/vitest.done
