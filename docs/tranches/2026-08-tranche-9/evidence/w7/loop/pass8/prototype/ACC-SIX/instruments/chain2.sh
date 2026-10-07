#!/bin/bash
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/six8; W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-45/web/frontend
ld(){ uptime | sed 's/.*averages: //' | cut -d' ' -f1; }
cd $W
for cell in 812x375 393x699; do
  l=$(ld); CELL=$cell N=10 node .acc6p8/strobe.mjs --url http://127.0.0.1:4237 --out $S/logs/strobe-$cell.json > $S/logs/strobe-$cell.log 2>&1
  echo "strobe $cell exit $? · load $l"
done
bash $S/cfg/stop.sh none; sleep 3
bash $S/cfg/serve.sh gold; sleep 2
cd $W; l=$(ld); node .acc6p8/count-aa.mjs --url http://127.0.0.1:4237 --engine chromium --label gold > $S/logs/aa-gold-chromium.log 2>&1; echo "aa-gold chromium exit $? · load $l"
bash $S/cfg/stop.sh gold; sleep 3
bash $S/cfg/serve-dev.sh
RUNS=panel bash $S/cfg/g10.sh dev
bash $S/cfg/stop.sh dev; sleep 3
bash $S/cfg/serve.sh none
echo CHAIN2DONE $(date +%T)
