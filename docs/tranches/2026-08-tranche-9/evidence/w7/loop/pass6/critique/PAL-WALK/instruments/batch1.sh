#!/bin/bash
# critic batch 1: plants first (F faint ink, a translucent paper), negative after restore, same batch; control print
out=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw6/logs/batch1.txt; : > $out
f=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw6/rep/web/frontend/src/games/shared/GameBoard.vue; h0=$(shasum $f | cut -c1-40); echo "GameBoard sha $h0" >> $out
plant() { python3 - "$1" "$f" <<'PY'
import sys
k,p=sys.argv[1],sys.argv[2]; s=open(p).read()
rule='.attribution-tape :deep(.washi-label) {\n  opacity: 1;\n'
paper='''  background:
    linear-gradient(var(--sheet-washi-neutral), var(--sheet-washi-neutral)),
    var(--color-card);
'''
assert s.count(rule)==1 and s.count(paper)==1
if k=='F': s=s.replace(rule, rule.replace('opacity: 1;','opacity: 0.6;'))
if k=='F2': s=s.replace(rule, rule.replace('opacity: 1;','opacity: 0.45;'))
if k=='a': s=s.replace(paper,'')
open(p,'w').write(s)
PY
}
for k in F F2 a; do
  plant $k; /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw6/restart.sh
  for e in chromium webkit; do /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw6/run.sh p$k $e 3 http://127.0.0.1:4236 '§C'; echo "($k) §C $e dpr3 $(tail -1 /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw6/logs/p$k-$e-dpr3.log)" >> $out; done
  cp /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw6/GameBoard.keep $f; echo "($k) restored $([ $h0 = $(shasum $f | cut -c1-40) ] && echo sha1-equal || echo MISMATCH)" >> $out
done
/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw6/restart.sh
for e in chromium webkit; do /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw6/run.sh neg-d1 $e 1 http://127.0.0.1:4236; echo "(neg) whole file $e dpr1 $(tail -1 /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw6/logs/neg-d1-$e-dpr1.log)" >> $out; done
for n in 1 2 3; do /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw6/run.sh neg-wk$n webkit 3 http://127.0.0.1:4236; echo "(neg) whole file webkit dpr3 run $n $(tail -1 /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw6/logs/neg-wk$n-webkit-dpr3.log)" >> $out; done
/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw6/run.sh neg-cr1 chromium 3 http://127.0.0.1:4236; echo "(neg) whole file chromium dpr3 $(tail -1 /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw6/logs/neg-cr1-chromium-dpr3.log)" >> $out
for d in 1 3; do for e in chromium webkit; do /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw6/run.sh ctl-d$d $e $d http://127.0.0.1:4237 '§C' . 'crit-name\.spec\.ts$'; echo "(ctl print) §C $e dpr$d $(tail -1 /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw6/logs/ctl-d$d-$e-dpr$d.log)" >> $out; done; done
for e in chromium; do /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw6/run.sh tre-d2 $e 2 http://127.0.0.1:4236 '§C'; echo "(neg) §C $e dpr2 $(tail -1 /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw6/logs/tre-d2-$e-dpr2.log)" >> $out; done
echo BATCH1_DONE >> $out
