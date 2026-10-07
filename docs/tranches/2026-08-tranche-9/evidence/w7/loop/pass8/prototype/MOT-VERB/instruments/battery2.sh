#!/bin/bash
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/verb8/r2
for eng in chromium webkit; do
  REPEAT=5 bash $S/pw.sh b2-tree-fold-$eng http://127.0.0.1:4247 $eng e2e/fold-verb.spec.ts; echo "ROW tree fold x5 $eng $(tail -1 $S/logs/pw-b2-tree-fold-$eng.log)"
  bash $S/pw.sh b2-ctl-fold-$eng http://127.0.0.1:4250 $eng e2e/fold-verb.spec.ts; echo "ROW ctl fold $eng $(tail -1 $S/logs/pw-b2-ctl-fold-$eng.log)"
done
echo BATTERY2-DONE
