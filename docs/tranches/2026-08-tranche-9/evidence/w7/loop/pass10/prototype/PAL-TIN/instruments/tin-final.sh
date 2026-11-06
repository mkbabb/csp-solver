#!/bin/bash
# PAL-TIN pass 10 · final-bytes batteries on the replica: threshold, clause sabotage, and the five bounds' born-RED on the pass-9 gate
S=${SCRATCH:?set SCRATCH to the lane scratch dir}
cd $S/rep/web/frontend || exit 9
echo "gate $(shasum scripts/check-peer-tin.mjs | cut -c1-8) lib $(shasum scripts/shape-census.mjs | cut -c1-8)" > $S/logs/final.txt
node scripts/check-peer-tin.mjs --threshold-battery > $S/logs/final-thresh.log 2>&1; echo "threshold exit $?" >> $S/logs/final.txt
node scripts/check-peer-tin.mjs --sabotage-battery > $S/logs/final-sab.log 2>&1; echo "sabotage exit $?" >> $S/logs/final.txt
# born-RED: the pass-9 gate (bank d05491a3, homes-v3 library) with each of the critic's five moves: exit 0 = unpinned
P=$S/trash/check-peer-tin.d05491a3.mjs
cp $P scripts/check-peer-tin.p9sab.mjs; node scripts/check-peer-tin.p9sab.mjs --self-test > $S/logs/final-p9ctl.log 2>&1; echo "born-RED CONTROL pass-9 gate unsabotaged: self-test exit $?" >> $S/logs/final.txt
for e in 's/^const MIN_SEP = 12;/const MIN_SEP = 13;/' 's/^const ABS_FLOOR = 0.075;/const ABS_FLOOR = 0.08;/' 's/^const RATIO_FLOOR = 0.75;/const RATIO_FLOOR = 0.70;/' 's/^const RING_DH = 1;/const RING_DH = 1.5;/' 's/SCALAR_EPS = TH.SCALAR_EPS ?? 0.005;/SCALAR_EPS = TH.SCALAR_EPS ?? 0.010;/'; do
  sed -e "$e" $P > scripts/check-peer-tin.p9sab.mjs
  if cmp -s scripts/check-peer-tin.p9sab.mjs $P; then echo "born-RED NO-OP $e" >> $S/logs/final.txt; continue; fi
  node scripts/check-peer-tin.p9sab.mjs --self-test > $S/logs/final-p9sab.log 2>&1; echo "born-RED pass-9 gate '$e': self-test exit $?" >> $S/logs/final.txt
done
mv scripts/check-peer-tin.p9sab.mjs $S/trash/check-peer-tin.p9sab.last.mjs
echo DONE >> $S/logs/final.txt
