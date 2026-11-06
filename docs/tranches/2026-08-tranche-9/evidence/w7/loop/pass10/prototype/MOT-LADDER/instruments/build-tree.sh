#!/bin/zsh
# usage: build-tree.sh <tree-sha> <dir> : archive + git init + vite build (private cacheDir) ; prints identity
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/MOT-LADDER
$S/snap.sh $1 $2 > $S/logs/$2.snap.log 2>&1
cd $S/$2/web/frontend
printf "import base from './vite.config.ts'\nexport default { ...base, cacheDir: '%s' }\n" "$S/vite-cache-$2" > .vite-ladder.config.ts
npx vite build --config .vite-ladder.config.ts --emptyOutDir > $S/logs/$2.build.log 2>&1; echo "build exit $?" >> $S/logs/$2.build.log
ls dist/assets | grep -E '^index-.*\.(js|css)$' >> $S/logs/$2.build.log
for f in dist/assets/index-*.css; do echo "css $f $(wc -c < $f)" >> $S/logs/$2.build.log; done
echo BUILD-DONE >> $S/logs/$2.build.log
