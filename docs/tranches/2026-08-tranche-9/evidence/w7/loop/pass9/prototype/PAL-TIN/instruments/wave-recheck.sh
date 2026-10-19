#!/bin/bash
# PAL-TIN pass 9 · the gate rows on the WAVE union + homes v2 + the delta, re-read on the FINAL gate/spec bytes. No rm, no set -e.
S=$SCRATCH; F=$S/wavetree/web/frontend; O=$S/logs/wave2; mkdir -p $O
cd $F || exit 9
echo "start $(date +%T) load $(uptime | sed 's/.*averages*: //') · gate $(git hash-object scripts/check-peer-tin.mjs | cut -c1-8) spec $(git hash-object e2e/peer-tin.spec.ts | cut -c1-8)" > $O/HEAD.txt
row() { local n=$1; shift; local t0=$(date +%s); "$@" > $O/$n.txt 2>&1; echo $? > $O/$n.exit; echo "$n exit $(cat $O/$n.exit) · $(( $(date +%s) - t0 )) s · load $(uptime | sed 's/.*averages*: //')" >> $O/HEAD.txt; }
row gate node scripts/check-peer-tin.mjs
row self-test node scripts/check-peer-tin.mjs --self-test
row gate-dist node scripts/check-peer-tin.mjs --dist $S/dist-wave
row self-test-dist node scripts/check-peer-tin.mjs --self-test --dist $S/dist-wave
row typecheck-e2e npx vue-tsc --noEmit -p tsconfig.e2e.json
row unit-staging npx vitest run --config $S/cfg/vitest.wave.mts src/games/shared/useStagingBridge.test.ts
echo "end $(date +%T)" >> $O/HEAD.txt; echo done > $O/DONE
