#!/bin/bash
# PAL-TIN pass 9 · the G5 reading HEAD-on-HEAD (lane test "btape-g5"), both engines. No rm, no set -e.
S=$SCRATCH
cd $S/cfg || exit 9
run() { local tag=$1 arm=$2 port=$3 g=$4 eng=$5; local lg=$S/logs/probe-$tag-$eng.log
  echo "probe $(shasum $S/cspec/headreal.spec.ts | cut -c1-8) · $arm :$port $(curl -s http://127.0.0.1:$port/ | grep -o 'index-[A-Za-z0-9_-]*\.js') · load $(uptime | sed 's/.*averages*: //') · $(date +%T)" > $lg
  CRIT_ARM=$arm CTL_PORT=4239 PLAYWRIGHT_BASE_URL=http://127.0.0.1:$port TIN_TESTDIR=$S/cspec TIN_MATCH='headreal\.spec\.ts$' TIN_OUT=$S/pw-out/probe-$tag-$eng npx playwright test --config $S/cfg/pw.mts --project $eng -g "$g" >> $lg 2>&1
  echo "EXIT=$? · load after $(uptime | sed 's/.*averages*: //') · $(date +%T)" >> $lg; }
for eng in chromium webkit; do run g5-control control 4239 btape-g5 $eng; run g5-tree tree 4245 btape-g5 $eng; done
echo done > $S/logs/probe-g5.done
