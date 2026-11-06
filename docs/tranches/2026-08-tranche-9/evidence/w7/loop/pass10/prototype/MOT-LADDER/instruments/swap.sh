#!/bin/zsh
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/MOT-LADDER
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-59
until grep -q DONE $S/logs/kb-new/battery.tsv; do sleep 2; done
cp $W/web/frontend/scripts/check-motion-bands.mjs $S/ksnap-new/web/frontend/scripts/check-motion-bands.mjs
cd $S/ksnap-new && GIT_INDEX_FILE=$S/idx-swap git add -A web && X=$(GIT_INDEX_FILE=$S/idx-swap git write-tree --prefix=web/)
Y=$(git -C $W rev-parse $(cat $S/tree-final.txt):web)
echo "swap: ksnap-new web $X, final web $Y" > $S/logs/swap.txt
cd $S/ksnap-new && git diff --stat $Y $X >> $S/logs/swap.txt
touch $S/logs/swap.ok
