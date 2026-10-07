#!/bin/bash
# PLR-PLACE pass 8 · the break battery on the served byte copy (:4243). No set -e. Each plant is a
# file edit hot-swapped into the dev server, restored by the inverse edit with its sha1 printed.
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/place8
C=$S/copy/web/frontend; L=$S/logs/plants.txt
export P8_PORT=4243 P8_WK=1
cd $C
sha() { shasum $C/src/pencil/chrome/PlayerMark/PlayerMark.vue $C/src/App.vue $C/e2e/player-place.spec.ts $C/e2e/player-mark.spec.ts | cut -c1-12 | tr '\n' ' '; }
P() { python3 $S/cfg/plant.py $1 $2 >> $L 2>&1; }
r() { # tag grep-pattern spec
  echo "== $1 $(date +%T) load $(uptime | sed 's/.*averages: //') sha $(sha)" >> $L
  npx playwright test -c .place8/pw.config.ts "$3" -g "$2" > $S/logs/pl-$1.log 2>&1; echo "$1 exit=$?" >> $L
  grep -E "✓|✘|  -  " $S/logs/pl-$1.log | sed 's/^ *//' | cut -c1-150 >> $L
}
cp /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-p4-PLR-PLACE/web/frontend/.place8/p8-census.spec.ts $C/.place8/p8-census.spec.ts
echo "== aa2+s10 $(date +%T) sha $(sha)" >> $L
P8_OUT=$S/readings P8_WHAT=aa P8_ARM=chart npx playwright test -c .place8/pw.config.ts .place8/p8-census.spec.ts > $S/logs/aa2.log 2>&1; echo "aa2 exit=$?" >> $L
P8_OUT=$S/readings P8_WHAT=s10 P8_TREE=place8-74a2b5d9 P8_LOBBY=1 npx playwright test -c .place8/pw.config.ts .place8/p8-census.spec.ts > $S/logs/s10-place8.log 2>&1; echo "s10-place8 exit=$?" >> $L
EDGE=' (7|12|14) · '
r clean-edge "$EDGE" e2e/player-place.spec.ts
for p in BAND BAND_TE BAND_EDGE BAND_CLOSE SEAM_A E4; do P $p apply; sleep 6; r $p ' (12|14) · ' e2e/player-place.spec.ts; P $p restore; sleep 4; done
P SEAM_A apply; P BAND_CLOSE apply; sleep 6; r SEAM_A+BAND_CLOSE ' 14 · ' e2e/player-place.spec.ts; P BAND_CLOSE restore; P SEAM_A restore; sleep 4
P REFIT apply; sleep 6; r REFIT ' 15 · ' e2e/player-place.spec.ts
P YIELD apply; sleep 6; r YIELD+REFIT ' 15 · ' e2e/player-place.spec.ts; P REFIT restore; sleep 6
r YIELD-15 ' 15 · ' e2e/player-place.spec.ts
LEAD='portrait phone compresses|reads the space again|row budget flips|desk draws four rows'
r YIELD-leader "$LEAD" e2e/player-mark.spec.ts
P YIELD restore; sleep 6
r CHART-leader "$LEAD" e2e/player-mark.spec.ts
P LIST apply; sleep 6; r LIST-leader "$LEAD" e2e/player-mark.spec.ts; P LIST restore; sleep 4
echo "DONE $(date +%T) sha $(sha)" >> $L
