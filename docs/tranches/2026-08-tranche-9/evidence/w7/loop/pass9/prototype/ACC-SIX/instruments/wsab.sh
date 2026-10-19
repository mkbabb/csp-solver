#!/bin/bash
# wsab.sh <label> <frontend>: the wash clause-sabotage battery, bare exits from files. no rm, no set -e
S=<SCRATCH>
cd $2
for c in ${IDS:-none reach-none arms arm-pct arm-ctx arm-once}; do
  WASH_SABOTAGE=$c GIT_CEILING_DIRECTORIES=$S node scripts/check-theme-tokens.mjs --self-test > $S/logs/wsab-$1-$c.log 2>&1; echo $? > $S/logs/wsab-$1-$c.exit
  echo "WASH_SABOTAGE=$c $1 self-test exit $(cat $S/logs/wsab-$1-$c.exit) · plants FAILED: $(grep 'wash-reach plant' $S/logs/wsab-$1-$c.log | grep FAILED | sed 's/wash-reach plant · //;s/ (.*//;s/:.*//' | tr '\n' ';') · load $(uptime | sed 's/.*averages: //' | cut -d' ' -f1)"
done
GIT_CEILING_DIRECTORIES=$S node scripts/check-theme-tokens.mjs > $S/logs/ctt-$1.log 2>&1; echo $? > $S/logs/ctt-$1.exit
echo "bare $1 exit $(cat $S/logs/ctt-$1.exit) · $(grep 'the wash reach' $S/logs/ctt-$1.log)"
echo WSAB-DONE $1
