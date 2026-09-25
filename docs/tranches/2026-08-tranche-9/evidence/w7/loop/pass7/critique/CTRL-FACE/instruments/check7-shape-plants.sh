#!/bin/bash
cd /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/facecrit7-fe
restore() { for f in src/pencil/chrome/OptionSelector/OptionSelector.vue src/main.ts src/pencil/chrome/HandwrittenLogo/HandwrittenLogo.vue; do cp -p /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-33/web/frontend/$f $f; done; }
for n in "CONTROL literal (must red)" "mint-face-token" "shadow-face-token-scoped" "shadow-font-token-root" "script-style-string" "ts-style-string" "cssText" "setAttribute-style" "style.font shorthand" "ts h() style object" "svg font-family attr" "tailwind font-(--var)" "tailwind :class object" "tailwind :class string" "style template literal" "font-family var fallback-only (undeclared face)"; do
  restore
  python3 ../facecrit7-probe/plants.py "$n" || { echo "PLANTFAIL $n"; continue; }
  node scripts/check-font-coverage.mjs > ../facecrit7-probe/last.log 2>&1; e=$?
  echo "$e | $n | $(grep -m1 -o 'check 7[^.]*\|face law (check 7)[^—]*' ../facecrit7-probe/last.log | head -c 160)"
done
restore
node scripts/check-font-coverage.mjs > /dev/null 2>&1; echo "restored clean exit $?"
