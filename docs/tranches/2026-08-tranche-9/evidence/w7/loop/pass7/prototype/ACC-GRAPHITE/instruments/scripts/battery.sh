#!/bin/bash
# battery.sh <label> <web/frontend> : every pre-return gate, bare, one exit per row (no pipes on the gate)
L=$1; FE=$2; S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/accg7
I=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass6/instruments
OUT=$S/logs/battery-$L.tsv; : > $OUT; mkdir -p $S/logs/bat-$L
g() { n=$1; shift; ( cd $FE && "$@" > $S/logs/bat-$L/$n.log 2>&1 ); echo -e "$n\t$?" >> $OUT; }
g copy-register node scripts/check-copy-register.mjs
g copy-register-self node scripts/check-copy-register.mjs --self-test
g theme-tokens node scripts/check-theme-tokens.mjs
g lint-theme-tokens node scripts/check-theme-tokens.mjs --self-test
g ink-pressure node scripts/check-ink-pressure.mjs
g lint-ink node scripts/check-ink-pressure.mjs --self-test
g lint-lanes node scripts/check-lane-membership.mjs --self-test
g lint-sleep node scripts/check-sleep-lint.mjs --self-test
g lint-motion node scripts/check-motion-contract.mjs --self-test
g test-e2e-projects node scripts/check-pw-projects.mjs --self-test
g check-pw-projects node scripts/check-pw-projects.mjs
g property-block-src node $I/check-property-block.mjs --fe $FE
g undefined-token-census env FE=$FE node $I/undefined-token-census.mjs --self-test
g eslint npx eslint .
g knip npx knip
echo DONE >> $OUT
