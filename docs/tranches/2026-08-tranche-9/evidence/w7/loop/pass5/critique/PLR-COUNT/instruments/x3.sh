#!/bin/bash
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit-count
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-52/web/frontend
F=$W/src/pencil/chrome/PlayerMark/PlayerMark.vue
cp $F $S/bak-x3; b=$(shasum $F|cut -c1-12); python3 $S/x3_armc.py $F; a=$(shasum $F|cut -c1-12); echo "### X3 SIX_ARM=remainder ($b -> $a)"; sleep 3
cd $W && CRIT_DIR=. CRIT_PWOUT=$S/pw-out-x3a npx playwright test -c .plrc-critic/pw.config.ts crit3.spec.ts 2>&1 | grep -E "ARMC|passed|failed" | cut -c1-900
cd $W && CRIT_PWOUT=$S/pw-out-x3b npx playwright test -c .plrc-critic/pw.config.ts e2e/player-tally.spec.ts -g "rung below would not|the name counts what" 2>&1 | grep -E "^G16|✘|✓|passed|failed|Error:" | cut -c1-300
cp $S/bak-x3 $F; r=$(shasum $F|cut -c1-12); [ "$r" = "$b" ] && echo "restored=OK $r" || echo "restored=MISMATCH"
