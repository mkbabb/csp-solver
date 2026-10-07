#!/bin/bash
# chain 3: the FINAL spec files (PRM through emulateMedia), the strobe with the note brought into view, the union arms
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/six8; W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-45/web/frontend
ld(){ uptime | sed 's/.*averages: //' | cut -d' ' -f1; }
bash $S/cfg/serve.sh none; sleep 2
bash $S/cfg/spec.sh yield-final count-yield.spec.ts
bash $S/cfg/spec.sh wash-final wash-step.spec.ts
cd $W
for cell in 812x375 393x699; do l=$(ld); CELL=$cell N=10 node .acc6p8/strobe.mjs --url http://127.0.0.1:4237 --out $S/logs/strobe2-$cell.json > $S/logs/strobe2-$cell.log 2>&1; echo "strobe2 $cell exit $? · load $l"; done
for eng in chromium webkit; do l=$(ld); node .acc6p8/filter-count.mjs --urls tree=http://127.0.0.1:4237,control=http://127.0.0.1:4250 --engine $eng > $S/logs/filters-tree-$eng.log 2>&1; echo "filters tree+control $eng exit $? · load $l"; done
bash $S/cfg/stop.sh none; sleep 3
for p in overyield late150 yieldoff; do bash $S/cfg/serve.sh $p; bash $S/cfg/spec.sh yieldf-$p count-yield.spec.ts; bash $S/cfg/stop.sh $p; sleep 3; done
bash $S/cfg/serve.sh graphite; bash $S/cfg/spec.sh washf-graphite wash-step.spec.ts; bash $S/cfg/stop.sh graphite; sleep 3
for a in gold violet; do
  bash $S/cfg/serve-dist.sh u8$a $S/dist-u8-$a
  cd $W
  for eng in chromium webkit; do l=$(ld); node .acc6p8/arm-read.mjs --url http://127.0.0.1:4237 --arm $a --engine $eng --crops $S/crops > $S/logs/arm-$a-$eng.log 2>&1; echo "arm $a $eng exit $? · load $l"; done
  [ $a = gold ] && for eng in chromium webkit; do node .acc6p8/filter-count.mjs --urls union=http://127.0.0.1:4237 --engine $eng > $S/logs/filters-union-$eng.log 2>&1; echo "filters union $eng exit $?"; done
  bash $S/cfg/stop.sh u8$a; sleep 3
done
bash $S/cfg/serve.sh none
echo CHAIN3DONE $(date +%T)
