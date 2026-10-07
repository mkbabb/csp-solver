#!/bin/bash
# snap.sh <name> — the tree's current bytes as a clean out-of-tree archive (temporary index; no rm)
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-27
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/tape8
N=$1
cd $W
export GIT_INDEX_FILE=$S/idx-$N
git read-tree HEAD
git add -A -- . ':!web/frontend/.ctrl-tape8'
T=$(git write-tree)
echo "tree $T"
mkdir -p $S/arch-$N
git archive $T | tar -x -C $S/arch-$N
ln -s /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules $S/arch-$N/web/frontend/node_modules
echo "archived $S/arch-$N"
