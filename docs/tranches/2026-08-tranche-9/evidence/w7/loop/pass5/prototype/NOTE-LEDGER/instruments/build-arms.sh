#!/bin/bash
# NOTE-LEDGER pass 5 — one BUILT DIST per arm (the prod-vs-prod rig, LAWS P4), outDir outside the
# tree, private cacheDir; the token flipped per build and the file restored by sha1 at the end.
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-46/web/frontend
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/ledger
F=$W/src/games/shared/GameBoard.vue
cd $W
SHA=$(sha1sum $F | cut -d' ' -f1); cp $F $S/gb-settled.vue
for arm in ${ARMS:-hold age step tint}; do
  sed -i '' "s/^const LEDGER_FULFILLED = \"[a-z]*\" as/const LEDGER_FULFILLED = \"$arm\" as/" $F
  grep -q "const LEDGER_FULFILLED = \"$arm\" as" $F || { echo "FLIP FAILED $arm"; break; }
  npx vite build --config .ledger/vite.build.mts --outDir $S/dist-$arm --emptyOutDir > $S/build-$arm.log 2>&1
  echo "ARM=$arm build exit=$? identity=$(ls $S/dist-$arm/assets | grep -E '^index-.*\.js$')"
done
cp $S/gb-settled.vue $F
[ "$(sha1sum $F | cut -d' ' -f1)" = "$SHA" ] && echo "RESTORED sha1 $SHA" || echo "RESTORE MISMATCH"
echo BUILD-ARMS-DONE
