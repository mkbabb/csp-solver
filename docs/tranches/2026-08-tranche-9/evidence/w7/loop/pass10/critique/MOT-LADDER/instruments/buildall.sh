#!/bin/zsh
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/crit-MOT-LADDER
G="$HOME/.claude/guard/guarded --light --timeout 10 --"; ${=G} $S/bld.sh $S/bank bt; ${=G} $S/bld.sh $S/l9src l9
for p in X1 X5 X8 X32 X23; do ${=G} $S/bld.sh $S/bank p-$p $p; done
for a in bt l9 p-X1 p-X5 p-X8 p-X32 p-X23; do echo "$a: $(grep -E 'build exit|asset' $S/logs/build-$a.log | tr '\n' ' ')"; done > $S/logs/buildall.txt
echo BUILDALL-DONE >> $S/logs/buildall.txt
