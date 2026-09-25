#!/bin/bash
# build the four T9-B-LEDGER arms (+ the swap-fence HOLD) of union+ERASE7+LEDGER7, one token flipped per arm, restored by sha1
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad
T=$S/ledger7-unionEL/web/frontend; GB=$T/src/games/shared/GameBoard.vue; MN=$T/src/pencil/chrome/MarginNote.vue
cp $GB $S/ledger7-work/unionEL.GameBoard.orig; cp $MN $S/ledger7-work/unionEL.MarginNote.orig
cd $T
for arm in ${ARMS:-hold age step tint}; do
  sed -i '' "s/^const LEDGER_FULFILLED = \"hold\" as/const LEDGER_FULFILLED = \"$arm\" as/" $GB
  grep -c "const LEDGER_FULFILLED = \"$arm\" as" $GB
  npx vite build --config .ledger7/build.mts --outDir $S/ledger7-dists/$arm --emptyOutDir > $S/ledger7-logs/build-$arm.log 2>&1
  echo "$arm build exit=$? $(ls $S/ledger7-dists/$arm/assets | grep -E '^index-.*\.js$')"
  cp $S/ledger7-work/unionEL.GameBoard.orig $GB
done
if [ -n "$FENCE" ]; then
  cd $T && git -C $S/ledger7-unionEL apply $FENCE && npx vite build --config .ledger7/build.mts --outDir $S/ledger7-dists/fence --emptyOutDir > $S/ledger7-logs/build-fence.log 2>&1; echo "fence build exit=$? $(ls $S/ledger7-dists/fence/assets | grep -E '^index-.*\.js$')"
  cp $S/ledger7-work/unionEL.MarginNote.orig $MN
fi
echo "restored GB $(shasum $GB|cut -c1-12)=$(shasum $S/ledger7-work/unionEL.GameBoard.orig|cut -c1-12) MN $(shasum $MN|cut -c1-12)=$(shasum $S/ledger7-work/unionEL.MarginNote.orig|cut -c1-12)"
echo BUILD-DONE
