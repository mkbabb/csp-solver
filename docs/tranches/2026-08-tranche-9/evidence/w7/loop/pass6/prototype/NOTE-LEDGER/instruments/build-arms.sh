#!/bin/bash
# NOTE-LEDGER pass 6 — one BUILT DIST per arm (prod-vs-prod, LAWS P4), outDir in the lane scratch,
# private cacheDir; the token flipped per build. Then ONE instrumented HOLD build for row 10 (the
# strike watch's per-write cost at 16×16): `performance.now()` around the watch body, and the join
# timed as the mean of 1000 repetitions (a single join is under the clock's 100 µs grain). The
# product file is restored by sha1 at the end (cp, never rm).
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-46/web/frontend
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/ledger6
F=$W/src/games/shared/GameBoard.vue
cd $W
SHA=$(shasum $F | cut -d' ' -f1); cp $F $S/gb-settled.vue
for arm in ${ARMS:-hold age step tint}; do
  sed -i '' "s/^const LEDGER_FULFILLED = \"[a-z]*\" as/const LEDGER_FULFILLED = \"$arm\" as/" $F
  grep -q "const LEDGER_FULFILLED = \"$arm\" as" $F || { echo "FLIP FAILED $arm"; break; }
  npx vite build --config .note-ledger/vite.build.mts --outDir $S/dist-$arm --emptyOutDir > $S/build-$arm.log 2>&1
  echo "ARM=$arm build exit=$? identity=$(ls $S/dist-$arm/assets | grep -E '^index-.*\.js$')"
done
cp $S/gb-settled.vue $F
if [ -z "$NOTIMED" ]; then
  perl -0pi -e 's/const boardInk = computed\(\(\) => Object\.values\(props\.values\)\.join\(\)\);/const boardInk = computed(() => { const t = performance.now(); for (let i = 0; i < 999; i++) Object.values(props.values).join(); const s = Object.values(props.values).join(); ((window as unknown as { __joinMs?: number[] }).__joinMs ??= []).push((performance.now() - t) \/ 1000); return s; });/' $F
  perl -0pi -e 's/watch\(boardInk, \(ink\) => \{\n/watch(boardInk, (ink) => { const __t0 = performance.now(); try {\n/' $F
  perl -0pi -e 's/(  if \(verdict\(marginPrevious\.value\) === "falsified"\) marginPrevious\.value = null;\n)\}\);/$1} finally { ((window as unknown as { __watchMs?: number[] }).__watchMs ??= []).push(performance.now() - __t0); } });/' $F
  echo "timed plants: $(grep -c '__joinMs\|__watchMs' $F) (want 2)"
  npx vite build --config .note-ledger/vite.build.mts --outDir $S/dist-timed --emptyOutDir > $S/build-timed.log 2>&1
  echo "ARM=hold-timed build exit=$? identity=$(ls $S/dist-timed/assets | grep -E '^index-.*\.js$')"
  cp $S/gb-settled.vue $F
fi
[ "$(shasum $F | cut -d' ' -f1)" = "$SHA" ] && echo "RESTORED sha1 $SHA" || echo "RESTORE MISMATCH"
echo BUILD-ARMS-DONE
