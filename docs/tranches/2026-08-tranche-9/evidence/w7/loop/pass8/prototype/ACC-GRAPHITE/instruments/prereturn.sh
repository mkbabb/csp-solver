#!/bin/bash
# prereturn.sh <name>: the battery on bat-<name>/web/frontend (a git archive); TSV row per gate.
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/graphite8
N=$1; F=$S/bat-$N/web/frontend; O=$S/logs/pre-$N; mkdir -p $O
CPB=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass6/instruments/check-property-block.mjs
cd $F
run() { k=$1; shift; "$@" > $O/$k.log 2>&1; echo -e "$k\t$?\t$(tail -1 $O/$k.log | cut -c1-120)" >> $S/logs/pre-$N.tsv; }
: > $S/logs/pre-$N.tsv
run eslint npx eslint .
run lint npm run lint
run lint-lanes npm run lint:lanes
run lint-theme-tokens npm run lint:theme-tokens
run lint-sleep npm run lint:sleep
run lint-ink npm run lint:ink
run lint-knip npm run lint:knip
run test-e2e-projects npm run test:e2e:projects
run check-pw-projects node scripts/check-pw-projects.mjs
run cpb-source node $CPB --fe $F
run vue-tsc npx vue-tsc -b
run vitest-shared npx vitest run src/games/shared
run vitest-pencil npx vitest run src/pencil
echo DONE >> $S/logs/pre-$N.tsv
