#!/bin/bash
# PLR-SELF pass 7: the browserless pre-return gates, BARE, tree then control (node reads only; no git in the control).
T=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-p4-PLR-SELF/web/frontend
C=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-control/web/frontend
L=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop
echo "LOAD $(sysctl -n vm.loadavg)"
for side in tree control; do
  D=$T; [ $side = control ] && D=$C
  cd $D
  for g in "scripts/check-copy-register.mjs" "scripts/check-lane-membership.mjs --self-test" "scripts/check-theme-tokens.mjs --self-test" "scripts/check-sleep-lint.mjs --self-test" "scripts/check-pw-projects.mjs --self-test" "scripts/check-pw-projects.mjs"; do
    node ${=g} > /dev/null 2>&1; ec=$?; echo "$side  $g  exit $ec"
  done
  for g in lint:bands lint:verbs; do
    if grep -q "\"$g\"" package.json; then npm run -s $g > /dev/null 2>&1; echo "$side  npm run $g  exit $?"; else echo "$side  npm run $g  (no such script)"; fi
  done
  FE=$D node $L/pass7/prototype/PLR-SELF/instruments/undefined-token-census.A3.mjs > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrself7b/tmp.gate 2>&1; ec=$?; echo "$side  undefined-token census (A.3 row admitted)  exit $ec :: $(grep -E 'bare var|STALE|stale:' /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrself7b/tmp.gate | tr '\n' ' ' | tr -s ' ')"
  FE=$D node $L/pass6/instruments/undefined-token-census.mjs > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrself7b/tmp.gate 2>&1; ec=$?; echo "$side  undefined-token census (pass-6 copy, no A.3 row)  exit $ec :: $(grep -E 'bare var|STALE|stale:' /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrself7b/tmp.gate | tr '\n' ' ' | tr -s ' ')"
  node $L/pass6/instruments/check-property-block.mjs --fe $D > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrself7b/tmp.gate 2>&1; echo "$side  check-property-block (source)  exit $? :: $(tail -1 /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrself7b/tmp.gate)"
done
cd $T
npx eslint . > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrself7b/logs/eslint.log 2>&1; echo "tree  eslint .  exit $?"
npm run -s lint > /dev/null 2>&1; echo "tree  npm run lint (prettier --check src/ scripts/ ../../scripts/ ../relay/)  exit $?"
npx prettier --check --config .prettierrc.json e2e/player-mark.spec.ts > /dev/null 2>&1; echo "tree  prettier --check e2e/player-mark.spec.ts (e2e is .prettierignore'd)  exit $?"
grep -rn 'keydown.enter' src | wc -l | sed 's/^/tree  CH-70 probe keydown.enter count /'
echo GATES-DONE
