#!/bin/bash
# PLR-PLACE pass 8 · battery 2 (final bytes): the band's clause-sabotage battery and arm (a)'s dismissal.
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/place8
C=$S/copy/web/frontend; L=$S/logs/plants2.txt
export P8_PORT=4243 P8_WK=1
cd $C
sha() { shasum $C/src/pencil/chrome/PlayerMark/PlayerMark.vue $C/src/App.vue $C/e2e/player-place.spec.ts | cut -c1-12 | tr '\n' ' '; }
P() { python3 $S/cfg/plant.py $1 $2 >> $L 2>&1; }
r() { echo "== $1 $(date +%T) load $(uptime | sed 's/.*averages: //') sha $(sha)" >> $L
  npx playwright test -c .place8/pw.config.ts "$3" -g "$2" > $S/logs/pl2-$1.log 2>&1; echo "$1 exit=$?" >> $L
  grep -E "✓|✘" $S/logs/pl2-$1.log | sed 's/^ *//' | cut -c1-120 >> $L; }
r clean ' (7|12|14) · ' e2e/player-place.spec.ts
for p in BAND BAND_TE BAND_EDGE BAND_CLOSE; do P $p apply; sleep 6; r $p ' 14 · ' e2e/player-place.spec.ts; P $p restore; sleep 4; done
P SEAM_A apply; sleep 6; r SEAM_A ' (7|11|12|14) · ' e2e/player-place.spec.ts
P BAND_CLOSE apply; sleep 6; r SEAM_A+BAND_CLOSE ' 14 · ' e2e/player-place.spec.ts; P BAND_CLOSE restore; sleep 4
P BAND apply; sleep 6; r SEAM_A+BAND ' 14 · ' e2e/player-place.spec.ts; P BAND restore; sleep 4
P ARMA_TE apply; sleep 6; r SEAM_A+ARMA_TE ' (12|14) · ' e2e/player-place.spec.ts; P ARMA_TE restore; sleep 4
P SEAM_A restore; sleep 6
echo "== rate $(date +%T) sha $(sha)" >> $L
PLC_PORT=4243 PLC_HOME=$S/rate PLC_ARM=700 npx playwright test -c .place8/pw.config.ts .place8/p8-rate.spec.ts --timeout=300000 > $S/logs/rate.log 2>&1; echo "rate exit=$?" >> $L
echo "DONE $(date +%T) sha $(sha)" >> $L
