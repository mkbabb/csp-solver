#!/bin/bash
R=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plr-place-p6-work
WF=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-p4-PLR-PLACE/web/frontend
PAY=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass5/prototype/PLR-PLACE/readings/kill-payload.json
cd $WF
PLC_PORT=4243 PLC_ARM=chart PLC_OUT=$R/kill PLC_PAYLOAD=$PAY npx playwright test -c .plr-place/pw.config.ts .plr-place/probe-kill.spec.ts > $R/kill-chart.log 2>&1; echo "chart exit $?" >> $R/kill-exits.txt
python3 $R/plant.py NO_ARM apply >> $R/kill-exits.txt; sleep 4
PLC_PORT=4243 PLC_ARM=list PLC_OUT=$R/kill PLC_PAYLOAD=$PAY npx playwright test -c .plr-place/pw.config.ts .plr-place/probe-kill.spec.ts > $R/kill-list.log 2>&1; echo "list exit $?" >> $R/kill-exits.txt
python3 $R/plant.py NO_ARM restore >> $R/kill-exits.txt; echo DONE >> $R/kill-exits.txt
