#!/bin/bash
R=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plr-place-p6-work
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-p4-PLR-PLACE/web/frontend
PAY=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass5/prototype/PLR-PLACE/readings/kill-payload.json
C='[{"w":390,"h":860,"n":2,"long":false},{"w":430,"h":932,"n":2,"long":false},{"w":430,"h":932,"n":5,"long":false},{"w":768,"h":1024,"n":2,"long":false}]'
python3 $R/plant.py YIELD apply >> $R/yield2.txt; sleep 4
PLC_CELLS="$C" PLC_PORT=4243 PLC_ARM=yield PLC_OUT=$R/kill2 PLC_PAYLOAD=$PAY npx playwright test -c .plr-place/pw.config.ts .plr-place/probe-kill.spec.ts --project=chromium > $R/kill2.log 2>&1; echo "yield tall cells exit $?" >> $R/yield2.txt
python3 $R/plant.py YIELD restore >> $R/yield2.txt; sleep 3
PLC_CELLS="$C" PLC_PORT=4243 PLC_ARM=chart PLC_OUT=$R/kill2 PLC_PAYLOAD=$PAY npx playwright test -c .plr-place/pw.config.ts .plr-place/probe-kill.spec.ts --project=chromium > $R/kill2c.log 2>&1; echo "chart tall cells exit $?" >> $R/yield2.txt
echo DONE >> $R/yield2.txt
