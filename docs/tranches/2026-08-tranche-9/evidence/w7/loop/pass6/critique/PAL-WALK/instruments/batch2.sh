#!/bin/bash
# critic batch 2: faint-TEXT plants (text-fill at 65/80/15 % of the ring, colour unchanged), negative after restore, same batch
out=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw6/logs/batch2.txt; : > $out
f=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw6/rep/web/frontend/src/games/shared/GameBoard.vue; h0=$(shasum $f | cut -c1-40); echo "GameBoard sha $h0" >> $out
plant() { python3 - "$1" "$f" <<'PY'
import sys
k,p=sys.argv[1],sys.argv[2]; s=open(p).read()
rule='.attribution-tape :deep(.washi-label) {\n  opacity: 1;\n'
assert s.count(rule)==1
pct={'T65':65,'T80':80,'T15':15}[k]
s=s.replace(rule, rule+f'  -webkit-text-fill-color: color-mix(in srgb, currentColor {pct}%, transparent);\n')
open(p,'w').write(s)
PY
}
for k in T65 T80 T15; do
  plant $k; /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw6/restart.sh
  engines="chromium webkit"; [ $k = T15 ] && engines=chromium
  for e in $engines; do /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw6/run.sh p$k $e 3 http://127.0.0.1:4236 '§C'; echo "($k) §C $e dpr3 $(tail -1 /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw6/logs/p$k-$e-dpr3.log)" >> $out; done
  cp /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw6/GameBoard.keep $f; echo "($k) restored $([ $h0 = $(shasum $f | cut -c1-40) ] && echo sha1-equal || echo MISMATCH)" >> $out
done
/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw6/restart.sh
/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw6/run.sh neg2-wk webkit 3 http://127.0.0.1:4236 '§C'; echo "(neg) §C webkit dpr3 $(tail -1 /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw6/logs/neg2-wk-webkit-dpr3.log)" >> $out
/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw6/run.sh neg2-cr chromium 3 http://127.0.0.1:4236 '§C'; echo "(neg) §C chromium dpr3 $(tail -1 /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw6/logs/neg2-cr-chromium-dpr3.log)" >> $out
echo BATCH2_DONE >> $out
