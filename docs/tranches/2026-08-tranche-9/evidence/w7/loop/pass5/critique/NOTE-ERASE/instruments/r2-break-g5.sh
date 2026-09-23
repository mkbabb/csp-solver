#!/bin/zsh
# NOTE-ERASE pass-5 critic (re-audit) break-tests: G5's act (mint), G5's value (retune, swap), G7's publisher (silenced). Restore by sha1.
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-47/web/frontend
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/erase-crit5
cd $W || exit 9
T=src/pencil/chrome/marginNote.motion.test.ts; CFG=src/pencil/config/pencilConfig.ts
S0=$(shasum $CFG|cut -c1-40); cp $CFG $S/bak.pencilConfig.ts
run() { npx vitest run $T > $S/v.out 2>&1; e=$?; echo "  vitest exit=$e :: $(grep -E 'Tests +[0-9]' $S/v.out | tr -s ' ')"; grep -E '^ +(×|FAIL)| × ' $S/v.out | head -4 | sed 's/^/    /'; }
restore() { cp $S/bak.pencilConfig.ts $CFG; [ "$(shasum $CFG|cut -c1-40)" = "$S0" ] && echo "  restored cfg sha1 ok ${S0:0:8}" || echo "  RESTORE FAILED"; }
echo "C0 as built (cfg sha1 ${S0:0:8})"; run
echo "C1 MINT erase: 125 into MOTION.rungs (the act the charter named)"; sed -i '' 's/^    rise: 520,/    rise: 520,\n    erase: 125,/' $CFG; grep -c 'erase: 125' $CFG; run; restore
echo "C2 RETUNE whisper 150 -> 125"; sed -i '' 's/^    whisper: 150,/    whisper: 125,/' $CFG; grep -c 'whisper: 125' $CFG; run; restore
echo "C3 SWAP whisper<->dusk values (150<->350): the verb now spends the dusk clock"; sed -i '' 's/^    whisper: 150,/    whisper: 350,/; s/^    dusk: 350,/    dusk: 150,/' $CFG; grep -nE '^    (whisper|dusk): ' $CFG; run; restore
echo "C4 RETUNE step 440 -> 1 (a consumer-less rung, nobody reads it)"; sed -i '' 's/^    step: 440,/    step: 1,/' $CFG; grep -c 'step: 1,' $CFG; run; restore
echo DONE
