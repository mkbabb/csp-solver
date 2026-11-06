#!/bin/bash
# PAL-TIN pass 10 · threshold sabotage of WALK's gate 2 (live blob 1ee13421 vs the re-cut), no rm, no set -e
S=${SCRATCH:?set SCRATCH to the lane scratch dir}
G=$S/walktree/web/frontend/scripts/check-peer-arcs.mjs; W=$S/walk; out=$S/logs/walk-sab.txt; : > $out
mkdir -p $S/logs/walksab $S/trash/walksab
cd $S/walktree/web/frontend || exit 9
row() { # $1 tag  $2 base-file  $3 sed-expr
  sed -e "$3" $2 > $G
  if cmp -s $G $2; then echo "$1 NO-OP (sed did not bite) on $(basename $2)" >> $out; return; fi
  node scripts/check-peer-arcs.mjs --self-test > $S/logs/walksab/$1.log 2>&1; e=$?
  echo "$1 on $(basename $2): self-test exit $e · ✗ $(grep -c '✗' $S/logs/walksab/$1.log) · load $(uptime | sed 's/.*averages*: //')" >> $out
}
for base in $W/check-peer-arcs.1ee13421.mjs $W/check-peer-arcs.recut10.mjs; do
  b=$(basename $base .mjs | sed 's/check-peer-arcs.//')
  row $b.MIN_DE+ $base 's/^const MIN_DE = 0.1;/const MIN_DE = 0.106;/'
  row $b.MIN_DE- $base 's/^const MIN_DE = 0.1;/const MIN_DE = 0.094;/'
  row $b.RING_FLOOR+ $base 's/^const RING_FLOOR = 0.075;/const RING_FLOOR = 0.081;/'
  row $b.RING_FLOOR- $base 's/^const RING_FLOOR = 0.075;/const RING_FLOOR = 0.069;/'
  row $b.COST_EPS+ $base 's/^const COST_EPS = 0.002;/const COST_EPS = 0.0035;/'
  row $b.COST_EPS- $base 's/^const COST_EPS = 0.002;/const COST_EPS = 0.0005;/'
  row $b.C8worstL+ $base 's/8: { under: \[11, 11\], worst: \[0.0144,/8: { under: [11, 11], worst: [0.0160,/'
  row $b.C8worstD- $base 's/8: { under: \[11, 11\], worst: \[0.0144, 0.0139\]/8: { under: [11, 11], worst: [0.0144, 0.0123]/'
  row $b.C8underD+ $base 's/8: { under: \[11, 11\]/8: { under: [11, 12]/'
  row $b.C16worstL- $base 's/worst: \[0.0073, 0.0057\]/worst: [0.0057, 0.0057]/'
  row $b.C16worstD+ $base 's/worst: \[0.0073, 0.0057\]/worst: [0.0073, 0.0073]/'
  row $b.C16underL+ $base 's/16: { under: \[51, 51\]/16: { under: [52, 51]/'
done
cp $W/check-peer-arcs.recut10.mjs $G
echo "restored $(git hash-object $G) (recut10 = $(git hash-object $W/check-peer-arcs.recut10.mjs))" >> $out
echo DONE >> $out
