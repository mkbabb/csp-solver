#!/bin/bash
# build-dir.sh <label> <frontend dir> — vite build through a scratch .mts (private cacheDir) into $S/dist-<label>; exit to logs/build-<label>.exit
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/NOTE-ERASE
n=$1 F=$2
[ -e $F/node_modules ] || ln -s /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules $F/node_modules
printf "import base from './vite.config.ts'\nexport default { ...base, cacheDir: '%s/cache-%s' }\n" "$S" "$n" > $F/.erase9-build.mts
[ -e $S/dist-$n ] && mv $S/dist-$n $S/trash/dist-$n-$(date +%s)
L0=$(uptime | sed 's/.*averages: //')
(cd $F && npx vite build --config .erase9-build.mts --outDir $S/dist-$n --emptyOutDir > $S/logs/build-$n.log 2>&1); x=$?
echo "BUILD $n exit=$x load0=$L0 load1=$(uptime | sed 's/.*averages: //') identity=$(ls $S/dist-$n/assets 2>/dev/null | grep -E '^index-.*\.(js|css)$' | tr '\n' ' ')" > $S/logs/build-$n.exit
