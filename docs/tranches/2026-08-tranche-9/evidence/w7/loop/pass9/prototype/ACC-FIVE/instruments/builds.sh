#!/bin/zsh
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/ACC-FIVE; O=$S/logs/builds.log; : > $O
for b in b-tree b-p8; do cd $S/$b/web/frontend; npx vite build --config .b.vite.mts --outDir $S/dist-$b --emptyOutDir > $S/logs/build-$b.raw 2>&1; echo $? > $S/logs/build-$b.exit; echo "build $b exit $(cat $S/logs/build-$b.exit) $(date +%T)" >> $O; done
echo DONE >> $O
