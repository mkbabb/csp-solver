#!/bin/bash
# bare gates, each exit printed; $1 = archive root, $2 = label
cd "$1/web/frontend"
run() { local name="$1"; shift; "$@" > "$OUT/$2-$name.txt" 2>&1; echo "$name exit=$?"; }
OUT=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrc8/batt; mkdir -p $OUT
L=$2
for g in lint:sleep lint:theme-tokens lint:lanes lint:copy lint:motion lint:live-regions lint:ink lint:catch lint:theme-selectors lint:tdz lint:knip lint:boundary test:font-coverage test:e2e:projects lint typecheck:e2e lint:bands lint:verbs; do
  if grep -q "\"$g\":" package.json; then npm run -s $g > $OUT/$L-$g.txt 2>&1; echo "$g exit=$?"; else echo "$g ABSENT"; fi
done
node scripts/check-pw-projects.mjs > $OUT/$L-check-pw-projects.txt 2>&1; echo "check-pw-projects exit=$?"
node scripts/check-copy-register.mjs > $OUT/$L-copy-bare.txt 2>&1; echo "check-copy-register(bare) exit=$?"
[ -f scripts/check-property-block.mjs ] && { node scripts/check-property-block.mjs > $OUT/$L-propblock.txt 2>&1; echo "check-property-block(source) exit=$?"; }
npx eslint --max-warnings 0 . > $OUT/$L-eslint.txt 2>&1; echo "eslint . (0 warnings) exit=$?"
npx vue-tsc -b > $OUT/$L-vuetsc.txt 2>&1; echo "vue-tsc -b exit=$?"
echo BATTERY-DONE
