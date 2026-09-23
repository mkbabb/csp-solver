#!/bin/bash
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-p4-PLR-SELF/web/frontend; PM=src/pencil/chrome/PlayerMark/PlayerMark.vue
before=$(shasum $PM | cut -c1-12); cp $PM /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrself6/PlayerMark.hold.vue
OUTDIR=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrself6/frames MODE=seam ARM=b TM=p6-frames npx playwright test -c .plr-self/pw.scratch.mts --retries=0 > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrself6/logs/seam-b.log 2>&1; echo "b exit $?"
sed -i '' 's/^const TAP_IS_A_LOOK = true;/const TAP_IS_A_LOOK = false;/' $PM; grep -c '^const TAP_IS_A_LOOK = false;' $PM
sleep 3
OUTDIR=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrself6/frames MODE=seam ARM=a TM=p6-frames npx playwright test -c .plr-self/pw.scratch.mts --retries=0 > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrself6/logs/seam-a.log 2>&1; echo "a exit $?"
cp /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrself6/PlayerMark.hold.vue $PM; after=$(shasum $PM | cut -c1-12); echo "PlayerMark sha $before -> $after"
echo SEAM-DONE
