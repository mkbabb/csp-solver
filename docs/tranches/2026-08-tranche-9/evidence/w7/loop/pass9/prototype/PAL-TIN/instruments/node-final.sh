#!/bin/bash
# PAL-TIN pass 9 · the node rows on the FINAL gate bytes (after the lint cure), serial to hold the box load: the node
# battery (lane tree), the 45-attack table (replica), the WAVE gate rows. No rm, no set -e.
S=$SCRATCH
$S/node-battery.sh; echo "node-battery.sh exit $?" > $S/logs/node-final.txt
$S/g4attack9.sh; echo "g4attack9.sh exit $?" >> $S/logs/node-final.txt
$S/wave-recheck.sh; echo "wave-recheck.sh exit $?" >> $S/logs/node-final.txt
$S/born-src.sh; echo "born-src.sh exit $?" >> $S/logs/node-final.txt
echo done > $S/logs/node-final.done
