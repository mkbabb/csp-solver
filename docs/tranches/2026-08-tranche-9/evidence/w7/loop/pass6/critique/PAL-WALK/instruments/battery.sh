#!/bin/bash
# battery6.sh <web/frontend dir> <tag> — the pre-return battery, each gate BARE (exit unpiped), one log each.
D=$1; tag=$2; out=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw6/logs/battery-$tag; mkdir -p $out; cd $D || exit 1
run() { local n=$1; shift; "$@" > $out/$n.log 2>&1; printf "%-24s exit %s\n" "$n" "$?" >> $out/summary.txt; }
: > $out/summary.txt
run lint:lanes node scripts/check-lane-membership.mjs --self-test
run lint:theme-tokens node scripts/check-theme-tokens.mjs --self-test
run lint:sleep node scripts/check-sleep-lint.mjs --self-test
run test:e2e:projects node scripts/check-pw-projects.mjs --self-test
run check-pw-projects node scripts/check-pw-projects.mjs
run lint:arcs node scripts/check-peer-arcs.mjs --self-test
run lint:copy node scripts/check-copy-register.mjs --self-test
run check-copy-register node scripts/check-copy-register.mjs
run lint:motion node scripts/check-motion-contract.mjs --self-test
run lint:theme-selectors node scripts/check-theme-selectors.mjs --self-test
run lint:ink node scripts/check-ink-pressure.mjs --self-test
run lint:catch node scripts/check-empty-catch.mjs --self-test
run lint:live-regions node scripts/check-live-regions.mjs --self-test
run check-property-block node /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass6/instruments/check-property-block.mjs --fe $D
run undefined-token-census env FE=$D node /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass6/instruments/undefined-token-census.mjs
run knip npx knip
run npm-run-lint npx prettier --check --config .prettierrc.json src/ scripts/ ../../scripts/ ../relay/
run eslint-dot npx eslint .
echo BATTERY_DONE >> $out/summary.txt
