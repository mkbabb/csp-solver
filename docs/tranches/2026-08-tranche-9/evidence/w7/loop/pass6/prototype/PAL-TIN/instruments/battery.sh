#!/bin/zsh
# PAL-TIN pass 6 · registry-v4 §2.11's estate battery + the family's lanes, each BARE (exit unpiped), on the frontend dir given.
D=$1; tag=$2; out=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/paltin6-battery-$tag
mkdir -p $out; cd $D || exit 1
run() { local n=$1; shift; "$@" > $out/$n.log 2>&1; printf "%-22s exit %s\n" "$n" "$?" >> $out/summary.txt; }
: > $out/summary.txt
run lint-lanes node scripts/check-lane-membership.mjs --self-test
run lint-theme-tokens node scripts/check-theme-tokens.mjs --self-test
run lint-sleep node scripts/check-sleep-lint.mjs --self-test
run test-e2e-projects node scripts/check-pw-projects.mjs --self-test
run check-pw-projects node scripts/check-pw-projects.mjs
run eslint-dot npx eslint .
run npm-run-lint npm run lint
run prettier-broad-dot npx prettier --check .
run lint-tin node scripts/check-peer-tin.mjs --self-test
run check-peer-tin-bare node scripts/check-peer-tin.mjs
run check-copy-register node scripts/check-copy-register.mjs
run lint-copy node scripts/check-copy-register.mjs --self-test
run lint-motion node scripts/check-motion-contract.mjs --self-test
run lint-theme-selectors node scripts/check-theme-selectors.mjs --self-test
run lint-ink node scripts/check-ink-pressure.mjs --self-test
run lint-catch node scripts/check-empty-catch.mjs --self-test
run lint-live-regions node scripts/check-live-regions.mjs --self-test
run lint-tdz node scripts/tdz-probe.mjs --self-test
run test-e2e-retries node scripts/check-pw-retries.mjs --self-test
run lint-boundary npx eslint --no-config-lookup --config eslint.boundary.config.js src/games
run typecheck-e2e npx vue-tsc --noEmit -p tsconfig.e2e.json
run knip npx knip
run audit-high npm audit --audit-level=high
echo BATTERY_DONE >> $out/summary.txt
