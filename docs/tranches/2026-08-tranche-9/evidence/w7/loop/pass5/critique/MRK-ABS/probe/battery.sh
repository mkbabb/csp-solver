#!/bin/zsh
# usage: battery.sh <frontend dir> <tag>
cd $1
for c in "node scripts/check-copy-register.mjs" "npm run -s lint:copy" "npm run -s lint:lanes" "npm run -s lint:theme-tokens" "npm run -s lint:theme-selectors" "npm run -s lint:sleep" "npm run -s lint:motion" "npm run -s lint:ink" "npm run -s test:e2e:projects" "node scripts/check-pw-projects.mjs" "npx eslint ." "npm run -s lint"; do
  eval "$c" > /dev/null 2>/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit-abs/logs/bat-$2.err; e=$?
  echo "$2 | $c | EXIT $e | $(tail -1 /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit-abs/logs/bat-$2.err 2>/dev/null | cut -c1-120)"
done
