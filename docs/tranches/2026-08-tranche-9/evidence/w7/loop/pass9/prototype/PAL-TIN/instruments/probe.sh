#!/bin/bash
# PAL-TIN pass 9 · HEAD-on-HEAD same-index (the critic's btape-geometry probe, lane copy) + π solo, both engines. No rm, no set -e.
S=$SCRATCH
cd $S/cfg || exit 9
run() { local tag=$1 arm=$2 port=$3 g=$4 eng=$5; local lg=$S/logs/probe-$tag-$eng.log
  echo "probe $(shasum $S/cspec/headreal.spec.ts | cut -c1-8) · $arm :$port $(curl -s http://127.0.0.1:$port/ | grep -o 'index-[A-Za-z0-9_-]*\.js') · load $(uptime | sed 's/.*averages*: //') · $(date +%T)" > $lg
  CRIT_ARM=$arm CTL_PORT=4239 PLAYWRIGHT_BASE_URL=http://127.0.0.1:$port TIN_TESTDIR=$S/cspec TIN_MATCH='headreal\.spec\.ts$' TIN_OUT=$S/pw-out/probe-$tag-$eng npx playwright test --config $S/cfg/pw.mts --project $eng -g "$g" >> $lg 2>&1
  echo "EXIT=$? · load after $(uptime | sed 's/.*averages*: //') · $(date +%T)" >> $lg; }
for eng in chromium webkit; do
  for r in 1 2; do run btg-control-r$r control 4239 btape-geometry $eng; run btg-tree-r$r tree 4245 btape-geometry $eng; done
  run pi solo 4245 "pi solo" $eng
done
echo done > $S/logs/probe.done
