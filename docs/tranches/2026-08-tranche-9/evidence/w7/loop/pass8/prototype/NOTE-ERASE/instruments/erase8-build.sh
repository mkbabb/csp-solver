#!/bin/bash
# usage: erase8-build.sh <name> [<name> …] — build each scratch copy <S>/<name>/web/frontend into <S>/dist-<name>
# through a two-line .mts config with a private cacheDir OUTSIDE any project root. Prints identity + load.
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/erase8
for n in "$@"; do
  F=$S/$n/web/frontend
  printf "import base from './vite.config.ts'\nexport default { ...base, cacheDir: '%s/cache-%s' }\n" "$S" "$n" > $F/.erase8-build.mts
  T0=$(date +%s); L0=$(uptime | sed 's/.*averages: //')
  (cd $F && npx vite build --config .erase8-build.mts --outDir $S/dist-$n --emptyOutDir > $S/logs/build-$n.log 2>&1); EX=$?
  echo "BUILD $n exit=$EX secs=$(( $(date +%s)-T0 )) load0=$L0 load1=$(uptime | sed 's/.*averages: //') identity=$(ls $S/dist-$n/assets 2>/dev/null | grep -E '^index-.*\.(js|css)$' | tr '\n' ' ')"
done
echo BUILDS-DONE
