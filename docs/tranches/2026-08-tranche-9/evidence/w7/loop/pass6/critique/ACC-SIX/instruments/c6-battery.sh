#!/bin/bash
# critic battery (bare, exit codes unpiped): tree then control; control is read-only (node scripts read files; no git, no build)
for FE in /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-45/web/frontend /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-control/web/frontend; do
  cd $FE; echo "== $FE"
  for s in "scripts/check-copy-register.mjs" "scripts/check-copy-register.mjs --self-test" "scripts/check-theme-tokens.mjs --self-test" "scripts/check-font-coverage.mjs --self-test" "scripts/check-lane-membership.mjs --self-test" "scripts/check-sleep-lint.mjs --self-test" "scripts/check-pw-projects.mjs --self-test" "scripts/check-motion-contract.mjs --self-test" "scripts/check-live-regions.mjs --self-test"; do
    node ${=s} > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/acc6crit6/logs/bat-$(basename $(dirname $FE))-$(echo $s | tr ' /' '__').log 2>&1; echo "$s exit $?"; done
  node /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass6/instruments/check-property-block.mjs --fe $FE > /dev/null 2>&1; echo "check-property-block exit $?"
  FE=$FE node /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass6/instruments/undefined-token-census.mjs > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/acc6crit6/logs/bat-census-$(basename $(dirname $FE)).log 2>&1; echo "undefined-token census exit $?"
done
