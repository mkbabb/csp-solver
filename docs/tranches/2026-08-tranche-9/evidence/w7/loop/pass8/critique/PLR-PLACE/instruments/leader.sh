#!/bin/bash
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit-place8
C=$S/p7/web/frontend; L=$S/readings/leader.txt
cd $S
sha() { shasum $C/src/pencil/chrome/PlayerMark/PlayerMark.vue $C/src/App.vue $C/e2e/player-mark.spec.ts | cut -c1-12 | tr '\n' ' '; }
r() { echo "== $1 $(date +%T) load $(uptime | sed 's/.*averages: //') sha $(sha)" >> $L
  C8_DIR=$C/e2e C8_MATCH='player-mark\.spec\.ts$' npx playwright test -c $S/pw.crit.config.ts -g "$2" > $S/leader-$1.log 2>&1; echo "$1 exit=$?" >> $L
  grep -E "✓|✘|toMatchObject|Expected|Received|^\s+[-+] |x[0-9]+ (coarse|fine)" $S/leader-$1.log | sed 's/^ *//' | cut -c1-140 | head -40 >> $L; }
r chart 'a portrait phone compresses exactly where four rows|the row budget flips where the three more rows'
python3 $S/plant.py LIST apply >> $L 2>&1; sleep 8
r list 'the row budget flips where the three more rows'
python3 $S/plant.py LIST restore >> $L 2>&1
echo "DONE $(date +%T) sha $(sha)" >> $L
