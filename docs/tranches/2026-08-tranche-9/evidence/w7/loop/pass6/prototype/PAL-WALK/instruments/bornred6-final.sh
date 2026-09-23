#!/bin/bash
# PAL-WALK pass 6 · §C's born-RED and its negative control in ONE batch (LAWS §Gates, charter row 1).
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_308fa864-c94-1/web/frontend || exit 1
out=${OUTF:-/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/palwalk6/logs/bornred6.txt}; : > $out
f=src/games/shared/GameBoard.vue; cp $f /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/palwalk6/GameBoard.keep; h0=$(shasum $f | cut -c1-40)
plant() { python3 - "$1" <<'PY'
import sys
p='src/games/shared/GameBoard.vue'; s=open(p).read(); k=sys.argv[1]
paper='''  background:
    linear-gradient(var(--sheet-washi-neutral), var(--sheet-washi-neutral)),
    var(--color-card);
'''
rule='.attribution-tape :deep(.washi-label) {\n'
assert s.count(paper)==1 and s.count(rule)==1
if k=='a': s=s.replace(paper,'')
if k=='b': s=s.replace(rule, rule+'  -webkit-text-fill-color: transparent;\n')
if k=='c': assert s.count(rule+'  opacity: 1;\n')==1; s=s.replace(rule+'  opacity: 1;\n', rule+'  opacity: 0;\n')
open(p,'w').write(s)
PY
}
for k in a b c; do
  plant $k; /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/palwalk6/restart.sh
  for e in chromium webkit; do /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/palwalk6/run.sh fin4$k $e 3 '§C'; echo "($k) §C $e exit $(tail -1 /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/palwalk6/logs/fin4$k-$e-dpr3.log)" >> $out; done
  cp /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/palwalk6/GameBoard.keep $f; echo "($k) restored $([ $h0 = $(shasum $f | cut -c1-40) ] && echo sha1-equal || echo MISMATCH)" >> $out
done
/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/palwalk6/restart.sh
for n in 1 2 3 4 5 6 7 8 9 10; do /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/palwalk6/run.sh ${N:-neg6}-$n webkit 3; echo "(neg) whole file webkit dpr3 run $n $(tail -1 /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/palwalk6/logs/${N:-neg6}-$n-webkit-dpr3.log)" >> $out; done
for n in 1 2 3; do /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/palwalk6/run.sh ${N:-neg6}-$n chromium 3; echo "(neg) whole file chromium dpr3 run $n $(tail -1 /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/palwalk6/logs/${N:-neg6}-$n-chromium-dpr3.log)" >> $out; done
for d in 1 2; do for e in chromium webkit; do /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/palwalk6/run.sh ${N:-neg6}-d$d $e $d; echo "(neg) whole file $e dpr$d $(tail -1 /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/palwalk6/logs/${N:-neg6}-d$d-$e-dpr$d.log)" >> $out; done; done
echo BORNRED6_DONE >> $out
