#!/bin/bash
# usage: spec.sh TAG ENGINE DPR BASEURL GREP
S=<lane-scratch>
cd $S/tree/web/frontend
echo "start $(date +%T) $(sysctl -n vm.loadavg)" > $S/logs/$1.load
WALK_DPR=$3 WALK_OUT=$S/test-results/$1 PLAYWRIGHT_BASE_URL=$4 npx playwright test -c .pw-crit.mts --project $2 -g "$5" > $S/logs/$1.log 2>&1
echo "exit=$?" > $S/logs/$1.exit
echo "end $(date +%T) $(sysctl -n vm.loadavg)" >> $S/logs/$1.load
