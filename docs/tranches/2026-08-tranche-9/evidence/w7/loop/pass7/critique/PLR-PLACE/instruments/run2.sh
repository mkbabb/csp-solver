#!/bin/bash
C=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit7plc-tree/web/frontend; SP=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad; L=$SP/crit7plc-logs
export CR_OUT=$SP/crit7plc-out CR_PORT=4236
cd $C
shasum $C/src/pencil/chrome/PlayerMark/PlayerMark.vue $C/src/App.vue >> $L/run2.txt
echo "== chart16 $(date +%T) load $(uptime | sed 's/.*averages: //') procs $(ps aux | grep -cE '[n]ode|[p]laywright|[v]itest')" >> $L/run2.txt
CR_CELLS='[{"w":390,"h":664,"n":2,"size":4},{"w":390,"h":844,"n":2,"size":4},{"w":812,"h":375,"n":2,"size":4},{"w":1280,"h":800,"n":2,"size":4,"fine":true}]' CR_ARM=chart CR_WHAT=kill npx playwright test -c .crit7plc/pw.config.ts > $L/kill16-chart.log 2>&1; echo "kill16 chart exit=$?" >> $L/run2.txt
python3 $SP/crit7plc-cfg/plant.py YIELD apply >> $L/run2.txt; sleep 5
echo "== quiet-yield $(date +%T) load $(uptime | sed 's/.*averages: //') procs $(ps aux | grep -cE '[n]ode|[p]laywright|[v]itest')" >> $L/run2.txt
CR_Q='[{"w":390,"h":860,"n":2}]' CR_ARM=yield CR_WHAT=quiet npx playwright test -c .crit7plc/pw.config.ts > $L/quiet-yield.log 2>&1; echo "quiet yield exit=$?" >> $L/run2.txt
CR_CELLS='[{"w":390,"h":844,"n":2,"size":4}]' CR_ARM=yield CR_WHAT=kill npx playwright test -c .crit7plc/pw.config.ts > $L/kill16b-yield.log 2>&1; echo "kill16b yield exit=$?" >> $L/run2.txt
python3 $SP/crit7plc-cfg/plant.py YIELD restore >> $L/run2.txt
echo DONE >> $L/run2.txt
# run3: row 15 clean, REFIT (chart arm), YIELD+REFIT
L=$SP/crit7plc-logs
r15() { echo "== row15 $1 $(date +%T) load $(uptime | sed 's/.*averages: //') sha $(shasum $C/src/pencil/chrome/PlayerMark/PlayerMark.vue | cut -c1-12)" >> $L/run2.txt; npx playwright test -c .crit7plc/pwe.config.ts -g "15 · open at" > $L/row15-$1.log 2>&1; echo "row15 $1 exit=$?" >> $L/run2.txt; grep -E "✓|✘" $L/row15-$1.log >> $L/run2.txt; }
r15 clean
python3 $SP/crit7plc-cfg/plant.py REFIT apply >> $L/run2.txt; sleep 5; r15 refit-chart
python3 $SP/crit7plc-cfg/plant.py YIELD apply >> $L/run2.txt; sleep 5; r15 refit-yield
python3 $SP/crit7plc-cfg/plant.py YIELD restore >> $L/run2.txt; python3 $SP/crit7plc-cfg/plant.py REFIT restore >> $L/run2.txt
shasum $C/src/pencil/chrome/PlayerMark/PlayerMark.vue $C/src/App.vue >> $L/run2.txt
echo DONE3 >> $L/run2.txt
