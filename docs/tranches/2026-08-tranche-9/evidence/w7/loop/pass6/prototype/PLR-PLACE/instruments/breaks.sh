#!/bin/bash
# PLR-PLACE pass 6 e2e break battery: each plant alone, the named rows both engines, sha1 restore.
R=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plr-place-p6-work
WF=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-p4-PLR-PLACE/web/frontend
cd $WF
run() { # name grep
  python3 $R/plant.py $1 apply >> $R/breaks2.txt; sleep 4
  PLC_PORT=4243 npx playwright test -c .plr-place/pw.config.ts e2e/player-place.spec.ts -g "$2" --reporter=list > $R/break-$1.log 2>&1; ec=$?
  python3 $R/plant.py $1 restore >> $R/breaks2.txt; sleep 3
  echo "BREAK $1 [$2] exit=$ec :: $(grep -E '^\s+(✓|✘)' $R/break-$1.log | sed -E 's/.*(✓|✘) +[0-9]+ \[([a-z]+)\].*› ([0-9]+) ·.*/\1\2:\3/' | tr '\n' ' ')" >> $R/breaks2.txt
}
# run GHOST "13 ·"
# run E4 "(12|14) ·"
run SEAM_A "11 · your ring and the room agree: a tapped"
echo DONE >> $R/breaks2.txt
