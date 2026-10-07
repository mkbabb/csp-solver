#!/bin/bash
# mkplant.sh <name> <relfile> <old> <new>: copy of arch with one asserted replacement
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/verbcrit8
T=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-59
N=$1; P=$S/plant-$N
mkdir -p $P/web
rsync -a --exclude node_modules $S/arch/web/frontend/ $P/web/frontend/
[ -e $P/web/frontend/node_modules ] || ln -s $T/web/frontend/node_modules $P/web/frontend/node_modules
[ -e $P/csp-solver ] || ln -s $S/arch/csp-solver $P/csp-solver
python3 - "$P/web/frontend/$2" "$3" "$4" <<'PY'
import sys
f,old,new=sys.argv[1:4]
s=open(f).read()
n=s.count(old)
if n!=1: print("ANCHOR-FAIL count",n); sys.exit(2)
open(f,'w').write(s.replace(old,new)); print("PLANTED",f)
PY
