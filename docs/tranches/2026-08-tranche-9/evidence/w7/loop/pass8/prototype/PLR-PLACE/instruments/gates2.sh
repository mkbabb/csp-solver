#!/bin/bash
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/place8
L=$S/logs/gates; OUT=$S/readings/gates2.txt; F=$S/gate/web/frontend
g() { local name=$1; shift; ( cd $F && "$@" ) > $L/gate2.$name.log 2>&1; echo "gate|$name|exit=$?" >> $OUT; }
echo "== gate2 $(date +%T) load $(uptime | sed 's/.*averages: //') PlayerMark $(shasum $F/src/pencil/chrome/PlayerMark/PlayerMark.vue | cut -c1-12)" >> $OUT
g lint npm run lint
g eslint npx eslint . --max-warnings 0
g knip npm run lint:knip
g vue-tsc-b npx vue-tsc -b
g typecheck_e2e npm run typecheck:e2e
g lint_copy npm run lint:copy
for d in src/composables/ src/games/futoshiki/ src/games/kenken/ src/games/killer/ src/games/shared/ src/games/sudoku/ src/games/thermo/ src/pencil/; do n=$(echo $d | tr '/' '_'); g vitest-$n npx vitest run $d; done
g vitest-src_games_root npx vitest run $(cd $F && ls src/games/*.test.ts | tr '\n' ' ')
g build npx vite build --config $S/cfg/vite.build.mts
echo "DONE $(date +%T)" >> $OUT
