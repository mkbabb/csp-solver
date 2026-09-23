#!/bin/bash
# Clean build: every scratch file except the build config leaves the tree for the build, then returns.
set -u
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-40/web/frontend; OUT=$1; P=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/accg5/probes-parked; mkdir -p $P
for f in $W/.accg5/*; do case $(basename $f) in vite.build.mts) ;; *) mv $f $P/ ;; esac; done
cd $W && npx vite build --config .accg5/vite.build.mts --outDir $OUT --emptyOutDir > $OUT.log 2>&1; rc=$?
mv $P/* $W/.accg5/
echo "build exit $rc $(ls $OUT/assets | grep -o 'index-[A-Za-z0-9_-]*\.js') files $(find $OUT -type f | wc -l)"
