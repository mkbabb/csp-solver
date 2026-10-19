#!/bin/bash
# battery.sh <label> <web/frontend dir> <outdir> — every gate bare, exit read from the file the run writes
LBL=$1; FE=$2; OUT=$3; mkdir -p "$OUT"; RES=$OUT/results.tsv; : > "$RES"
INST=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/integrate-s13-s7-s3/inst
G=~/.claude/guard/guarded
export CI=
run() { local name=$1 mode=$2; shift 2; local t0=$(date +%s)
  ( cd "$FE" && $G $mode -- bash -c "$*" > "$OUT/$name.log" 2>&1; echo $? > "$OUT/$name.rc" )
  printf '%s\t%s\t%ss\tload %s\n' "$name" "$(cat $OUT/$name.rc)" "$(( $(date +%s)-t0 ))" "$(sysctl -n vm.loadavg | awk '{print $2}')" >> "$RES"; echo "[$(date +%T)] $LBL $name -> $(cat $OUT/$name.rc)"; }
echo "start $(date +%T) load $(sysctl -n vm.loadavg)"
run vue-tsc-b "--light --timeout 20" "npx vue-tsc -b"
for g in lint:motion lint:bands lint:verbs lint:theme-tokens lint:sleep lint:lanes lint:ink lint:copy test:e2e:projects typecheck:e2e typecheck:node test:font-coverage lint:catch lint:theme-selectors lint:live-regions lint:tdz lint:boundary lint:knip; do run "${g//:/-}" "--light --timeout 20" "npm run $g"; done
run check-copy-register "--light --timeout 10" "node scripts/check-copy-register.mjs"
run check-pw-projects "--light --timeout 10" "node scripts/check-pw-projects.mjs"
run eslint "--light --timeout 20" "npx eslint ."
run prettier "--light --timeout 20" "npm run lint"
run shape-census-selftest "--light --timeout 10" "node scripts/shape-census.mjs --self-test"
run shape-census-sabotage "--light --timeout 10" "node scripts/shape-census.mjs --sabotage-battery"
run shape-census-tree "--light --timeout 20" "node scripts/shape-census.mjs --tree ."
run cpb-source "--light --timeout 10" "node $INST/check-property-block.mjs --fe ."
run cpb-selftest "--light --timeout 10" "node $INST/check-property-block.mjs --fe . --self-test"
run utc "--light --timeout 10" "FE=\$PWD node $INST/undefined-token-census.mjs"
run utc-selftest "--light --timeout 10" "FE=\$PWD node $INST/undefined-token-census.mjs --self-test"
for d in src/composables src/games/shared src/games/futoshiki src/games/kenken src/games/killer src/games/sudoku src/games/thermo src/pencil; do run "vitest-${d//\//_}" "--timeout 30" "npx vitest run $d --maxWorkers=2"; done
run vitest-games-root "--timeout 20" "npx vitest run src/games/*.test.ts --maxWorkers=2"
echo "BATTERY DONE $LBL $(date +%T)"
