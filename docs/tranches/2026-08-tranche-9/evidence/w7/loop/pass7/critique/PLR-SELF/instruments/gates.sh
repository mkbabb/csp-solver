#!/bin/bash
T=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-p4-PLR-SELF/web/frontend
C=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-control/web/frontend
L=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop
echo "LOAD $(sysctl -n vm.loadavg)"
for side in tree control; do
  D=$T; [ $side = control ] && D=$C
  cd $D
  for g in "scripts/check-copy-register.mjs" "scripts/check-copy-register.mjs --self-test" "scripts/check-lane-membership.mjs --self-test" "scripts/check-theme-tokens.mjs --self-test" "scripts/check-sleep-lint.mjs --self-test" "scripts/check-pw-projects.mjs --self-test" "scripts/check-pw-projects.mjs" "scripts/check-motion-contract.mjs --self-test" "scripts/check-theme-selectors.mjs --self-test" "scripts/check-live-regions.mjs --self-test"; do
    node $g > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrself-crit7/logs/g.tmp 2>&1; ec=$?; echo "$side  $g  exit $ec :: $(tail -1 /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrself-crit7/logs/g.tmp | cut -c1-160)"
  done
  FE=$D node /pass7/prototype/PLR-SELF/instruments/undefined-token-census.A3.mjs > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrself-crit7/logs/g.tmp 2>&1; echo "$side  census A3  exit $? :: $(grep -E 'bare|STALE' /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrself-crit7/logs/g.tmp | tr '\n' ' ' | cut -c1-300)"
  FE=$D node /pass6/instruments/undefined-token-census.mjs > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrself-crit7/logs/g.tmp 2>&1; echo "$side  census pass6  exit $? :: $(grep -E 'bare|STALE' /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrself-crit7/logs/g.tmp | tr '\n' ' ' | cut -c1-300)"
  node /pass6/instruments/check-property-block.mjs --fe $D > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrself-crit7/logs/g.tmp 2>&1; echo "$side  check-property-block  exit $? :: $(tail -1 /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrself-crit7/logs/g.tmp)"
done
cd $T
npx eslint . > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrself-crit7/logs/eslint.log 2>&1; echo "tree  eslint .  exit $?"
npm run -s lint > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrself-crit7/logs/prettier.log 2>&1; echo "tree  npm run lint  exit $?"
echo GATES-DONE
