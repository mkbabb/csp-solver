#!/bin/bash
# builds.sh : clean tree build (bt) and the K7r plant build (bk7), private cacheDirs, out of tree. No rm.
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/MOT-LADDER



for d in bt bk7; do
  FE=$S/$d/web/frontend
  printf "import base from './vite.config.ts'\nexport default { ...base, cacheDir: '%s' }\n" "$S/vcache-$d" > $FE/.vite-ladder9.config.mts
  [ -e $S/dist-$d ] && mv $S/dist-$d $S/trash/dist-$d.$(date +%s)
  (cd $FE && npx vite build --config .vite-ladder9.config.mts --outDir $S/dist-$d --emptyOutDir > $S/build-$d.log 2>&1; echo "EXIT $?" >> $S/build-$d.log)
done
echo BUILDS-DONE > $S/builds.done
