#!/bin/bash
# battery, second sitting: the whole spec file (exact) both arms, then every tree gate after the fixes. Control gates = battery.log (all 0).
SP=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad; FE=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-47/web/frontend; CF=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/erase6-ctrl74/web/frontend; I=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass6/instruments
cd $FE; PLAYWRIGHT_BASE_URL=http://127.0.0.1:4248 npx playwright test --config .erase6/pw.exact.mts > $SP/erase6-logs/bat-spec-tree.log 2>&1; echo "tree | affordances.spec.ts whole (exact) on B5bcl | exit $? | $(grep -E '[0-9]+ (passed|failed)' $SP/erase6-logs/bat-spec-tree.log | tr '\n' ' ')"
cd $CF; PLAYWRIGHT_BASE_URL=http://127.0.0.1:4249 npx playwright test --config .erase6/pw.exact.mts > $SP/erase6-logs/bat-spec-control.log 2>&1; echo "control | affordances.spec.ts whole (exact, own) on CubiZ | exit $? | $(grep -E '[0-9]+ (passed|failed)' $SP/erase6-logs/bat-spec-control.log | tr '\n' ' ')"
mkdir -p $SP/trash-erase6-3; mv $FE/.erase6 $SP/trash-erase6-3/tree-erase6; mv $CF/.erase6 $SP/trash-erase6-3/ctrl-erase6
cd $FE
for g in "npm run lint:lanes" "npm run lint:theme-tokens" "npm run lint:sleep" "npm run test:e2e:projects" "node scripts/check-pw-projects.mjs" "npx eslint ." "npm run lint" "npm run lint:copy" "node scripts/check-copy-register.mjs" "npm run lint:motion" "npm run lint:ink" "node scripts/check-ink-pressure.mjs" "npm run lint:live-regions" "npm run lint:theme-selectors" "npm run lint:knip" "npx vue-tsc --noEmit" "npm run typecheck:e2e" "node $I/check-property-block.mjs --fe $FE --dist $SP/erase6-dist-final --served http://127.0.0.1:4248"; do
  lg=$SP/erase6-logs/bat2-tree-$(echo $g | tr ' :/.' '____' | cut -c1-60).log
  bash -c "$g" > $lg 2>&1; echo "tree | $g | exit $?"
done
