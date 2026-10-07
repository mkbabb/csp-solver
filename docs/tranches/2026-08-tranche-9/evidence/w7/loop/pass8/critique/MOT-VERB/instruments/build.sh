#!/bin/bash
# build.sh <name> <srcroot>: vite build of <srcroot>/web/frontend with a private cacheDir into $S/dist-<name>
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/verbcrit8
N=$1; X=$2
printf "import base from '%s/web/frontend/vite.config.ts'\nexport default { ...base, cacheDir: '%s/vcache-verbcrit8-%s' }\n" $X $S $N > $S/vite-$N.mts
cd $X/web/frontend && npx vite build --config $S/vite-$N.mts --outDir $S/dist-$N --emptyOutDir > $S/logs/build-$N.log 2>&1
echo "BUILD $N EXIT $? $(ls $S/dist-$N/assets | grep -E '^index-.*\.(js|css)$' | tr '\n' ' ')"
for f in $S/dist-$N/assets/index-*.css; do echo "$(basename $f) @property $(grep -o '@property' $f | wc -l)"; done
