#!/bin/bash
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit-count
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-52/web/frontend
F=$W/src/pencil/chrome/PlayerMark/PlayerLobby.vue
cp $F $S/bak-x1w; b=$(shasum $F|cut -c1-12); python3 $S/x1_mask.py $F; sleep 3
cd $W && CRIT_DIR=. CRIT_PWOUT=$S/pw-out-x1w npx playwright test -c .plrc-critic/pw.config.ts crit4.spec.ts 2>&1 | grep -E "X1W|passed|failed"
cp $S/bak-x1w $F; r=$(shasum $F|cut -c1-12); [ "$r" = "$b" ] && echo "restored=OK $r" || echo "restored=MISMATCH"
