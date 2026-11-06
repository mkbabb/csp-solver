#!/bin/bash
# PAL-TIN pass 10 · the re-cut hand-over on the WAVE's copy of WALK's gate (1ac0874a): base self-test, then patched
S=${SCRATCH:?set SCRATCH to the lane scratch dir}
while [ ! -f $S/logs/walk-sab.exit ]; do sleep 30; done
cd $S/wave10/web/frontend || exit 9
node scripts/check-peer-arcs.mjs --self-test > $S/logs/walk-wave-base.log 2>&1; echo "base exit $?" > $S/logs/walk-wave.txt
(cd $S/wave10 && git apply $S/walk/separation-law.into-walk-gate2.pass10.diff); echo "apply $?" >> $S/logs/walk-wave.txt
node scripts/check-peer-arcs.mjs --self-test > $S/logs/walk-wave-recut.log 2>&1; echo "recut exit $?" >> $S/logs/walk-wave.txt
cp $S/trash/wave10.check-peer-arcs.1ac0874a.mjs scripts/check-peer-arcs.mjs; echo "restored $(cd $S/wave10 && git hash-object web/frontend/scripts/check-peer-arcs.mjs)" >> $S/logs/walk-wave.txt
echo DONE >> $S/logs/walk-wave.txt
