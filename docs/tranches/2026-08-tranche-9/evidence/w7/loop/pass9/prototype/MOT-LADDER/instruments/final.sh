#!/bin/bash
# final.sh : every browserless battery on the FINAL gate bytes, sequential, exits bare to files.
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/MOT-LADDER
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-59/web/frontend
L=$S/logs/final; mkdir -p $L; X=$L/exits.txt; : > $X
shasum $W/scripts/check-motion-bands.mjs > $L/gate.sha1
cd $W
node scripts/check-motion-bands.mjs --self-test > $L/tree-selftest.log 2>&1; echo "tree-selftest $? load=$(sysctl -n vm.loadavg)" >> $X
node scripts/check-motion-bands.mjs --sabotage-battery > $L/tree-sabotage.log 2>&1; echo "tree-sabotage $?" >> $X
$S/bin/snap.sh snapB2 > /dev/null 2>&1; $S/bin/snap.sh snapP2 > /dev/null 2>&1
cp $S/prop/web/frontend/scripts/shape-census.mjs $S/prop/web/frontend/scripts/shape-census.d.mts $S/snapP2/web/frontend/scripts/
(cd $S/snapP2/web/frontend && node scripts/check-motion-bands.mjs --self-test > $L/prop-selftest.log 2>&1; echo "prop-gate-selftest $?" >> $X)
(cd $S/snapP2/web/frontend && node scripts/shape-census.mjs --self-test > $L/prop-lib-selftest.log 2>&1; echo "prop-lib-selftest $?" >> $X)
$S/bin/kbattery.sh snapB2 final-bank > $L/kb.log 2>&1; echo "kbattery-bank done" >> $X
$S/bin/kbattery.sh snapP2 final-prop > $L/kp.log 2>&1; echo "kbattery-prop done" >> $X
$S/bin/wavesync.sh > $L/wavesync.log 2>&1
(cd $S/waveP/web/frontend && npx prettier --write --config .prettierrc.json scripts/check-motion-bands.mjs > /dev/null; node scripts/check-motion-bands.mjs --self-test > $L/wave-selftest.log 2>&1; echo "wave-selftest $?" >> $X)
echo FINAL-DONE >> $X
