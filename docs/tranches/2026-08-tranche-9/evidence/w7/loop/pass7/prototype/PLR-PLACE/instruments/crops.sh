#!/bin/bash
R=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrplace7c-work
export PLC_OUTDIR=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrplace7c-work/pw-out-B
WF=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-p4-PLR-PLACE/web/frontend
export PLC_PAYLOAD=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass5/prototype/PLR-PLACE/readings/kill-payload.json
export PLC_OUT=$R/census PLC_PORT=4243
O=$R/crops-exits.txt
cd $WF
echo "load $(uptime | sed 's/.*averages: //')" >> $O
PLC_ARM=chart PLC_WHAT=census PLC_CELLS='[{"w":390,"h":860,"n":2}]' npx playwright test -c .plr-place/pwc.config.ts .plr-place/p7-census.spec.ts --project=webkit > $R/census-chart-rerun.log 2>&1; echo "census chart webkit 390x860 rerun exit=$?" >> $O
PLC_ARM=chart PLC_WHAT=crop npx playwright test -c .plr-place/pwc.config.ts .plr-place/p7-census.spec.ts > $R/crop-chart.log 2>&1; echo "crop chart exit=$?" >> $O
PLC_ARM=chart PLC_WHAT=aa npx playwright test -c .plr-place/pwc.config.ts .plr-place/p7-census.spec.ts > $R/aa-chart.log 2>&1; echo "aa chart exit=$?" >> $O
python3 $R/plant.py YIELD apply >> $O; sleep 4
PLC_ARM=yield PLC_WHAT=crop npx playwright test -c .plr-place/pwc.config.ts .plr-place/p7-census.spec.ts > $R/crop-yield.log 2>&1; echo "crop yield exit=$?" >> $O
python3 $R/plant.py YIELD restore >> $O; sleep 3
python3 $R/plant.py NO_ARM apply >> $O; sleep 4
PLC_ARM=list PLC_WHAT=crop npx playwright test -c .plr-place/pwc.config.ts .plr-place/p7-census.spec.ts > $R/crop-list.log 2>&1; echo "crop list exit=$?" >> $O
python3 $R/plant.py NO_ARM restore >> $O
echo DONE >> $O
