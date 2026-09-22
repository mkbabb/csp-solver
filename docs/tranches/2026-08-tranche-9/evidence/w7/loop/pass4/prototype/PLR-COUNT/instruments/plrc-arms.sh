#!/bin/bash
# PLR-COUNT pass-4: drive the two owner forks by flipping ONE const at a time, restoring after.
F=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-52/web/frontend
SP=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad
PM=$F/src/pencil/chrome/PlayerMark/PlayerMark.vue; US=$F/src/games/shared/useSession.ts
cp $PM $SP/plrc-PM.shipped; cp $US $SP/plrc-US.shipped
cd $F
run() { echo "### ARM=$1 grep=$2"; PLRC_ARM=$1 PLRC_DIR=./arms PLRC_OUT=$SP/plrc-readings PLRC_CROPS=$SP/plrc-crops npx playwright test --config .plr-count/pw.plr-count.config.ts -g "$2" 2>&1 | grep -E '✓|✘|passed|failed|Error'; echo "EXIT[$1]=${PIPESTATUS[0]}"; }
run A-shipped "solo then two"
sed -i '' 's/const SOLO_ARM: "keep" | "gate-on-a-room" = "keep";/const SOLO_ARM: "keep" | "gate-on-a-room" = "gate-on-a-room";/' $PM
grep -c '= "gate-on-a-room";' $PM; sleep 3
run B-gate "solo then two"
cp $SP/plrc-PM.shipped $PM
grep -c 'SELF_TAKES_ROOM_INK = false' $US; sleep 3
echo skip-F1
cp $SP/plrc-US.shipped $US
cmp $PM $SP/plrc-PM.shipped && cmp $US $SP/plrc-US.shipped && echo RESTORED
echo "### DONE"
