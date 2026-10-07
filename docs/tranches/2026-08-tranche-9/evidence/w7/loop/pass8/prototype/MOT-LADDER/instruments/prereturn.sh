#!/bin/bash
# MOT-LADDER pass 8 · the pre-return battery, each gate BARE (no pipe on the exit), tree | control.
# usage: prereturn.sh <web/frontend> <served url> <label>   — nothing here writes or deletes.
FE=$1; URL=$2; LAB=$3; DIST=$4
L=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/ladder8
OUT=$L/prereturn-$LAB.tsv
: > $OUT
cd $FE
run() { local name=$1; shift; "$@" > $L/pr-$LAB-$name.log 2>&1; printf "%s\t%s\n" "$name" $? >> $OUT; }
run lint-lanes npm run --silent lint:lanes
run lint-theme-tokens npm run --silent lint:theme-tokens
run lint-sleep npm run --silent lint:sleep
run lint-bands npm run --silent lint:bands
run lint-verbs npm run --silent lint:verbs
run lint-motion npm run --silent lint:motion
run lint-copy npm run --silent lint:copy
run test-e2e-projects npm run --silent test:e2e:projects
run check-pw-projects node scripts/check-pw-projects.mjs
run propblock-source node $L/instruments/check-property-block.mjs --fe $FE --dist $DIST
run propblock-served node $L/instruments/check-property-block.mjs --fe $FE --dist $DIST --served $URL
run shape-census-selftest node scripts/shape-census.mjs --self-test
run npm-lint npm run --silent lint
run eslint npx eslint . --max-warnings 0
run knip npm run --silent lint:knip
echo DONE >> $OUT
