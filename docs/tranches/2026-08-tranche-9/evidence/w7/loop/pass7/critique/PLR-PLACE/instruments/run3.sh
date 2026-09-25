#!/bin/bash
C=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit7plc-tree/web/frontend; SP=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad; L=$SP/crit7plc-logs
export CR_OUT=$SP/crit7plc-out CR_PORT=4236
cd $C
P() { python3 $SP/crit7plc-cfg/plant.py $1 $2 >> $L/run3.txt 2>&1; }
r15() { echo "== row15 $1 $(date +%T) load $(uptime | sed 's/.*averages: //') sha $(shasum $C/src/pencil/chrome/PlayerMark/PlayerMark.vue | cut -c1-12)" >> $L/run3.txt; npx playwright test -c .crit7plc/pwe.config.ts -g "15 · open at" > $L/r3-row15-$1.log 2>&1; echo "row15 $1 exit=$?" >> $L/run3.txt; grep -E "✓|✘" $L/r3-row15-$1.log | cut -c1-140 >> $L/run3.txt; }
shasum $C/src/pencil/chrome/PlayerMark/PlayerMark.vue $C/src/App.vue >> $L/run3.txt
P REFIT apply; sleep 5; r15 REFIT-chart
P YIELD apply; sleep 5; r15 YIELD+REFIT
P REFIT restore; sleep 5
echo "== kill16 yield $(date +%T) sha $(shasum $C/src/pencil/chrome/PlayerMark/PlayerMark.vue | cut -c1-12)" >> $L/run3.txt
CR_CELLS='[{"w":390,"h":844,"n":2,"size":4},{"w":430,"h":932,"n":2,"size":4},{"w":1920,"h":1080,"n":2,"size":4,"fine":true}]' CR_ARM=yield CR_WHAT=kill npx playwright test -c .crit7plc/pw.config.ts > $L/r3-kill16-yield.log 2>&1; echo "kill16 yield exit=$?" >> $L/run3.txt
P YIELD restore
echo "== kill16 chart(2) $(date +%T) sha $(shasum $C/src/pencil/chrome/PlayerMark/PlayerMark.vue | cut -c1-12)" >> $L/run3.txt
CR_CELLS='[{"w":430,"h":932,"n":2,"size":4},{"w":1920,"h":1080,"n":2,"size":4,"fine":true}]' CR_ARM=chart CR_WHAT=kill npx playwright test -c .crit7plc/pw.config.ts > $L/r3-kill16-chart.log 2>&1; echo "kill16 chart2 exit=$?" >> $L/run3.txt
P NO_ARM apply; sleep 5
CR_CELLS='[{"w":390,"h":844,"n":2,"size":4},{"w":430,"h":932,"n":2,"size":4},{"w":1920,"h":1080,"n":2,"size":4,"fine":true}]' CR_ARM=list CR_WHAT=kill npx playwright test -c .crit7plc/pw.config.ts > $L/r3-kill16-list.log 2>&1; echo "kill16 list exit=$?" >> $L/run3.txt
P NO_ARM restore
shasum $C/src/pencil/chrome/PlayerMark/PlayerMark.vue $C/src/App.vue >> $L/run3.txt
echo DONE >> $L/run3.txt
