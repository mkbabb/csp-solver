#!/usr/bin/env bash
# usage: battery.sh <web/frontend dir> <label> ; each gate bare, exit code printed
FE="$1"; L="$2"; cd "$FE" || exit 9
run() { local name="$1"; shift; "$@" > "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/mrkabs6-logs/bat-$L-${name}.log" 2>&1; echo "$name $?"; }
run lint-lanes npm run lint:lanes
run lint-theme-tokens npm run lint:theme-tokens
run lint-theme-selectors npm run lint:theme-selectors
run lint-sleep npm run lint:sleep
run lint-motion npm run lint:motion
run lint-copy npm run lint:copy
run lint-ink npm run lint:ink
run test-e2e-projects npm run test:e2e:projects
run check-pw-projects node scripts/check-pw-projects.mjs
run check-copy-register node scripts/check-copy-register.mjs
run eslint npx eslint .
run npm-run-lint-prettier npm run lint
run vue-tsc-b npx vue-tsc -b
run typecheck-e2e npm run typecheck:e2e
run check-property-block node /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass6/instruments/check-property-block.mjs --fe "$FE"
run undefined-token-census env FE="$FE" node /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass6/instruments/undefined-token-census.mjs
echo BATTERY-DONE
