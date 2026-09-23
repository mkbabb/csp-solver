#!/bin/bash
# Pre-return battery (registry-v4 §2.11), each gate BARE (exit code of the gate itself), tree then control.
SP=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad
for arm in tree:/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-47/web/frontend control74:$SP/ctrl74/web/frontend; do
  n=${arm%%:*}; d=${arm#*:}; cd $d
  for g in "npm run lint:lanes" "npm run lint:theme-tokens" "npm run lint:sleep" "npm run test:e2e:projects" "node scripts/check-pw-projects.mjs" "npx eslint ." "npm run lint" "npm run lint:copy" "node scripts/check-copy-register.mjs" "npm run lint:motion" "npm run lint:ink" "node scripts/check-ink-pressure.mjs" "npm run lint:live-regions" "npm run lint:theme-selectors" "npm run lint:knip" "npx vue-tsc --noEmit" "npm run typecheck:e2e"; do
    $g > $SP/logs/bat-$n-$(echo $g | tr ' :/.' '____').log 2>&1; echo "$n | $g | exit $?"
  done
done
