#!/bin/bash
# vue-tsc on a git archive of the tree (LAWS P6 §B): 74a2b5d9 + the tree's product diff, node_modules linked.
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrself7b
WT=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-p4-PLR-SELF
N=$1; D=$S/tsc-$N; mkdir -p $D
git -C $WT archive 74a2b5d9 web/frontend | tar -x -C $D
git -C $WT diff --binary 74a2b5d9 -- web/frontend ':!web/frontend/.plr-self' ':!web/frontend/.plr-self/*' > $S/tree-$N.diff
cd $D && git init -q . && git apply --whitespace=nowarn $S/tree-$N.diff; echo "apply exit $?"
ln -s /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules $D/web/frontend/node_modules
cd $D/web/frontend
npx vue-tsc -b > $S/logs/tsc-b-$N.log 2>&1; echo "vue-tsc -b exit $?"
npx vue-tsc --noEmit -p tsconfig.e2e.json > $S/logs/tsc-e2e-$N.log 2>&1; echo "typecheck:e2e exit $?"
echo TSC-DONE
