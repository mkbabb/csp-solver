#!/bin/zsh
# usage: snap.sh <tree-sha> <dirname>  -> $S/<dirname> = archive of tree, own .git with alternates to main's objects
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/MOT-LADDER
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-59
MAINOBJ=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.git/objects
T=$1; D=$S/$2
if [ -e $D ]; then mv $D $S/trash/$2.$(date +%s); fi
mkdir -p $D
(cd $W && git archive $T) | tar -x -C $D
cd $D && git init -q && echo $MAINOBJ > .git/objects/info/alternates
echo "gitdir $(git -C $D rev-parse --absolute-git-dir) base $(git -C $D rev-parse --verify --quiet 74a2b5d9317e7795cee6bf63e861bd44f54ae80e^{commit})"
ln -s /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules $D/web/frontend/node_modules
echo "snap $T -> $D files $(find $D/web -type f | wc -l)"
