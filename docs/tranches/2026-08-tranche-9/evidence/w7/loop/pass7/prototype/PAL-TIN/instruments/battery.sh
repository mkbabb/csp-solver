#!/bin/bash
# PAL-TIN pass 7 · the pre-return battery, each row BARE (exit unpiped), in the dir given; logs per row.
source /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/paltin7.env
D=$1; TAG=$2; OUT=$S/paltin7-battery-$TAG; mkdir -p $OUT; cd $D || exit 9
: > $OUT/exits.txt
echo "load $(uptime | sed 's/.*averages*: //') · siblings $(pgrep -f 'vitest|playwright' | wc -l | tr -d ' ')" >> $OUT/exits.txt
row() { local name=$1; shift; "$@" > $OUT/$name.log 2>&1; echo "$name $?" >> $OUT/exits.txt; }
row lint-tin npm run lint:tin
row check-peer-tin node scripts/check-peer-tin.mjs
row copy-register node scripts/check-copy-register.mjs
row lint-lanes npm run lint:lanes
row lint-theme-tokens npm run lint:theme-tokens
row lint-sleep npm run lint:sleep
row lint-bands npm run lint:bands
row lint-verbs npm run lint:verbs
row test-e2e-projects npm run test:e2e:projects
row check-pw-projects node scripts/check-pw-projects.mjs
row check-property-block node /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass6/instruments/check-property-block.mjs
row lint-motion npm run lint:motion
row typecheck-e2e npm run typecheck:e2e
row eslint npx eslint .
row npm-lint npm run lint
echo DONE >> $OUT/exits.txt
