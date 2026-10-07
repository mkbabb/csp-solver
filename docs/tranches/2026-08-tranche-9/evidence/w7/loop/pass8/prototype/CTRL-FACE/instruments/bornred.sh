#!/bin/bash
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/face8
T=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-33/web/frontend
cd $S/bornred-fe
restore() { for f in src/pencil/chrome/OptionSelector/OptionSelector.vue src/main.ts src/pencil/chrome/HandwrittenLogo/HandwrittenLogo.vue; do cp -p $T/$f $f; done; }
cp -p $T/scripts/check-font-coverage.mjs scripts/check-font-coverage.mjs
cp -p $T/scripts/shape-census.mjs scripts/shape-census.mjs
for n in "CONTROL literal (must red)" "mint-face-token" "shadow-face-token-scoped" "shadow-font-token-root" "script-style-string" "ts-style-string" "cssText" "setAttribute-style" "style.font shorthand" "ts h() style object" "svg font-family attr" "tailwind font-(--var)" "tailwind :class object" "tailwind :class string" "style template literal" "font-family var fallback-only (undeclared face)"; do
  restore
  python3 $S/plants.py "$n" || { echo "PLANTFAIL $n"; continue; }
  node scripts/check-font-coverage.p7.mjs > $S/p7.log 2>&1; e7=$?
  node scripts/check-font-coverage.mjs > $S/p8.log 2>&1; e8=$?
  echo "p7=$e7 p8=$e8 | $n | $(grep -m1 -o 'face law (check 7): [^—]*' $S/p8.log | head -c 150)"
done
restore
node scripts/check-font-coverage.p7.mjs > /dev/null 2>&1; a=$?
node scripts/check-font-coverage.mjs > /dev/null 2>&1; echo "restored clean p7=$a p8=$?"
