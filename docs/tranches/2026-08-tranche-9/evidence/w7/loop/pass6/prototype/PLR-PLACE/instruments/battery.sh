#!/bin/bash
# PLR-PLACE pass 6 — the pre-return battery, each gate BARE, exit recorded unpiped (no rm: the tmp is a lane-named file, overwritten).
FE=$1; L=$2; OUTTMP=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plr-place-p6-work/battery-$L.tmp
cd $FE || exit 9
run() { local name=$1; shift; "$@" > $OUTTMP 2>&1; local rc=$?; echo "$L | $name | exit=$rc | $(grep -v '^\s*$' $OUTTMP | tail -1 | cut -c1-160)"; }
run lint:sleep npm run -s lint:sleep
run lint:lanes npm run -s lint:lanes
run lint:theme-tokens npm run -s lint:theme-tokens
run test:e2e:projects npm run -s test:e2e:projects
run check-pw-projects node scripts/check-pw-projects.mjs
run "eslint ." npx eslint .
run "npm run lint (scoped prettier)" npm run -s lint
run lint:copy npm run -s lint:copy
run "check-copy-register bare" node scripts/check-copy-register.mjs
run test:font-coverage npm run -s test:font-coverage
run lint:motion npm run -s lint:motion
run lint:live-regions npm run -s lint:live-regions
run lint:knip npm run -s lint:knip
run lint:boundary npm run -s lint:boundary
if [[ $3 == tsc ]]; then run "vue-tsc -b" npx vue-tsc -b; run "vue-tsc e2e" npx vue-tsc -p tsconfig.e2e.json --noEmit; fi
echo "$L | DONE"
