#!/bin/bash
# run-f.sh : lint:bands on the union copies with GIT_DIR pointed READ-ONLY at the main repo's objects (B6 reads 74a2b5d9), then vitest on the union
P=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/ledger8/p8
M=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion; O=$P/q/run-f.txt; echo "start $(date +%T) load $(uptime | sed 's/.*averages: //')" > $O
for c in L8 u8; do (cd $P/$c/web/frontend && GIT_DIR=$M/.git npm run -s lint:bands > $P/q/bands-git-$c.log 2>&1); echo "$c lint:bands (GIT_DIR) exit=$?" >> $O; done
bash $P/bin/vitest.sh L8 src/pencil src/games/shared
echo "DONE $(date +%T)" >> $O
