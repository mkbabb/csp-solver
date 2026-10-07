#!/bin/bash
# PLR-PLACE pass 8 · battery 3 on the FINAL bytes (PlayerMark 3c46f26a881b): the band's clause-sabotage
# battery and arm (a)'s dismissal, re-run after the last (prettier) edit.
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/place8
C=$S/copy/web/frontend; L=$S/logs/plants3.txt
export P8_PORT=4243 P8_WK=1
cd $C
sha() { shasum $C/src/pencil/chrome/PlayerMark/PlayerMark.vue $C/e2e/player-place.spec.ts | cut -c1-12 | tr '\n' ' '; }
P() { python3 $S/cfg/plant.py $1 $2 >> $L 2>&1; }
r() { echo "== $1 $(date +%T) load $(uptime | sed 's/.*averages: //') sha $(sha)" >> $L
  npx playwright test -c .place8/pw.config.ts "$3" -g "$2" > $S/logs/pl3-$1.log 2>&1; echo "$1 exit=$?" >> $L
  grep -E "✓|✘" $S/logs/pl3-$1.log | sed 's/^ *//' | cut -c1-110 >> $L; }
r clean ' (12|14) · ' e2e/player-place.spec.ts
for p in BAND BAND_TE BAND_EDGE BAND_CLOSE E4; do P $p apply; sleep 6; r $p ' (12|14) · ' e2e/player-place.spec.ts; P $p restore; sleep 4; done
P SEAM_A apply; sleep 6; r SEAM_A ' (12|14) · ' e2e/player-place.spec.ts
for p in BAND_CLOSE ARMA_TE; do P $p apply; sleep 6; r SEAM_A+$p ' (12|14) · ' e2e/player-place.spec.ts; P $p restore; sleep 4; done
P SEAM_A restore; sleep 4
echo "DONE $(date +%T) sha $(sha)" >> $L
