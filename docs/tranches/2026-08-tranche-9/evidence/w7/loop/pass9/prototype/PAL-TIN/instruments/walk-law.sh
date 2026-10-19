#!/bin/bash
# PAL-TIN pass 9 · the separation-law hand-over on WALK's gate blob bb15c9e1: gate + self-test, then the threshold rows. No rm.
S=$SCRATCH; F=$S/walktree/web/frontend; L=$S/logs/walk-law2.txt
cd $F || exit 9
cp $S/walk/arcs.bb15.mjs scripts/check-peer-arcs.mjs
echo "base blob $(git hash-object scripts/check-peer-arcs.mjs | cut -c1-8) · load $(uptime | sed 's/.*averages*: //') · $(date +%T)" > $L
patch -p3 -s scripts/check-peer-arcs.mjs < $S/separation-law.into-walk-gate2.pass9.diff; echo "re-cut applied exit $? · blob $(git hash-object scripts/check-peer-arcs.mjs | cut -c1-8)" >> $L
node scripts/check-peer-arcs.mjs > $S/logs/walk2-gate.txt 2>&1; echo "re-cut gate EXIT=$?" >> $L
node scripts/check-peer-arcs.mjs --self-test > $S/logs/walk2-st.txt 2>&1; echo "re-cut self-test EXIT=$?" >> $L
cp scripts/check-peer-arcs.mjs $S/walk/arcs.recut.mjs
for mv in "MIN_DE = 0.1;|MIN_DE = 0.09;" "MIN_DE = 0.1;|MIN_DE = 0.11;" "RING_FLOOR = 0.075;|RING_FLOOR = 0.065;" "RING_FLOOR = 0.075;|RING_FLOOR = 0.085;"; do
  cp $S/walk/arcs.recut.mjs scripts/check-peer-arcs.mjs
  a=${mv%%|*}; b=${mv##*|}; sed -i '' "s/^const $a/const $b/" scripts/check-peer-arcs.mjs
  n=$(grep -c "^const $b" scripts/check-peer-arcs.mjs)
  node scripts/check-peer-arcs.mjs --self-test > $S/logs/walk2-thr.txt 2>&1; echo "THRESHOLD $a → $b ($n site) self-test EXIT=$? · $(grep -c 'is unpinned' $S/logs/walk2-thr.txt) unpinned rows" >> $L
done
cp $S/walk/arcs.recut.mjs scripts/check-peer-arcs.mjs
echo "end $(date +%T)" >> $L
