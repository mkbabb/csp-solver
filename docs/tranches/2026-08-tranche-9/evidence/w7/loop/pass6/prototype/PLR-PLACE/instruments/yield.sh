#!/bin/bash
R=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plr-place-p6-work
WF=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-p4-PLR-PLACE/web/frontend
PAY=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass5/prototype/PLR-PLACE/readings/kill-payload.json
cd $WF
G="a portrait phone compresses exactly where four rows would lap the board"
PLC_PORT=4243 npx playwright test -c .plr-place/pw.config.ts e2e/player-mark.spec.ts -g "$G" > $R/y-leader-default.log 2>&1; echo "leader row, CHART default (yields=false) exit=$? $(grep -E '(✓|✘)' $R/y-leader-default.log | grep -oE '(✓|✘) +[0-9]+ \[[a-z]+\]' | tr '\n' ' ')" >> $R/yield.txt
python3 $R/plant.py NO_ARM apply >> $R/yield.txt; sleep 4
PLC_PORT=4243 npx playwright test -c .plr-place/pw.config.ts e2e/player-mark.spec.ts -g "$G" > $R/y-leader-noarm.log 2>&1; echo "leader row, PLACE_CHART=false exit=$? $(grep -E '(✓|✘)' $R/y-leader-noarm.log | grep -oE '(✓|✘) +[0-9]+ \[[a-z]+\]' | tr '\n' ' ')" >> $R/yield.txt
python3 $R/plant.py NO_ARM restore >> $R/yield.txt; sleep 3
python3 $R/plant.py YIELD apply >> $R/yield.txt; sleep 4
PLC_PORT=4243 npx playwright test -c .plr-place/pw.config.ts e2e/player-mark.spec.ts -g "$G" > $R/y-leader-yield.log 2>&1; echo "leader row, CHART_YIELDS=true exit=$? $(grep -E '(✓|✘)' $R/y-leader-yield.log | grep -oE '(✓|✘) +[0-9]+ \[[a-z]+\]' | tr '\n' ' ')" >> $R/yield.txt
PLC_PORT=4243 PLC_ARM=yield PLC_OUT=$R/kill PLC_PAYLOAD=$PAY npx playwright test -c .plr-place/pw.config.ts .plr-place/probe-kill.spec.ts > $R/kill-yield.log 2>&1; echo "kill yield exit $?" >> $R/yield.txt
python3 $R/plant.py YIELD restore >> $R/yield.txt; echo DONE >> $R/yield.txt
