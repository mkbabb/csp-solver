#!/bin/bash
# build the tree + plant dists out of tree, one at a time; no rm
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/six8
cd $S/bt/web/frontend
for P in ${PLANTS:-none overyield late150 yieldoff}; do
  t0=$(date +%s)
  PLANT=$P npx vite build --config $S/cfg/build.mts --outDir $S/dist-$P --emptyOutDir > $S/logs/build-$P.log 2>&1
  echo "BUILD $P exit $? $(( $(date +%s) - t0 ))s $(ls $S/dist-$P/assets 2>/dev/null | grep -E '^index-.*\.js$')"
done
