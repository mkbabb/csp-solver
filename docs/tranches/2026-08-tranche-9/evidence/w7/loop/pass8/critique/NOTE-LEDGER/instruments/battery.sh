#!/bin/bash
# battery.sh <copy> <dist> : a subset of the pre-return battery, each gate bare, exit captured
SP=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/lcrit8
c=$1; D=$2; cd $SP/$c/web/frontend || exit 9
out=$SP/logs/battery-$c.txt; echo "start $(date +%T) load $(uptime | sed 's/.*averages: //')" > $out
run() { local name=$1; shift; "$@" > $SP/logs/bat-$c-$name.log 2>&1; local x=$?; echo "$name exit=$x" >> $out; }
for s in lint:motion lint:copy lint:knip test:e2e:projects typecheck:e2e test:font-coverage; do run "$s" npm run -s $s; done
run check-pw-projects node scripts/check-pw-projects.mjs
run check-copy-register node scripts/check-copy-register.mjs
run eslint-changed npx eslint --max-warnings 0 e2e/note-reserve.spec.ts scripts/check-ink-pressure.mjs scripts/check-font-coverage.mjs scripts/check-pw-projects.mjs src/pencil/chrome/MarginNote.vue
run prettier npm run -s lint
run cpb-source node $SP/inst/check-property-block.mjs --fe .
run cpb-dist node $SP/inst/check-property-block.mjs --fe . --dist $D
run census env FE=$PWD node $SP/inst/undefined-token-census.mjs
echo "BATTERY $c DONE $(date +%T) load $(uptime | sed 's/.*averages: //')" >> $out
