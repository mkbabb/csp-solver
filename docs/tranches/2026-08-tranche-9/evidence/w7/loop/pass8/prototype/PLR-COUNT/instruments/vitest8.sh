#!/bin/bash
cd "$1/web/frontend"
for d in src/composables src/games/shared src/games/sudoku src/games/futoshiki src/games/thermo src/games/killer src/games/kenken src/games/cards src/games/posters src/pencil; do

  :

  echo "## $d"; npx vitest run $d 2>&1 | grep -E "Test Files|Tests  |FAIL" ; echo "exit=${PIPESTATUS[0]}"
done
echo VITEST-DONE
