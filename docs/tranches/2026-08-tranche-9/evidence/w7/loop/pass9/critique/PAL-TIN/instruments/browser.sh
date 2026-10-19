#!/bin/bash
# crit-PAL-TIN · browser re-derivations, each exit read from the log the run writes. No rm, no set -e.
S=$SCRATCH
W=$WORKTREES/wf_308fa864-c94-2/web/frontend
cd $W || exit 9
run() { local tag=$1 eng=$2 port=$3 g=$4; shift 4; local lg=$S/logs/br-$tag-$eng.log
  echo "$tag $eng :$port $(curl -s http://127.0.0.1:$port/ | grep -o 'index-[A-Za-z0-9_-]*\.js') · load $(uptime|sed 's/.*averages*: //') · $(date +%T)" > $lg
  env "$@" PLAYWRIGHT_BASE_URL=http://127.0.0.1:$port TIN_OUT=$S/pw-out/$tag-$eng npx playwright test --config $S/cfg/pw.mts --project $eng -g "$g" >> $lg 2>&1
  echo "EXIT=$? · load after $(uptime|sed 's/.*averages*: //') · $(date +%T)" >> $lg; }
for eng in ${ENGINES:-chromium webkit}; do
  run s2c $eng 4245 '§2c' TIN_DPR=1
  run btg-control $eng 4239 'btape-geometry' TIN_DPR=1 CRIT_ARM=control CTL_PORT=4239 TIN_TESTDIR=$S/cspec TIN_MATCH='headreal\.spec\.ts$'
  run btg-tree $eng 4245 'btape-geometry' TIN_DPR=1 CRIT_ARM=tree CTL_PORT=4239 TIN_TESTDIR=$S/cspec TIN_MATCH='headreal\.spec\.ts$'
done
echo done > $S/logs/browser.done
