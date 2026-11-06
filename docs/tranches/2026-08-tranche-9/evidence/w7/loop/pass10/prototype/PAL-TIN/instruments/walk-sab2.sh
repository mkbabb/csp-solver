#!/bin/bash
# PAL-TIN pass 10 · WALK battery re-run of the two COUNT rows with the sed bound to CHURN_COST's line only
# (the first cut's pattern also moved the re-cut's own COST_PIN literal on its line)
S=${SCRATCH:?set SCRATCH to the lane scratch dir}
G=$S/walktree/web/frontend/scripts/check-peer-arcs.mjs; W=$S/walk; out=$S/logs/walk-sab2.txt; : > $out
cd $S/walktree/web/frontend || exit 9
row() {
  sed -e "$3" $2 > $G
  echo "$1: lines changed $(diff $2 $G | grep -c '^>')" >> $out
  node scripts/check-peer-arcs.mjs --self-test > $S/logs/walksab/$1.v2.log 2>&1; e=$?
  echo "$1 on $(basename $2): self-test exit $e · ✗ $(grep -c '✗' $S/logs/walksab/$1.v2.log) · load $(uptime | sed 's/.*averages*: //')" >> $out
}
for base in $W/check-peer-arcs.1ee13421.mjs $W/check-peer-arcs.recut10.mjs; do
  b=$(basename $base .mjs | sed 's/check-peer-arcs.//')
  row $b.C8underD+ $base 's/8: { under: \[11, 11\], worst:/8: { under: [11, 12], worst:/'
  row $b.C16underL+ $base 's/16: { under: \[51, 51\], worst:/16: { under: [52, 51], worst:/'
done
cp $W/check-peer-arcs.recut10.mjs $G; echo "restored $(git hash-object $G)" >> $out; echo DONE >> $out
