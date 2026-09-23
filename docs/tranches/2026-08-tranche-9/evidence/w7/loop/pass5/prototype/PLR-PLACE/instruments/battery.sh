#!/bin/zsh
# PLR-PLACE pass 5 — the pre-return battery (registry-v4 §2.11 + the charter's gates), each gate BARE,
# its exit code recorded unpiped. Usage: battery.sh <web/frontend dir> <label> [tsc]  (tsc: also vue-tsc,
# never on the control, where it writes build info).
FE=$1; L=$2; OUTTMP=$(mktemp)
cd $FE || exit 9
run() { local name=$1; shift; "$@" > $OUTTMP 2>&1; local rc=$?; echo "$L | $name | exit=$rc | $(grep -v '^\s*$' $OUTTMP | tail -1 | cut -c1-150)"; }
run lint:sleep npm run -s lint:sleep
run lint:lanes npm run -s lint:lanes
run lint:theme-tokens npm run -s lint:theme-tokens
run test:e2e:projects npm run -s test:e2e:projects
run check-pw-projects node scripts/check-pw-projects.mjs
run "eslint ." npx eslint .
run "prettier --check (lint)" npm run -s lint
run lint:copy npm run -s lint:copy
run "check-copy-register bare" node scripts/check-copy-register.mjs
run test:font-coverage npm run -s test:font-coverage
run lint:motion npm run -s lint:motion
run lint:live-regions npm run -s lint:live-regions
run lint:knip npm run -s lint:knip
run lint:boundary npm run -s lint:boundary
if [[ $3 == tsc ]]; then run "vue-tsc -b" npx vue-tsc -b; run "vue-tsc e2e" npx vue-tsc -p tsconfig.e2e.json --noEmit; fi
rm -f $OUTTMP
