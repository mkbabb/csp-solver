#!/bin/bash
C=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit7plc-tree/web/frontend; SP=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad; L=$SP/crit7plc-logs
export CR_OUT=$SP/crit7plc-out CR_PORT=4236
export CR_CELLS='[{"w":390,"h":664,"n":2},{"w":390,"h":664,"n":2,"size":4},{"w":812,"h":375,"n":2,"size":4},{"w":1280,"h":800,"n":2,"size":4,"fine":true}]'
export CR_RSZ='[{"n":2,"from":[390,860],"to":[390,664]},{"n":2,"from":[430,932],"to":[390,664]},{"n":2,"fine":true,"from":[1920,1080],"to":[1280,800]}]'
cd $C
arm() { echo "== $1 $(date +%T) load $(uptime | sed 's/.*averages: //') procs $(ps aux | grep -cE '[n]ode|[p]laywright|[v]itest')" >> $L/run1.txt
  CR_ARM=$1 CR_WHAT=kill npx playwright test -c .crit7plc/pw.config.ts > $L/kill-$1.log 2>&1; echo "kill $1 exit=$?" >> $L/run1.txt
  if [ "$2" = r ]; then CR_ARM=$1 CR_WHAT=resize npx playwright test -c .crit7plc/pw.config.ts > $L/resize-$1.log 2>&1; echo "resize $1 exit=$?" >> $L/run1.txt; fi; }
arm chart r
python3 $SP/crit7plc-cfg/plant.py YIELD apply >> $L/run1.txt; sleep 5; arm yield r; python3 $SP/crit7plc-cfg/plant.py YIELD restore >> $L/run1.txt; sleep 3
python3 $SP/crit7plc-cfg/plant.py NO_ARM apply >> $L/run1.txt; sleep 5; arm list; python3 $SP/crit7plc-cfg/plant.py NO_ARM restore >> $L/run1.txt
shasum $C/src/pencil/chrome/PlayerMark/PlayerMark.vue $C/src/App.vue >> $L/run1.txt
echo DONE >> $L/run1.txt
