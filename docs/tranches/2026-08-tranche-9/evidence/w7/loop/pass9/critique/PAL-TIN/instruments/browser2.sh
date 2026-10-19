#!/bin/bash
S=$SCRATCH
W=$WORKTREES/wf_308fa864-c94-2/web/frontend
cd $W || exit 9
run() { local tag=$1 eng=$2 port=$3 g=$4; shift 4; local lg=$S/logs/br-$tag-$eng.log
  echo "$tag $eng :$port $(curl -s http://127.0.0.1:$port/ | grep -o 'index-[A-Za-z0-9_-]*\.js') · load $(uptime|sed 's/.*averages*: //') · $(date +%T)" > $lg
  env "$@" PLAYWRIGHT_BASE_URL=http://127.0.0.1:$port TIN_OUT=$S/pw-out/$tag-$eng npx playwright test --config $S/cfg/pw.mts --project $eng -g "$g" >> $lg 2>&1
  echo "EXIT=$? · load after $(uptime|sed 's/.*averages*: //') · $(date +%T)" >> $lg; }
for eng in chromium webkit; do
  run pi $eng 4245 'pi solo' TIN_DPR=1 CTL_PORT=4239 TIN_TESTDIR=$S/cspec TIN_MATCH='headreal\.spec\.ts$'
  run s2aa $eng 4245 '§2 every stick' TIN_DPR=1
done
echo done > $S/logs/browser2.done
