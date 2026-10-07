#!/bin/bash
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit-ladder8
d=$1
cd $S/$d/web/frontend && npx vite build --config $S/vite-$d.mts --outDir $S/dist-$d > $S/build-$d.log 2>&1
echo "EXIT $?" >> $S/build-$d.log
