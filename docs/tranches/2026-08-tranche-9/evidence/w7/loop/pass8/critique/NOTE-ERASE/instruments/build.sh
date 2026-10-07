#!/bin/bash
C=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit-erase8
for n in "$@"; do
  F=$C/$n/web/frontend
  printf "import base from './vite.config.ts'\nexport default { ...base, cacheDir: '%s/cache-%s' }\n" "$C" "$n" > $F/.critE8.mts
  T0=$(date +%s); L0=$(uptime | sed 's/.*averages: //')
  (cd $F && npx vite build --config .critE8.mts --outDir $C/dist-$n --emptyOutDir > $C/logs/build-$n.log 2>&1); EX=$?
  echo "BUILD $n exit=$EX secs=$(( $(date +%s)-T0 )) load0=$L0 load1=$(uptime | sed 's/.*averages: //') identity=$(ls $C/dist-$n/assets 2>/dev/null | grep -E '^index-.*\.(js|css)$' | tr '\n' ' ')"
done
echo BUILDS-DONE
