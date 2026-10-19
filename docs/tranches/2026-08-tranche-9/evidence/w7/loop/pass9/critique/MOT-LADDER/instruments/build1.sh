# usage: build1.sh <dir> <plant>
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/crit-MOT-LADDER
d=$1; X=$S/logs/builds.exits
[ -e $S/$d ] || cp -R $S/bank $S/$d
(cd $S/$d && git init -q . 2>/dev/null)
FE=$S/$d/web/frontend
python3 $S/inst/plantc.py $FE $2 >> $X
printf "import base from './vite.config.ts'\nexport default { ...base, cacheDir: '%s' }\n" "$S/vcache-$d" > $FE/.vite-critl9.config.mts
cd $FE && npx vite build --config .vite-critl9.config.mts --outDir $S/dist-$d --emptyOutDir > $S/logs/build-$d.log 2>&1; echo "$d build $? $(uptime | sed 's/.*averages: //')" >> $X
