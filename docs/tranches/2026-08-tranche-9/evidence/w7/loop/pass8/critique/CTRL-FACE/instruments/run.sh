#!/bin/bash
cd /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit-face8/fe
restore() { for f in src/pencil/chrome/OptionSelector/OptionSelector.vue src/main.ts src/pencil/chrome/HandwrittenLogo/HandwrittenLogo.vue src/assets/index.css src/assets/typography.css; do cp -p /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-33/web/frontend/$f $f; done; [ -f src/assets/plant-face.css ] && mv src/assets/plant-face.css /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit-face8/probe/trash-plant-$RANDOM.css; }
echo "== pass-7 critic plants (run FIRST)"
while IFS= read -r n; do restore; python3 /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit-face8/probe/p7plants.py "$n" || { echo "PLANTFAIL $n"; continue; }; node scripts/check-font-coverage.mjs > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit-face8/probe/last.log 2>&1; e=$?; echo "$e | $n | $(grep -m1 'check 7\|face law' /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit-face8/probe/last.log | cut -c1-150)"; done <<'L'
CONTROL literal (must red)
mint-face-token
shadow-face-token-scoped
shadow-font-token-root
script-style-string
ts-style-string
cssText
setAttribute-style
style.font shorthand
ts h() style object
svg font-family attr
tailwind font-(--var)
tailwind :class object
tailwind :class string
style template literal
font-family var fallback-only (undeclared face)
L
echo "== pass-8 critic fresh shapes"
python3 /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit-face8/probe/p8plants.py --list > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit-face8/probe/list.txt
while IFS= read -r n; do restore; python3 /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit-face8/probe/p8plants.py "$n" || { echo "PLANTFAIL $n"; continue; }; node scripts/check-font-coverage.mjs > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit-face8/probe/last.log 2>&1; e=$?; echo "$e | $n | $(grep -m1 -i 'check 7\|face law\|comic' /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit-face8/probe/last.log | cut -c1-170)"; done < /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit-face8/probe/list.txt
restore; node scripts/check-font-coverage.mjs > /dev/null 2>&1; echo "restored clean exit $?"
