#!/bin/bash
SP=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad
T=$SP/nlcrit6-tree/web/frontend; F=$T/src/games/shared/GameBoard.vue
cd $T; cp $F $SP/nlcrit6-gb-orig.vue; SHA=$(shasum $F | cut -d' ' -f1)
for arm in hold tint; do
  sed -i '' "s/^const LEDGER_FULFILLED = \"[a-z]*\" as/const LEDGER_FULFILLED = \"$arm\" as/" $F
  grep -q "const LEDGER_FULFILLED = \"$arm\" as" $F || echo "FLIP FAILED $arm"
  npx vite build --config .nlcrit6/vite.build.mts --outDir $SP/nlcrit6-dist-$arm --emptyOutDir > $SP/nlcrit6-logs/build-$arm.log 2>&1
  echo "ARM=$arm exit=$? id=$(ls $SP/nlcrit6-dist-$arm/assets | grep -E '^index-.*\.js$')"
done
cp $SP/nlcrit6-gb-orig.vue $F
[ "$(shasum $F | cut -d' ' -f1)" = "$SHA" ] && echo RESTORED || echo MISMATCH
echo BUILD-DONE
