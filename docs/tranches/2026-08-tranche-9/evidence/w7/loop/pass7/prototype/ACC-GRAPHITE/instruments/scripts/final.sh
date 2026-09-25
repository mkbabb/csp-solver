#!/bin/bash
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/accg7
F=$S/snap2/web/frontend; OUT=$S/logs/final.tsv; : > $OUT
$S/battery.sh tree2 $F
( cd $F && npx vue-tsc -b --force > $S/logs/final-vuetsc.log 2>&1 ); echo -e "vue-tsc\t$?" >> $OUT
i=0
for chunk in "src/composables src/games/cards.test.ts src/games/posters.test.ts src/games/futoshiki src/games/kenken src/games/killer src/games/sudoku src/games/thermo" "src/games/shared" "src/pencil"; do
  i=$((i+1)); ( cd $F && npx vitest run $chunk > $S/logs/final-vitest-$i.log 2>&1 ); rc=$?
  echo -e "vitest-$i\t$rc\t$(grep -E 'Test Files|Tests  ' $S/logs/final-vitest-$i.log | tr -s ' ' | tr '\n' ' ')" >> $OUT
done
( cd $F && node /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass6/instruments/check-property-block.mjs --fe $F --dist $S/dist-b3 > $S/logs/final-propblock-served.log 2>&1 ); echo -e "property-block-served\t$?" >> $OUT
echo ALLDONE >> $OUT
