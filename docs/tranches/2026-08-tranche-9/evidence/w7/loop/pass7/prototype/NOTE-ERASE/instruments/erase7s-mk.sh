#!/bin/bash
# usage: erase7s-mk.sh <dest>  — git archive 74a2b5d9, overlay the work tree's product files, link node_modules
R=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion; W=$R/.claude/worktrees/wf_f72f3b5a-83a-47
D=$1; mkdir -p $D; git -C $R archive 74a2b5d9 | tar -x -C $D
N=0; for f in $(cd $W && { git diff --name-only 74a2b5d9; git ls-files --others --exclude-standard; } | grep -v '^web/frontend/\.erase7/' | sort -u); do mkdir -p $(dirname $D/$f); cp $W/$f $D/$f; N=$((N+1)); done
ln -s $R/web/frontend/node_modules $D/web/frontend/node_modules
mkdir -p $D/web/frontend/.erase7
echo "made $D overlay=$N"
