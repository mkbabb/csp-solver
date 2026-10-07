#!/bin/bash
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/acc6-crit8
cd $S/base/web/frontend
for e in chromium webkit; do node $S/cfg/resize-yield.mjs $e tree http://127.0.0.1:4237 2>&1 | grep -E "RESIZE|Error"; done
bash $S/cfg/serve.sh noro || exit 1
for e in chromium webkit; do node $S/cfg/resize-yield.mjs $e noro http://127.0.0.1:4237 2>&1 | grep -E "RESIZE|Error"; done
bash $S/cfg/spec.sh yieldp-noro count-yield.spec.ts
bash $S/cfg/serve.sh none
echo RO-DONE
