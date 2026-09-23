#!/bin/bash
B=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/erasecrit6-brk/web/frontend
restore() { cp $B/.orig/index.css $B/src/assets/index.css; cp $B/.orig/typography.css $B/src/assets/typography.css; }
cd $B
for p in CLEAN typo_dup_false css_var_override global_anim_important; do
  restore
  [ "$p" != CLEAN ] && python3 /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/erasecrit6-cfg/plant2.py $B $p
  npx vitest run src/pencil/chrome/marginNote.motion.test.ts > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/erasecrit6-cfg/v2-$p.log 2>&1; ve=$?
  node scripts/check-theme-tokens.mjs > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/erasecrit6-cfg/t2-$p.log 2>&1; te=$?
  node scripts/check-motion-contract.mjs > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/erasecrit6-cfg/m2-$p.log 2>&1; me=$?
  node /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass6/instruments/check-property-block.mjs --fe $B > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/erasecrit6-cfg/pb2-$p.log 2>&1; pbe=$?
  FE=$B node /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass6/instruments/undefined-token-census.mjs > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/erasecrit6-cfg/u2-$p.log 2>&1; ue=$?
  echo "PLANT $p | vitest $ve | theme-tokens $te | motion-contract $me | property-block $pbe | undef-census $ue"
done
restore
shasum $B/src/assets/index.css $B/.orig/index.css $B/src/assets/typography.css $B/.orig/typography.css
