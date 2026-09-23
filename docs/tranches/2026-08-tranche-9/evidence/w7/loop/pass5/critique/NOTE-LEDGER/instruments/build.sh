#!/bin/bash
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/ledger-critic
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-46/web/frontend
F=$W/src/games/shared/GameBoard.vue
cd $W
SHA=$(shasum $F | cut -d' ' -f1); cp $F $S/gb-orig.vue; echo "SHA0 $SHA"
grep -n '^const LEDGER_FULFILLED' $F
for arm in ${ARMS:-hold tint}; do
  sed -i '' "s/^const LEDGER_FULFILLED = \"[a-z]*\" as/const LEDGER_FULFILLED = \"$arm\" as/" $F
  grep -q "const LEDGER_FULFILLED = \"$arm\" as" $F || { echo "FLIP FAILED $arm"; break; }
  npx vite build --config $S/vite.build.mts --outDir $S/dist-$arm --emptyOutDir > $S/build-$arm.log 2>&1
  echo "ARM=$arm exit=$? id=$(ls $S/dist-$arm/assets | grep -E '^index-.*\.js$')"
done
cp $S/gb-orig.vue $F
[ "$(shasum $F | cut -d' ' -f1)" = "$SHA" ] && echo "RESTORED $SHA" || echo "RESTORE MISMATCH"
echo BUILD-DONE
