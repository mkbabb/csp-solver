#!/bin/bash
# PLR-PLACE pass 8 · dist reads: tree dist (:4243, index-Clbwkecx8img.js) vs control dist (:4251, index-CubiZsMVSwTc.js).
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/place8
T=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-p4-PLR-PLACE/web/frontend
L=$S/logs/dist.txt; cd $T
echo "== start $(date +%T) load $(uptime | sed 's/.*averages: //')" >> $L
node $S/cfg/check-property-block.p6copy.mjs --fe $S/gate/web/frontend --dist $S/dist-tree --served http://127.0.0.1:4243 > $S/logs/pb-tree.log 2>&1; echo "property-block tree (fe+dist+served) exit=$?" >> $L; tail -2 $S/logs/pb-tree.log >> $L
node $S/cfg/check-property-block.p6copy.mjs --fe $S/ctlg/web/frontend --dist /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-control/web/frontend/dist --served http://127.0.0.1:4251 > $S/logs/pb-ctl.log 2>&1; echo "property-block control exit=$?" >> $L; tail -2 $S/logs/pb-ctl.log >> $L
for p in 4243 4251; do P8_PORT=$p npx playwright test -c .place8/pw.config.ts e2e/filter-census.spec.ts > $S/logs/filters-$p.log 2>&1; echo "filter-census :$p exit=$?" >> $L; grep -E "passed|failed" $S/logs/filters-$p.log | tail -2 >> $L; done
OUT=$S/readings/pi-dist.jsonl MINE=http://127.0.0.1:4243 CTRL=http://127.0.0.1:4251 npx playwright test -c .place8/pw.config.ts .place8/p8-pi.spec.ts > $S/logs/pi-dist.log 2>&1; echo "pi-dist exit=$?" >> $L; grep P6PI $S/logs/pi-dist.log >> $L
echo "DONE $(date +%T)" >> $L
