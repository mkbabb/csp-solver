#!/bin/bash
cd /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw6/rep4/web/frontend || exit 1
out=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw6/logs/units.txt; : > $out
u() { npx vitest run --config vitest.critpw6.mts src/games/shared/BoardHost.authors.test.ts src/games/shared/useSession.test.ts > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw6/logs/unit-$1.log 2>&1; e=$?; echo "$1 exit $e · $(grep -E 'Tests +[0-9]' /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw6/logs/unit-$1.log | tr -s ' ')" >> $out; }
u clean
python3 - <<'PY'
import os
F='/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw6/rep4/web/frontend'
BH=F+'/src/games/shared/BoardHost.vue'; PI=F+'/src/games/shared/playerIdentity.ts'
open('/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw6/BH.keep','w').write(open(BH).read()); open('/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw6/PI.keep','w').write(open(PI).read())
PY
plant() { python3 - "$1" <<'PY'
import sys
k=sys.argv[1]; F='/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw6/rep4/web/frontend'
BH=F+'/src/games/shared/BoardHost.vue'; PI=F+'/src/games/shared/playerIdentity.ts'
a='const ink = row?.ink["--color-peer-cursor-ink"];'
if k=='K6': s=open(BH).read(); assert s.count(a)==1; open(BH,'w').write(s.replace(a,'const ink = row && "var(--color-foreground)";'))
if k=='K6b': s=open(BH).read(); assert s.count(a)==1; open(BH,'w').write(s.replace(a,'const ink = row && `color-mix(in oklch, ${row.ink["--color-peer-cursor-ink"]} 55%, black)`;'))
r='  return { "--color-user-ink": pair[0], "--color-peer-cursor-ink": pair[1] };'
if k=='K13': s=open(PI).read(); assert s.count(r)==1; open(PI,'w').write(s.replace(r,'  pair = [pair[0], `color-mix(in oklch, ${pair[1]} 55%, black)`];\n'+r))
PY
}
for k in K6 K6b K13; do plant $k; u $k; cp /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw6/BH.keep /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw6/rep4/web/frontend/src/games/shared/BoardHost.vue; cp /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw6/PI.keep /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw6/rep4/web/frontend/src/games/shared/playerIdentity.ts; done
u clean-after
echo UNITS_DONE >> $out
