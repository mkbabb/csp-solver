#!/bin/bash
# battery.sh <label> <web/frontend dir> <outdir> — every gate bare, exit captured first, one log per gate
LBL=$1; FE=$2; OUT=$3; mkdir -p "$OUT"; RES=$OUT/results.tsv; : > "$RES"
INST=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/s13i8r/inst
export CI=
run() { local name=$1; shift; local t0=$(date +%s); ( cd "$FE" && bash -c "$*" ) > "$OUT/$name.log" 2>&1; local rc=$?
  printf '%s\t%s\t%ss\tload %s\n' "$name" "$rc" "$(( $(date +%s)-t0 ))" "$(sysctl -n vm.loadavg | awk '{print $2}')" >> "$RES"; echo "[$(date +%T)] $LBL $name -> $rc"; }
echo "start $(date +%T) load $(sysctl -n vm.loadavg)"
run vue-tsc-b "npx vue-tsc -b"
for g in lint:lanes lint:theme-tokens lint:sleep lint:bands lint:verbs lint:motion lint:ink lint:copy test:e2e:projects typecheck:e2e typecheck:node test:font-coverage lint:catch lint:theme-selectors lint:live-regions lint:tdz lint:boundary lint:knip; do run "${g//:/-}" "npm run $g"; done
run check-copy-register "node scripts/check-copy-register.mjs"
run check-pw-projects "node scripts/check-pw-projects.mjs"
run eslint "npx eslint ."
run prettier "npm run lint"
run shape-census-selftest "node scripts/shape-census.mjs --self-test"
run shape-census-sabotage "node scripts/shape-census.mjs --sabotage-battery"
run shape-census-tree "node scripts/shape-census.mjs --tree ."
run cpb-source "node $INST/check-property-block.mjs --fe ."
run cpb-selftest "node $INST/check-property-block.mjs --fe . --self-test"
run utc "FE=\$PWD node $INST/undefined-token-census.mjs"
run utc-selftest "FE=\$PWD node $INST/undefined-token-census.mjs --self-test"
for d in src/composables src/games/shared src/games/futoshiki src/games/kenken src/games/killer src/games/sudoku src/games/thermo src/pencil; do run "vitest-${d//\//_}" "npx vitest run $d"; done
run vitest-games-root "npx vitest run src/games/*.test.ts"
echo "BATTERY DONE $LBL $(date +%T)"
