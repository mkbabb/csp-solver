#!/bin/bash
# LEDGER's four arms, one BUILT dist each, from LEDGER's pass-5 bank on a scratch archive of 74a2b5d9 (never LEDGER's tree).
SP=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad; LF=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/erase6-ledger/web/frontend; F=$LF/src/games/shared/GameBoard.vue
cd $LF; SHA=$(shasum $F | cut -d' ' -f1); cp $F $SP/erase6-ledger-gb.vue
for arm in hold age step tint; do
  sed -i '' "s/^const LEDGER_FULFILLED = \"[a-z]*\" as/const LEDGER_FULFILLED = \"$arm\" as/" $F
  grep -q "const LEDGER_FULFILLED = \"$arm\" as" $F || { echo "FLIP FAILED $arm"; break; }
  npx vite build --config $SP/erase6-cfg/vite.ledger.mts --outDir $SP/erase6-ledger-dist-$arm --emptyOutDir > $SP/erase6-logs/build-ledger-$arm.log 2>&1
  echo "ARM=$arm build exit=$? identity=$(ls $SP/erase6-ledger-dist-$arm/assets | grep -E '^index-.*\.js$')"
done
cp $SP/erase6-ledger-gb.vue $F; [ "$(shasum $F | cut -d' ' -f1)" = "$SHA" ] && echo "RESTORED" || echo "RESTORE MISMATCH"
