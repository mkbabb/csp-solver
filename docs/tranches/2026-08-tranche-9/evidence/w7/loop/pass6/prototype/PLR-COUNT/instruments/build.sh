#!/bin/bash
# PLR-COUNT pass 6: build the tree's dist with every scratch file OUTSIDE the tree (the lane dir parked), then restore it.
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-52/web/frontend; R=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrcount6-rig
mv $W/.plr-count6 $R/parked-plr-count6
cd $W && npx vite build --config $R/vite.build.mts > $R/logs/build.log 2>&1; echo "build exit $?"
mv $R/parked-plr-count6 $W/.plr-count6
ls $R/dist/assets | grep -E '^index-.*\.js$'; find $R/dist -type f | wc -l
echo BUILD-DONE
