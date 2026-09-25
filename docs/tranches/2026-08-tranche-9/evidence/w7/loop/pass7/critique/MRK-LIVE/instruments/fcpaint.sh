#!/bin/bash
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/mrklivecrit7
P=$S/copy/web/frontend; W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-35/web/frontend
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend
echo "=== clean copy (:4235) load $(sysctl -n vm.loadavg)"; (cd $P && shasum src/assets/index.css | cut -c1-8)
node $S/fc-paint.mjs http://127.0.0.1:4235; echo "EXIT $?"
python3 $S/plants.py $P FCCLIP2; sleep 5
echo "=== FCCLIP2 copy (:4235)"; (cd $P && shasum src/assets/index.css | cut -c1-8)
node $S/fc-paint.mjs http://127.0.0.1:4235; echo "EXIT $?"
cp $W/src/assets/index.css $P/src/assets/index.css; echo "restored $(cd $P && shasum src/assets/index.css | cut -c1-8) (work tree $(cd $W && shasum src/assets/index.css | cut -c1-8))"
echo ALLDONE
