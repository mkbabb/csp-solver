#!/bin/bash
# plants.sh: four plant builds off the CURRENT tree, each an rsync copy OUTSIDE the tree with one asserted replacement.
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/verb8
T=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-59
R=$S/r2
one() { # name file old new
  local N=$1 F=$2; local P=$R/plant-$N
  mkdir -p $P/web
  rsync -a --exclude node_modules --exclude dist --exclude dist-throttle $T/web/frontend/ $P/web/frontend/
  [ -e $P/web/frontend/node_modules ] || ln -s $T/web/frontend/node_modules $P/web/frontend/node_modules
  [ -e $P/csp-solver ] || ln -s $T/csp-solver $P/csp-solver
  python3 $R/plant.py "$P/web/frontend/$F" "$3" "$4" || { echo "PLANT $N ANCHOR-FAIL"; return; }
  printf "import base from '%s/web/frontend/vite.config.ts'\nexport default { ...base, cacheDir: '%s/vcache-plant-%s' }\n" $P $R $N > $R/vite-plant-$N.mts
  (cd $P/web/frontend && npx vite build --config $R/vite-plant-$N.mts --outDir $R/dist-plant-$N --emptyOutDir > $R/logs/build-plant-$N.log 2>&1); echo "PLANT $N BUILD $? $(ls $R/dist-plant-$N/assets | grep -E '^index-.*js$')"
}
one bypass src/pencil/composables/bootHand.ts "  if (rulings === 0) return null;" "  if (rulings >= 0) return null;"
one hold0 src/pencil/grid/HandDrawnGrid/HandDrawnGrid.vue "  releaseRuling = beginRuling();
  prev?.();" "  releaseRuling = null;
  prev?.();"
one stacks0 src/pencil/grid/HandDrawnGrid/HandDrawnGrid.vue "  if (ready()) return Promise.resolve();" "  if (ready() || true) return Promise.resolve();"
one p7clock src/pencil/composables/bootHand.ts "    clock += Math.min(dt, pace(dt));" "    clock += Math.min(dt, MOTION.hand.stepMs);"
echo PLANTS-DONE
