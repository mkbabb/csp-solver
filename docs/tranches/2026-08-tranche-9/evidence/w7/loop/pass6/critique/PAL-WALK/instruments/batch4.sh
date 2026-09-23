#!/bin/bash
# critic batch 3: the faint-text plant re-cut for WebKit (var() in place of currentColor), both engines; negative after restore
out=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw6/logs/batch4.txt; : > $out
f=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw6/rep/web/frontend/src/games/shared/GameBoard.vue; h0=$(shasum $f | cut -c1-40); echo "GameBoard sha $h0" >> $out
python3 - "$f" <<'PY'
import sys
p=sys.argv[1]; s=open(p).read()
rule='.attribution-tape :deep(.washi-label) {\n  opacity: 1;\n'
assert s.count(rule)==1
s=s.replace(rule, rule+'  -webkit-text-fill-color: rgb(from currentColor r g b / 0.65);\n')
open(p,'w').write(s)
PY
/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw6/restart.sh
for e in webkit chromium; do /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw6/run.sh pR65 $e 3 http://127.0.0.1:4236 '§C'; echo "(R65) §C $e dpr3 $(tail -1 /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw6/logs/pR65-$e-dpr3.log)" >> $out; done
cp /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw6/GameBoard.keep $f; echo "(R65) restored $([ $h0 = $(shasum $f | cut -c1-40) ] && echo sha1-equal || echo MISMATCH)" >> $out
/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw6/restart.sh
/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw6/run.sh neg4-wk webkit 3 http://127.0.0.1:4236 '§C'; echo "(neg) §C webkit dpr3 $(tail -1 /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw6/logs/neg4-wk-webkit-dpr3.log)" >> $out
echo BATCH3_DONE >> $out
