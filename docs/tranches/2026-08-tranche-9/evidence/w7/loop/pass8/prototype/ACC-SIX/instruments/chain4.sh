#!/bin/bash
# chain 4: chain 3's plant and arm rows RE-RUN — chain 3 served the TREE throughout them (a stale 'none' listener held
# 4237 and every plant preview failed strictPort); every serve now asserts the served identity is its dist's
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/six8; W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-45/web/frontend
ld(){ uptime | sed 's/.*averages: //' | cut -d' ' -f1; }
for p in overyield late150 yieldoff; do bash $S/cfg/serve-any.sh $p $S/dist-$p || continue; bash $S/cfg/spec.sh yieldg-$p count-yield.spec.ts; done
bash $S/cfg/serve-any.sh graphite $S/dist-graphite && bash $S/cfg/spec.sh washg-graphite wash-step.spec.ts
bash $S/cfg/serve-any.sh gold $S/dist-gold && { cd $W; for eng in chromium webkit; do l=$(ld); node .acc6p8/count-aa.mjs --url http://127.0.0.1:4237 --engine $eng --label gold > $S/logs/aa2-gold-$eng.log 2>&1; echo "aa2-gold $eng exit $? · load $l"; done; }
for a in gold violet; do
  bash $S/cfg/serve-any.sh u8$a $S/dist-u8-$a || continue
  cd $W
  for eng in chromium webkit; do l=$(ld); node .acc6p8/arm-read.mjs --url http://127.0.0.1:4237 --arm $a --engine $eng --crops $S/crops2 > $S/logs/arm2-$a-$eng.log 2>&1; echo "arm2 $a $eng exit $? · load $l · served $(curl -s http://127.0.0.1:4237/ | grep -o 'index-[A-Za-z0-9_-]*\.js' | head -1)"; done
  [ $a = gold ] && for eng in chromium webkit; do node .acc6p8/filter-count.mjs --urls union=http://127.0.0.1:4237 --engine $eng > $S/logs/filters2-union-$eng.log 2>&1; echo "filters2 union $eng exit $?"; done
done
bash $S/cfg/stop-port.sh
echo CHAIN4DONE $(date +%T)
