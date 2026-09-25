#!/bin/bash
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad
bash $S/erase7s-build.sh $S/erase7s-plant/web/frontend $S/erase7s-dist-plant plant
F=$S/erase7-union/web/frontend; G=$F/src/games/shared/GameBoard.vue; SHA=$(shasum $G | cut -d' ' -f1); cp $G $S/erase7s-union-gb.vue
for arm in hold age step tint; do
  sed -i '' "s/^const LEDGER_FULFILLED = \"[a-z]*\" as/const LEDGER_FULFILLED = \"$arm\" as/" $G
  grep -q "^const LEDGER_FULFILLED = \"$arm\" as" $G || { echo "FLIP FAILED $arm"; break; }
  bash $S/erase7s-build.sh $F $S/erase7s-dist-union-$arm union-$arm
done
cp $S/erase7s-union-gb.vue $G; [ "$(shasum $G | cut -d' ' -f1)" = "$SHA" ] && echo "RESTORED $SHA" || echo "RESTORE MISMATCH"
bash $S/erase7s-build.sh $S/erase7-s10/web/frontend $S/erase7s-dist-s10 s10
echo ALLDONE
