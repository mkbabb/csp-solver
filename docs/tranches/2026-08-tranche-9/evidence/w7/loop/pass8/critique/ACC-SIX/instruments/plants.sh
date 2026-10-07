#!/bin/bash
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/acc6-crit8
for P in overyield late150 late16 raf; do
  bash $S/cfg/serve.sh $P || { echo "SERVE FAIL $P"; continue; }
  bash $S/cfg/spec.sh yieldp-$P count-yield.spec.ts
done
bash $S/cfg/serve.sh none
echo PLANTS-DONE
