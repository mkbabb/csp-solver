#!/bin/bash
cd /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrplace7c-vt/web/frontend
O=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrplace7c-work/vitest.txt
echo "sha1 PlayerMark $(shasum src/pencil/chrome/PlayerMark/PlayerMark.vue | cut -c1-12) place-spec $(shasum e2e/player-place.spec.ts | cut -c1-12); load $(uptime | sed 's/.*averages: //')" >> $O
npx vue-tsc -b > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrplace7c-work/tsc-b.log 2>&1; echo "vue-tsc -b exit=$?" >> $O
npx vue-tsc -p tsconfig.e2e.json --noEmit > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrplace7c-work/tsc-e2e.log 2>&1; echo "vue-tsc -p tsconfig.e2e.json exit=$?" >> $O
for d in src/pencil/chrome src/pencil/celestial src/pencil/composables src/pencil/config src/pencil/glyph src/pencil/grid src/pencil/sheet src/pencil/dev src/games/shared src/games/sudoku src/games/futoshiki src/games/kenken src/games/killer src/games/thermo src/composables src/lib "src/games/cards.test.ts src/games/posters.test.ts" scripts; do
  npx vitest run $d > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrplace7c-work/vt.tmp 2>&1; ec=$?
  echo "$d exit=$ec :: $(grep -E 'Test Files|Tests ' /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrplace7c-work/vt.tmp | tr -s ' ' | tr '\n' ' ')" >> $O
done
echo DONE >> $O
