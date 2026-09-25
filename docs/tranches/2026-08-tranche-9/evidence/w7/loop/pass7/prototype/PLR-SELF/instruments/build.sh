#!/bin/bash
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-p4-PLR-SELF/web/frontend; S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrself7b
mv $W/.plr-self $S/hold-plr-self
cd $W
npx vite build --config $S/vite.build.mts > $S/logs/build.log 2>&1; echo "build exit $?"
mv $S/hold-plr-self $W/.plr-self
ls $S/dist/assets | grep -E '^index-.*\.(js|css)$'; find $S/dist -type f | wc -l; du -sk $S/dist
echo BUILD-DONE
