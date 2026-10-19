#!/bin/bash
# r5light.sh <label> <cmd...>: one light (non-browser) gate from web/frontend, guarded --light, exit bare to logs/r5/<label>.exit
S=$LANE
FE=${FE:-$TREE/web/frontend}
L=$S/logs/r5; lab=$1; shift
echo "open $(date +%T) $(sysctl -n vm.loadavg) dir=$FE" > $L/$lab.load
cd $FE || exit 9
$GUARDED --light --timeout 30 -- "$@" > $L/$lab.log 2>&1
echo "exit=$?" > $L/$lab.exit
echo "close $(date +%T) $(sysctl -n vm.loadavg)" >> $L/$lab.load
