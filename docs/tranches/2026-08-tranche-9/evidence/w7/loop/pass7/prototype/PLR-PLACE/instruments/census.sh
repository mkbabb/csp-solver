#!/bin/bash
# PLR-PLACE pass 7 — the three arms' census + resize-at-rest, both engines; arms flipped by plant.py (sha1 restore).
export PLC_OUTDIR=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrplace7c-work/pw-out-B
R=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrplace7c-work
WF=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-p4-PLR-PLACE/web/frontend
export PLC_PAYLOAD=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass5/prototype/PLR-PLACE/readings/kill-payload.json
export PLC_OUT=$R/census PLC_PORT=4243
export PLC_CELLS='[{"w":390,"h":664,"n":2},{"w":390,"h":800,"n":2},{"w":360,"h":800,"n":2},{"w":390,"h":844,"n":2},{"w":390,"h":860,"n":2},{"w":390,"h":844,"n":5},{"w":430,"h":932,"n":2},{"w":430,"h":932,"n":5},{"w":768,"h":1024,"n":2},{"w":844,"h":390,"n":2},{"w":844,"h":390,"n":7},{"w":812,"h":375,"n":2},{"w":1280,"h":800,"n":2,"fine":true},{"w":1440,"h":900,"n":2,"fine":true},{"w":1536,"h":864,"n":2,"fine":true},{"w":1920,"h":1080,"n":2,"fine":true}]'
export PLC_RSZ='[{"n":2,"from":[390,860],"to":[390,664]},{"n":3,"from":[390,1000],"to":[390,664]},{"n":2,"from":[390,664],"to":[390,860]},{"n":7,"from":[390,844],"to":[390,800]}]'
cd $WF
one() { # arm
  echo "load $(uptime | sed 's/.*averages: //') procs $(ps aux | grep -cE '[n]ode|[p]laywright|[v]itest')" >> $R/census-exits.txt
  PLC_ARM=$1 PLC_WHAT=census npx playwright test -c .plr-place/pwc.config.ts .plr-place/p7-census.spec.ts > $R/census-$1.log 2>&1; echo "census $1 exit=$?" >> $R/census-exits.txt
  PLC_ARM=$1 PLC_WHAT=resize npx playwright test -c .plr-place/pwc.config.ts .plr-place/p7-census.spec.ts > $R/resize-$1.log 2>&1; echo "resize $1 exit=$?" >> $R/census-exits.txt
}
one chart
python3 $R/plant.py YIELD apply >> $R/census-exits.txt; sleep 4; one yield; python3 $R/plant.py YIELD restore >> $R/census-exits.txt; sleep 3
python3 $R/plant.py NO_ARM apply >> $R/census-exits.txt; sleep 4; one list; python3 $R/plant.py NO_ARM restore >> $R/census-exits.txt; sleep 3
python3 $R/plant.py REFIT apply >> $R/census-exits.txt; sleep 4
PLC_ARM=chart-REFIT PLC_WHAT=resize npx playwright test -c .plr-place/pwc.config.ts .plr-place/p7-census.spec.ts > $R/resize-refit.log 2>&1; echo "resize chart-REFIT exit=$?" >> $R/census-exits.txt
python3 $R/plant.py REFIT restore >> $R/census-exits.txt
echo DONE >> $R/census-exits.txt
