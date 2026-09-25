#!/bin/bash
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/erasecrit7
for t in tree2 ctl2; do
  cd $S/$t/web/frontend
  for g in "npm run -s lint:lanes" "npm run -s lint:theme-tokens" "npm run -s lint:sleep" "npm run -s lint:motion" "npm run -s lint:copy" "npm run -s lint:ink" "npm run -s test:e2e:projects" "node scripts/check-pw-projects.mjs" "node scripts/check-copy-register.mjs" "npx eslint ." "npm run -s lint"; do
    $g > $S/bat-$t-$(echo $g | tr ' :/.' '____').log 2>&1; echo "$t | $g | exit=$?"
  done
done
echo BATDONE
