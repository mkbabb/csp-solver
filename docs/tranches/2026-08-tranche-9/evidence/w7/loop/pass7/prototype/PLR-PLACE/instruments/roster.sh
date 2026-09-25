#!/bin/bash
R=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrplace7c-work
export PLC_OUTDIR=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrplace7c-work/pw-out-B
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-p4-PLR-PLACE/web/frontend
export PLC_PAYLOAD=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass5/prototype/PLR-PLACE/readings/kill-payload.json PLC_OUT=$R/census PLC_WHAT=aa-roster
PLC_PORT=4243 PLC_ARM=tree npx playwright test -c .plr-place/pwc.config.ts .plr-place/p7-census.spec.ts > $R/roster-tree.log 2>&1; echo "roster tree exit=$?" >> $R/roster-exits.txt
PLC_PORT=4244 PLC_ARM=control-dev npx playwright test -c .plr-place/pwc.config.ts .plr-place/p7-census.spec.ts > $R/roster-ctl.log 2>&1; echo "roster control exit=$?" >> $R/roster-exits.txt
echo DONE >> $R/roster-exits.txt
