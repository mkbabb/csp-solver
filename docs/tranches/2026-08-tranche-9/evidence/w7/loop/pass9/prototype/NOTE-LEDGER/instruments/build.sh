#!/bin/bash
# build.sh tree|union
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/NOTE-LEDGER
if [ "$1" = tree ]; then FE=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-46/web/frontend; else FE=$S/wL/web/frontend; [ "$1" = wE ] && FE=$S/wE/web/frontend; [ "$1" = t8 ] && FE=$S/t8/web/frontend; fi
cd $FE; echo "load $(uptime | sed 's/.*averages: //')"
[ -d $S/dist-$1 ] && mv $S/dist-$1 $S/trash/dist-$1.$(date +%s)
npx vite build --config $S/vite.$1.mts --outDir $S/dist-$1 --emptyOutDir > $S/logs/build-$1.txt 2>&1; echo "build $1 exit $?"
ls $S/dist-$1/assets | grep '^index-.*\.js$'; echo DONE
