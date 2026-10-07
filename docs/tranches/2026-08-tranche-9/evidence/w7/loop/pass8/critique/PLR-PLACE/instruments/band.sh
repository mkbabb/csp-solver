#!/bin/bash
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit-place8
C=$S/p7/web/frontend; L=$S/readings/band.txt
cd $S
sha() { shasum $C/src/pencil/chrome/PlayerMark/PlayerMark.vue $C/e2e/player-place.spec.ts | cut -c1-12 | tr '\n' ' '; }
P() { python3 $S/plant.py $1 $2 >> $L 2>&1; if [ "$2" = restore ] && [ "$(shasum $C/src/pencil/chrome/PlayerMark/PlayerMark.vue | cut -c1-12)" != 3c46f26a881b ]; then echo "ABORT restore $1" >> $L; exit 3; fi; }
rows() { echo "== $1 rows12/14 $(date +%T) load $(uptime | sed 's/.*averages: //') sha $(sha)" >> $L
  C8_DIR=$C/e2e C8_MATCH='player-place\.spec\.ts$' npx playwright test -c $S/pw.crit.config.ts -g ' (12|14) · ' > $S/band-$1.log 2>&1; echo "$1 rows exit=$?" >> $L
  grep -E "✓|✘|Expected|Received|^\s+[-+] " $S/band-$1.log | sed 's/^ *//' | cut -c1-120 | head -30 >> $L; }
side() { echo "== $1 side $(date +%T) sha $(sha)" >> $L
  C8_OUT=$L C8_ARM=$1 npx playwright test -c $S/pw.crit.config.ts -g 'side band 3' > $S/side-$1.log 2>&1; echo "$1 side exit=$?" >> $L; }
# clean done in run 1
for p in NO_BOTTOM; do P $p apply; sleep 6; rows $p; P $p restore; sleep 4; done
for p in NO_RIGHT NO_LEFT NO_TOP NO_TOUCHKEY; do P $p apply; sleep 6; rows $p; side $p; P $p restore; sleep 4; done
echo "DONE $(date +%T) sha $(sha)" >> $L
