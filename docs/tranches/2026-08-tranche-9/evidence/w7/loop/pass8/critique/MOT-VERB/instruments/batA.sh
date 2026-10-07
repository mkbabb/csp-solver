#!/bin/bash
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/verbcrit8
for e in chromium webkit; do
  $S/pw.sh tree-frame-$e http://127.0.0.1:4247 $e frame-halfstroke.spec.ts; echo "tree-frame-$e $(tail -1 $S/logs/pw-tree-frame-$e.log)"
  $S/pw.sh ctl-frame-$e http://127.0.0.1:4250 $e frame-halfstroke.spec.ts; echo "ctl-frame-$e $(tail -1 $S/logs/pw-ctl-frame-$e.log)"
  W=1 $S/pw.sh tree-boot-$e http://127.0.0.1:4247 $e boot-hand.spec.ts; echo "tree-boot-$e $(tail -1 $S/logs/pw-tree-boot-$e.log)"
done
echo BATA-DONE
