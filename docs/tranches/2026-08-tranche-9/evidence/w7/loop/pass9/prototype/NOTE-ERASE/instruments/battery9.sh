#!/bin/bash
# battery9.sh <label> <frontend dir> — the browserless battery, each row bare, exits written by this script to logs/bat-<label>.txt
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/NOTE-ERASE
lab=$1 F=$2; O=$S/logs/bat-$lab.txt; D=$S/logs/bat-$lab; mkdir -p $D; : > $O
[ -e $F/node_modules ] || ln -s /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules $F/node_modules
row() { local n=$1; shift; local L0=$(uptime | sed 's/.*averages: //'); (cd $F && "$@" > $D/$n.log 2>&1); local x=$?; echo "$n exit=$x load=$L0" >> $O; }
row vue-tsc npx vue-tsc -b
row typecheck-e2e npm run -s typecheck:e2e
row prettier npx prettier --check --config .prettierrc.json src/ scripts/
row eslint npx eslint . --max-warnings 0
row knip npm run -s lint:knip
row lint-ink npm run -s lint:ink
row lint-theme-tokens npm run -s lint:theme-tokens
row lint-motion npm run -s lint:motion
row lint-sleep npm run -s lint:sleep
row lint-lanes npm run -s lint:lanes
row lint-copy npm run -s lint:copy
row shape-selftest node scripts/shape-census.mjs --self-test
row shape-tree node scripts/shape-census.mjs --tree .
for d in games pencil composables; do
  row vitest-$d npx vitest run src/$d
  echo "  vitest-$d files: $(grep -E 'Test Files' $D/vitest-$d.log | tr -s ' ') · tests: $(grep -E '^\s+Tests ' $D/vitest-$d.log | tr -s ' ')" >> $O
done
echo "BATTERY-DONE $(uptime | sed 's/.*averages: //')" >> $O
