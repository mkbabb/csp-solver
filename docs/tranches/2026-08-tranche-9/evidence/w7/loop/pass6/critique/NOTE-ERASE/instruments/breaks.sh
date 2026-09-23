#!/bin/bash
B=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/erasecrit6-brk/web/frontend
restore() { cp $B/.orig/pencilConfig.ts $B/src/pencil/config/pencilConfig.ts; cp $B/.orig/MarginNote.vue $B/src/pencil/chrome/MarginNote.vue; cp $B/.orig/index.css $B/src/assets/index.css; }
cd $B
for p in CLEAN whisper125 rise600 step1 swap deadhook noimportant durimportant del_whisper del_rise nest7 inhfalse sfc_dup_false css_var_override anim_dur_important; do
  restore
  [ "$p" != CLEAN ] && python3 /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/erasecrit6-cfg/plant.py $B $p
  npx vitest run src/pencil/chrome/marginNote.motion.test.ts > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/erasecrit6-cfg/v-$p.log 2>&1; ve=$?
  vs=$(grep -E "^ +Tests " /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/erasecrit6-cfg/v-$p.log | tr -s ' ')
  node scripts/check-theme-tokens.mjs > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/erasecrit6-cfg/t-$p.log 2>&1; te=$?
  node scripts/check-theme-tokens.mjs --self-test > /dev/null 2>&1; tse=$?
  node /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass6/instruments/check-property-block.mjs --fe $B --dist /nonexistent-erasecrit6 > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/erasecrit6-cfg/pb-$p.log 2>&1; pbe=$?
  echo "PLANT $p | vitest exit $ve ($vs) | theme-tokens bare $te self-test $tse | property-block(source) $pbe"
done
restore
shasum /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/erasecrit6-brk/web/frontend/src/pencil/config/pencilConfig.ts /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/erasecrit6-brk/web/frontend/.orig/pencilConfig.ts /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/erasecrit6-brk/web/frontend/src/pencil/chrome/MarginNote.vue /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/erasecrit6-brk/web/frontend/.orig/MarginNote.vue /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/erasecrit6-brk/web/frontend/src/assets/index.css /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/erasecrit6-brk/web/frontend/.orig/index.css
