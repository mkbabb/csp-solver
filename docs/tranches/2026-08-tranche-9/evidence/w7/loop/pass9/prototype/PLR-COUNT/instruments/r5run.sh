#!/bin/bash
# r5run.sh <label> <spec> <grep|-> <chromium|webkit> [ENV=V ...]: ONE playwright project on the lane tree, in its own
# guarded call (webkit: --exclusive webkit), --workers=1. Servers ensured first. Opens only at a 1-min load <= 120
# (a wait is logged with both reads). Exit written bare by this script to logs/r5/<label>.<project>.exit.
S=$LANE
FE=$TREE/web/frontend
L=$S/logs/r5; mkdir -p $L
lab=$1; spec=$2; grep=$3; proj=$4; shift 4
K=$L/$lab.$proj
$S/bin/r5srv.sh ensure > $K.srv 2>&1
while [ "$(sysctl -n vm.loadavg | awk '{print int($2)}')" -gt 120 ]; do echo "$(date +%T) waits $(sysctl -n vm.loadavg)" >> $K.load; sleep 60; done
echo "open $(date +%T) $(sysctl -n vm.loadavg) $(cat $K.srv)" >> $K.load
EX=""; [ "$proj" = "webkit" ] && EX="--exclusive webkit"
G=""; [ "$grep" != "-" ] && G="-g"
cd $FE || exit 9
if [ -n "$G" ]; then
  env PLRC_WORKERS=1 PLRC_PWOUT=$S/pw-out/$lab.$proj G14_CONTROL=http://127.0.0.1:4260 "$@" $GUARDED --timeout 90 $EX -- npx playwright test -c $S/rig/pw.config.ts $spec --project $proj --workers=1 -g "$grep" > $K.log 2>&1
else
  env PLRC_WORKERS=1 PLRC_PWOUT=$S/pw-out/$lab.$proj G14_CONTROL=http://127.0.0.1:4260 "$@" $GUARDED --timeout 90 $EX -- npx playwright test -c $S/rig/pw.config.ts $spec --project $proj --workers=1 > $K.log 2>&1
fi
echo "exit=$?" > $K.exit
echo "close $(date +%T) $(sysctl -n vm.loadavg)" >> $K.load
