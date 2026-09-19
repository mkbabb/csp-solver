#!/bin/zsh
# C07b — interleaved base/cured reading set on the banked A2 instrument `boot-freight.mjs`
# (copied verbatim into ../instrument/; only --port differs between arms).
#   usage: interleave.sh <tag> <basePort> <curedPort> <engine> <cpu> <net> <cache> <vp> <n>
# Writes ../raw/<tag>.jsonl with a `arm` field on every window, b,c,b,c,… so host drift cancels.
set -u
HERE=${0:a:h}
OUT=$HERE/../raw/$1.jsonl
BASE=$2; CURED=$3; ENGINE=$4; CPU=$5; NET=$6; CACHE=$7; VP=$8; N=$9
: > $OUT
echo "LOADAVG-OPEN $(sysctl -n vm.loadavg)" >> $OUT
for i in $(seq 1 $N); do
  for arm in b c; do
    if [[ $arm == b ]]; then PORT=$BASE; else PORT=$CURED; fi
    LINE=$(node $HERE/boot-freight.mjs --port $PORT --engine $ENGINE --cpu $CPU --net $NET \
      --cache $CACHE --vp $VP --windows 1 2>/dev/null | tail -1)
    if [[ -z $LINE ]]; then echo "{\"arm\":\"$arm\",\"rep\":$i,\"FAILED\":true}" >> $OUT
    else echo "{\"arm\":\"$arm\",\"rep\":$i,$(echo $LINE | cut -c2-)" >> $OUT; fi
  done
done
echo "LOADAVG-CLOSE $(sysctl -n vm.loadavg)" >> $OUT
echo "wrote $OUT"
