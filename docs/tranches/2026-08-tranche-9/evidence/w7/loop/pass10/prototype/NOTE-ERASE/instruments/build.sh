#!/bin/bash
# build.sh <label> <frontend dir> - guarded vite build, private cacheDir, into $S/dist-<label>; exit to logs/build-<label>.exit
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/NOTE-ERASE
n=$1 F=$2
[ -e $F/node_modules ] || ln -s /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules $F/node_modules
printf "import base from './vite.config.ts'\nexport default { ...base, cacheDir: '%s/cache-%s' }\n" "$S" "$n" > $F/.erase10-build.mts
[ -e $S/dist-$n ] && mv $S/dist-$n $S/trash/dist-$n-$(date +%s)
L0=$(uptime | sed 's/.*averages: //')
(cd $F && ~/.claude/guard/guarded --timeout 20 -- npx vite build --config .erase10-build.mts --outDir $S/dist-$n --emptyOutDir > $S/logs/build-$n.log 2>&1); x=$?
css=$(ls $S/dist-$n/assets 2>/dev/null | grep -E '^index-.*\.css$' | head -1)
echo "BUILD $n fe=$F exit=$x load0=$L0 load1=$(uptime | sed 's/.*averages: //') identity=$(ls $S/dist-$n/assets 2>/dev/null | grep -E '^index-.*\.js$') css=$css $(wc -c < $S/dist-$n/assets/$css 2>/dev/null | tr -d ' ')B gitmarker=$(cd $F && git rev-parse --show-toplevel 2>&1)" > $S/logs/build-$n.exit
