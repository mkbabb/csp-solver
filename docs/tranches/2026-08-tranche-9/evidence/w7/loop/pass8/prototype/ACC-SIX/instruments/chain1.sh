#!/bin/bash
# chain 1: the clean tree dist, then the arms and plants, ONE server on 4237 at a time; control 4250 stays up
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/six8; W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-45/web/frontend
ld(){ uptime | sed 's/.*averages: //' | cut -d' ' -f1; }
bash $S/cfg/serve.sh none
bash $S/cfg/spec.sh yield-tree2 count-yield.spec.ts
bash $S/cfg/spec.sh wash-tree wash-step.spec.ts
cd $W
for eng in chromium webkit; do
  l=$(ld); BASE=http://127.0.0.1:4250 PWOUT=$S/pw-wash-control-$eng npx playwright test -c .acc6p8/pw.config.ts e2e/wash-step.spec.ts --project=$eng > $S/logs/wash-control-$eng.log 2>&1
  echo "wash-control $eng exit $? · load $l"
done
bash $S/cfg/spec.sh tally-tree tally-flash.spec.ts
for eng in chromium webkit; do
  l=$(ld); node .acc6p8/count-aa.mjs --url http://127.0.0.1:4237 --engine $eng --label violet > $S/logs/aa-violet-$eng.log 2>&1
  echo "aa-violet $eng exit $? · load $l"
done
bash $S/cfg/g10.sh tree
bash $S/cfg/stop.sh none; sleep 2
bash $S/cfg/serve.sh slow49
RUNS="125a" bash $S/cfg/g10.sh slow49
bash $S/cfg/stop.sh slow49; sleep 2
bash $S/cfg/serve.sh graphite
bash $S/cfg/spec.sh wash-graphite wash-step.spec.ts
bash $S/cfg/stop.sh graphite; sleep 2
bash $S/cfg/serve.sh gold
cd $W
for eng in chromium webkit; do
  l=$(ld); node .acc6p8/count-aa.mjs --url http://127.0.0.1:4237 --engine $eng --label gold > $S/logs/aa-gold-$eng.log 2>&1
  echo "aa-gold $eng exit $? · load $l"
done
bash $S/cfg/stop.sh gold; sleep 2
bash $S/cfg/serve.sh none
echo CHAIN1DONE $(date +%T)
