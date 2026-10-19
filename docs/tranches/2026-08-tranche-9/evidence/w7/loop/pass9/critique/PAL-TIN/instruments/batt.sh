#!/bin/bash
# crit-PAL-TIN · disjunct + threshold-edge batteries on the replica (each exit to its own file; no pipes on exits)
S=$SCRATCH
A=$S/rep/web/frontend; L=$S/logs/batt; mkdir -p $L; cd $A || exit 9
out=$S/logs/batt.txt; : > $out
row() { local tag=$1; shift; local t0=$(date +%s); env "$@" > $L/$tag.log 2>&1; local e=$?; echo $e > $L/$tag.exit; echo "$tag exit $e · $(( $(date +%s)-t0 ))s · load $(uptime|sed 's/.*averages*: //') · $(grep -m1 -E 'SELF-TEST (FAILED|GREEN|PASSED)|FAILED' $L/$tag.log | cut -c1-140)" >> $out; }
row clean-st node scripts/check-peer-tin.mjs --self-test
for n in 1099 1100 1101; do row dj$n node scripts/check-peer-tin.dj$n.mjs --self-test; done
row th-MIN_DE-0.0949 TIN_THRESH=MIN_DE=0.0949 node scripts/check-peer-tin.mjs --self-test
row th-MIN_DE-0.0951 TIN_THRESH=MIN_DE=0.0951 node scripts/check-peer-tin.mjs --self-test
row th-MIN_DE-0.1038 TIN_THRESH=MIN_DE=0.1038 node scripts/check-peer-tin.mjs --self-test
row th-MIN_DE-0.1040 TIN_THRESH=MIN_DE=0.1040 node scripts/check-peer-tin.mjs --self-test
row th-RING-0.0700 TIN_THRESH=RING_FLOOR=0.0700 node scripts/check-peer-tin.mjs --self-test
row th-RING-0.0805 TIN_THRESH=RING_FLOOR=0.0805 node scripts/check-peer-tin.mjs --self-test
row th-EXEMPT-0.0700 TIN_THRESH=EXEMPT_FLOOR=0.0700 node scripts/check-peer-tin.mjs --self-test
row th-COPY-0.0253 TIN_THRESH=COPY_DE=0.0253 node scripts/check-peer-tin.mjs --self-test
row th-COPY-0.0300-control TIN_THRESH=COPY_DE=0.03 node scripts/check-peer-tin.mjs --self-test
row th-SCALAR-0.010 TIN_THRESH=SCALAR_EPS=0.010 node scripts/check-peer-tin.mjs --self-test
row th-SCALAR-0.002 TIN_THRESH=SCALAR_EPS=0.002 node scripts/check-peer-tin.mjs --self-test
echo DONE1 >> $out
for k in sep11 sep13 abs070 abs080 rat070 rat080 dh09 dh15; do row c-$k node scripts/check-peer-tin.$k.mjs --self-test; row g-$k node scripts/check-peer-tin.$k.mjs; done
echo DONE2 >> $out
