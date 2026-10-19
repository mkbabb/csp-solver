#!/bin/bash
# PAL-TIN pass 9 · the delta on the WAVE union + homes v2 (scratch tree): gate, build, typecheck, units. No rm, no set -e.
S=$SCRATCH; F=$S/wavetree/web/frontend; O=$S/logs/wave; mkdir -p $O
cd $F || exit 9
printf 'import base from "%s/vite.config.ts";\nexport default { ...base, cacheDir: "%s/cache/wave-build" };\n' $F $S > $S/cfg/vite.wave.mts
printf 'import base from "%s/vitest.config.ts";\nexport default { ...base, cacheDir: "%s/cache/wave-vitest" };\n' $F $S > $S/cfg/vitest.wave.mts
echo "start $(date +%T) load $(uptime | sed 's/.*averages*: //')" > $O/HEAD.txt
row() { local n=$1; shift; local t0=$(date +%s); "$@" > $O/$n.txt 2>&1; echo $? > $O/$n.exit; echo "$n exit $(cat $O/$n.exit) · $(( $(date +%s) - t0 )) s · load $(uptime | sed 's/.*averages*: //')" >> $O/HEAD.txt; }
row gate node scripts/check-peer-tin.mjs
row build npx vite build --config $S/cfg/vite.wave.mts --outDir $S/dist-wave --emptyOutDir
row gate-dist node scripts/check-peer-tin.mjs --dist $S/dist-wave
row self-test-dist node scripts/check-peer-tin.mjs --self-test --dist $S/dist-wave
row vue-tsc-b npx vue-tsc -b
row typecheck-e2e npx vue-tsc --noEmit -p tsconfig.e2e.json
row pw-projects node scripts/check-pw-projects.mjs --self-test
for d in src/games/shared src/pencil src/games/sudoku src/games/futoshiki src/games/killer src/games/kenken src/games/thermo src/composables; do row "unit-$(echo $d | tr / _)" npx vitest run --config $S/cfg/vitest.wave.mts $d; done
row unit-games-root npx vitest run --config $S/cfg/vitest.wave.mts src/games/posters.test.ts src/games/cards.test.ts
echo "end $(date +%T)" >> $O/HEAD.txt; echo done > $O/DONE
