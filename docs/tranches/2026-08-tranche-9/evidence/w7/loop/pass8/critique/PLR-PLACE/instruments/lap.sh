#!/bin/bash
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit-place8
C=$S/p7/web/frontend
L=$S/readings/lap.txt; mkdir -p $S/readings
cd $S
sha() { shasum $C/src/pencil/chrome/PlayerMark/PlayerMark.vue $C/src/App.vue | cut -c1-12 | tr '\n' ' '; }
echo "== chart $(date +%T) load $(uptime | sed 's/.*averages: //') sha $(sha)" >> $L
C8_OUT=$L C8_ARM=chart C8_WK=2 C8_CELLS='[[3,390,664],[4,390,664],[4,430,932],[4,390,844]]' npx playwright test -c $S/pw.crit.config.ts > $S/lap-chart.log 2>&1; echo "chart exit=$?" >> $L
python3 $S/plant.py LIST apply >> $L 2>&1; sleep 8
echo "== list $(date +%T) load $(uptime | sed 's/.*averages: //') sha $(sha)" >> $L
C8_OUT=$L C8_ARM=list C8_WK=2 C8_CELLS='[[3,390,664],[4,390,664],[4,430,932]]' npx playwright test -c $S/pw.crit.config.ts > $S/lap-list.log 2>&1; echo "list exit=$?" >> $L
python3 $S/plant.py LIST restore >> $L 2>&1
echo "DONE $(date +%T) sha $(sha)" >> $L
