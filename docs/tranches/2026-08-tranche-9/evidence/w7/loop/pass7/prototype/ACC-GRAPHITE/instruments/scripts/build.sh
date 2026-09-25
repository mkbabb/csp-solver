#!/bin/bash
# Clean build: every scratch file but the build config leaves the tree for the build, then returns.
OUT=$1; S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/accg7; P=$S/parked; mkdir -p $P
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-40/web/frontend
for f in .accg7/*; do case $(basename $f) in vite.build.mts|build.sh) ;; *) mv $f $P/ ;; esac; done
npx vite build --config .accg7/vite.build.mts --outDir $OUT --emptyOutDir > $OUT.log 2>&1; rc=$?
mv $P/* .accg7/ 2>/dev/null
echo "build exit $rc $(ls $OUT/assets 2>/dev/null | grep -o 'index-[A-Za-z0-9_-]*\.js') files $(find $OUT -type f | wc -l | tr -d ' ')"
