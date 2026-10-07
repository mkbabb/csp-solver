#!/bin/bash
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/six8
prev=none
for p in overyield late150 yieldoff; do
  bash $S/cfg/stop.sh $prev; sleep 2
  bash $S/cfg/serve.sh $p
  bash $S/cfg/spec.sh yield-$p count-yield.spec.ts
  prev=$p
done
bash $S/cfg/stop.sh $prev; sleep 2
bash $S/cfg/serve.sh none
echo PLANTSDONE
