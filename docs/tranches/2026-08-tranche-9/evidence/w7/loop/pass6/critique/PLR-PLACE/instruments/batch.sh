#!/bin/bash
C=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plr-place-crit6
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-p4-PLR-PLACE/web/frontend
PAY=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass5/prototype/PLR-PLACE/readings/kill-payload.json
CELLS='[{"w":390,"h":664,"n":2,"long":false},{"w":360,"h":800,"n":2,"long":false},{"w":844,"h":390,"n":2,"long":false}]'
PW="npx playwright test -c $C/pw.config.ts"
st() { echo "$(date +%T) $*" >> $C/batch-status.txt; }
st START
TD=$C/specs CRIT_OUT=$C/out/crit6.txt $PW crit6.spec.ts > $C/b-crit6.log 2>&1; st "crit6 exit $?"
TD=$C/specs PLC_ARM=chart PLC_OUT=$C/out PLC_PAYLOAD=$PAY PLC_CELLS="$CELLS" $PW probe-kill.spec.ts > $C/b-kill-chart.log 2>&1; st "kill chart exit $?"
python3 $C/plant.py NO_ARM apply >> $C/batch-status.txt; sleep 4
TD=$C/specs PLC_ARM=list PLC_OUT=$C/out PLC_PAYLOAD=$PAY PLC_CELLS="$CELLS" $PW probe-kill.spec.ts > $C/b-kill-list.log 2>&1; st "kill list exit $?"
python3 $C/plant.py NO_ARM restore >> $C/batch-status.txt; sleep 3
python3 $C/plant.py YIELD apply >> $C/batch-status.txt; sleep 4
TD=$C/specs PLC_ARM=yield PLC_OUT=$C/out PLC_PAYLOAD=$PAY PLC_CELLS="$CELLS" $PW probe-kill.spec.ts > $C/b-kill-yield.log 2>&1; st "kill yield exit $?"
TD=$C/specs CRIT_OUT=$C/out/crit6-yield.txt $PW crit6.spec.ts -g ROT > $C/b-crit6-yield.log 2>&1; st "crit6 ROT yield exit $?"
python3 $C/plant.py YIELD restore >> $C/batch-status.txt; sleep 3
python3 $C/plant.py GHOST apply >> $C/batch-status.txt; sleep 4
$PW player-place.spec.ts -g "13 ·" --repeat-each 3 > $C/b-ghost.log 2>&1; st "GHOST row13 x3 exit $?"
python3 $C/plant.py GHOST restore >> $C/batch-status.txt; sleep 3
python3 $C/plant.py E4 apply >> $C/batch-status.txt; sleep 4
$PW player-place.spec.ts -g "14 ·" > $C/b-e4.log 2>&1; st "E4 row14 exit $?"
python3 $C/plant.py E4 restore >> $C/batch-status.txt; sleep 3
$PW player-mark.spec.ts -g "a portrait phone compresses" > $C/b-leader507.log 2>&1; st "leader507 exit $?"
st DONE
