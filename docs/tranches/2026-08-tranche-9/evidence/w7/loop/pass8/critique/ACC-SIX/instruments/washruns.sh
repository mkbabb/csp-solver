#!/bin/bash
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/acc6-crit8
cd $S/base/web/frontend
for P in w7 graphite; do
  bash $S/cfg/serve.sh $P || continue
  for e in chromium webkit; do echo "load $(uptime | sed 's/.*averages: //' | cut -d' ' -f1)"; node $S/cfg/wash-contrast.mjs $e $P http://127.0.0.1:4237 2>&1 | grep WASHC; done
  bash $S/cfg/spec.sh wash-$P wash-step.spec.ts
done
bash $S/cfg/serve.sh none
bash $S/cfg/spec.sh wash-tree wash-step.spec.ts
echo WASH-DONE
