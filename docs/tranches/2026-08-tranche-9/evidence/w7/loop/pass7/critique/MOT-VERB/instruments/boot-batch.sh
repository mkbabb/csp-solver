#!/bin/bash
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/verbcrit7
cd $S/inst
for arm in "tree 4236" "control 4237"; do set -- $arm
 for eng in chromium webkit; do
  uptime | sed "s/^/$1 /"
  node boot-probe-crit.mjs http://127.0.0.1:$2/ $eng 3 light no-preference 2>&1 | sed "s/^/$1 /" | cut -c1-700
  RAF30=1 node boot-probe-crit.mjs http://127.0.0.1:$2/ $eng 3 light no-preference 2>&1 | sed "s/^/$1 /" | cut -c1-700
 done
done
echo ALLDONE
