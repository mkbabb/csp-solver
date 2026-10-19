#!/bin/bash
# build.sh <plant> ... : copy bank -> p-<plant>, plant, vite build into dist-<plant>; exits in logs/builds.exits
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/crit-MOT-VERB
for p in "$@"; do
  d=$S/p-$p; [ -e $d ] && mv $d $S/trash/p-$p.$(date +%s); cp -R $S/bank $d; (cd $d && git init -q .)
  FE=$d/web/frontend
  python3 $S/bin/plant.py $FE $p >> $S/logs/builds.exits 2>&1
  printf "import base from './vite.config.ts'\nexport default { ...base, cacheDir: '%s' }\n" "$S/vcache-$p" > $FE/.vite-critv9.config.mts
  [ -e $S/dist-$p ] && mv $S/dist-$p $S/trash/dist-$p.$(date +%s)
  echo "$p start $(date +%T) load $(uptime | sed 's/.*averages: //')" >> $S/logs/builds.exits
  (cd $FE && npx vite build --config .vite-critv9.config.mts --outDir $S/dist-$p --emptyOutDir > $S/logs/build-$p.log 2>&1; echo "$p build $? $(date +%T)" >> $S/logs/builds.exits)
done
echo ALLDONE >> $S/logs/builds.exits
