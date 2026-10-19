#!/bin/bash
# snap.sh <name> : copy the §13 tree's product paths into $S/<name> (a scratch repo, no commit), fetch 74a2b5d9 at depth 1
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/MOT-LADDER
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-59
N=$S/$1
[ -e $N ] && mv $N $S/trash/$1.$(date +%s)
mkdir -p $N/web
rsync -a --exclude node_modules --exclude dist --exclude 'dist-*' --exclude '.vite*' --exclude test-results --exclude playwright-report $W/web/frontend $N/web/
rsync -a $W/web/relay $N/web/ --exclude node_modules
rsync -a $W/scripts $N/
rsync -a $W/.github $N/
mkdir -p $N/csp-solver && rsync -a $W/csp-solver/data $N/csp-solver/
ln -s /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules $N/web/frontend/node_modules 2>/dev/null
cd $N && git init -q && git fetch -q --depth=1 file://$W 74a2b5d9317e7795cee6bf63e861bd44f54ae80e && git rev-parse --verify --quiet 74a2b5d9317e7795cee6bf63e861bd44f54ae80e^{commit}
echo snap-exit=$?
