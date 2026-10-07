#!/bin/bash
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/tape8
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-27/web/frontend
SPECS="a11y affordances board-covisibility font-census permalink futoshiki share-truth multiplayer session-substrate sudoku-interaction spoken-controls zone-grammar mobile-affordances visual-regression viewport-law"
ARGS=$(for s in $SPECS; do printf '%s.spec.ts ' $s; done)
cd $W
for side in tree:4230 control:4252; do n=${side%%:*}; p=${side##*:}
  TAPE8_BASE=http://127.0.0.1:$p/ TAPE8_TAG=blast-$n TAPE8_E2E=$S/arch-f8/web/frontend/e2e npx playwright test -c .ctrl-tape8/pw.config.ts $ARGS > $S/logs/blast-$n.txt 2>&1; echo "EXIT $?" >> $S/logs/blast-$n.txt
done
