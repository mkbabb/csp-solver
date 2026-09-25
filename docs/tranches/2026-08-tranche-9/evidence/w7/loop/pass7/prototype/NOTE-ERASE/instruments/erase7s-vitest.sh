#!/bin/bash
# usage: erase7s-vitest.sh <fe> <label>  — the unit estate chunked by directory, each chunk's exit bare
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad
cd $1; echo "sha1 MarginNote=$(shasum src/pencil/chrome/MarginNote.vue | cut -c1-12) load=$(uptime | sed 's/.*averages: //')"
for d in src/games/cards.test.ts src/games/posters.test.ts src/pencil src/composables src/games/shared src/games/sudoku src/games/futoshiki src/games/thermo src/games/killer src/games/kenken; do
  [ -e $d ] || continue; n=$(echo $d | tr / -)
  npx vitest run $d > $S/erase7s-logs/vitest-$2-$n.log 2>&1; EX=$?
  echo "$d exit=$EX :: $(grep -E '^\s+(Test Files|Tests) ' $S/erase7s-logs/vitest-$2-$n.log | tr -s ' ' | tr '\n' ' ')"
done
echo "VITESTDONE $2 load=$(uptime | sed 's/.*averages: //')"
