#!/bin/bash
# battery.sh <label> <frontend dir> — the pre-return mechanical battery, BARE, one log per gate, exit table
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/tape8
L=$1; F=$2; O=$S/battery/$L; mkdir -p $O
cd $F
run() { local n=$1; shift; local t0=$(date +%s); "$@" > $O/$n.log 2>&1; local e=$?; echo "$n EXIT $e ($(( $(date +%s) - t0 ))s)" >> $O/TABLE.txt; }
: > $O/TABLE.txt
run lint npm run -s lint
run eslint npx eslint . --max-warnings 0
run boundary npm run -s lint:boundary
run typecheck-e2e npm run -s typecheck:e2e
run typecheck-node npm run -s typecheck:node
run knip npm run -s lint:knip
for g in ink catch theme-selectors theme-tokens tape-foot lanes sleep motion copy live-regions tdz; do run lint-$g npm run -s lint:$g; done
run tape-foot-live node scripts/check-tape-foot.mjs
run pw-projects npm run -s test:e2e:projects
run pw-retries npm run -s test:e2e:retries
run support-floor npm run -s test:support-floor
run font-coverage npm run -s test:font-coverage
run vitest-games npx vitest run src/games
run vitest-pencil npx vitest run src/pencil
run vitest-rest npx vitest run src/composables src/lib src/App scripts
run ledger-verify node ../../scripts/ledger-diff.mjs --verify-cites
run doc-truth node ../../scripts/check-doc-truth.mjs
run evidence-policy node ../../scripts/check-evidence-policy.mjs
run inline-tests node ../../scripts/check-inline-tests.mjs
echo DONE >> $O/TABLE.txt
