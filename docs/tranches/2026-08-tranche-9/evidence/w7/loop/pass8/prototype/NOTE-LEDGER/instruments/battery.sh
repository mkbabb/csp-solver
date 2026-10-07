#!/bin/bash
# battery.sh <copy> <dist dir> : the pre-return battery (registry-v4 §2.11 + LAWS P7 §F), every gate BARE, exit captured first
P=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/ledger8/p8
c=$1; D=$2; cd $P/$c/web/frontend || exit 9
out=$P/q/battery-$c.txt; echo "start $(date +%T) load $(uptime | sed 's/.*averages: //')" > $out
run() { local name=$1; shift; "$@" > $P/q/bat-$c-$name.log 2>&1; local x=$?; echo "$name exit=$x" >> $out; }
for s in lint:lanes lint:theme-tokens lint:sleep lint:bands lint:verbs lint:motion lint:copy lint:ink lint:knip test:e2e:projects typecheck:e2e test:font-coverage lint:live-regions lint:catch lint:theme-selectors lint:boundary; do run "$s" npm run -s $s; done
run check-pw-projects node scripts/check-pw-projects.mjs
run check-copy-register node scripts/check-copy-register.mjs
run eslint npx eslint . --max-warnings 0
run prettier npm run -s lint
run vue-tsc-b npx vue-tsc -b
run cpb-source node $P/inst/check-property-block.mjs --fe .
run cpb-dist node $P/inst/check-property-block.mjs --fe . --dist $D
run census env FE=$PWD node $P/inst/undefined-token-census.mjs
echo "BATTERY $c DONE $(date +%T) load $(uptime | sed 's/.*averages: //')" >> $out
