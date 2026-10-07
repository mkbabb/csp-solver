#!/bin/bash
# PLR-SELF pass 8 (resumed) · browserless battery: every gate BARE, tree then control; vitest chunked; typechecks on the archive.
R=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrself8r
T=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-p4-PLR-SELF/web/frontend
C=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-control/web/frontend
PB=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass6/instruments/check-property-block.mjs
L=$R/logs/gates/g
sha() { echo "PlayerMark $(shasum $T/src/pencil/chrome/PlayerMark/PlayerMark.vue | cut -c1-12) HeadSheet $(shasum $T/src/pencil/chrome/AttributionCard/HeadSheet.vue | cut -c1-12) spec $(shasum $T/e2e/player-mark.spec.ts | cut -c1-12)"; }
run() {
  local name="$1"; shift
  for side in tree control; do
    d=$T; [ $side = control ] && d=$C
    ( cd $d && eval "$@" ) > $L.$side.$name.log 2>&1
    echo "GATE $name $side exit $?"
  done
}
echo "SHA1 start $(sha) LOAD $(sysctl -n vm.loadavg)"
run lanes "npm run -s lint:lanes"
run theme-tokens "npm run -s lint:theme-tokens"
run sleep "npm run -s lint:sleep"
run motion "npm run -s lint:motion"
run copy "npm run -s lint:copy"
run ink "npm run -s lint:ink"
run catch "npm run -s lint:catch"
run theme-selectors "npm run -s lint:theme-selectors"
run live-regions "npm run -s lint:live-regions"
run tdz "npm run -s lint:tdz"
run boundary "npm run -s lint:boundary"
run bands "npm run -s lint:bands"
run verbs "npm run -s lint:verbs"
run e2e-projects "npm run -s test:e2e:projects"
run pw-projects "node scripts/check-pw-projects.mjs"
run property-block "node $PB --fe \$d"
run font-coverage "npm run -s test:font-coverage"
run eslint "npx eslint . --max-warnings 0"
run prettier "npm run -s lint"
run knip "npm run -s lint:knip"
echo "LOAD $(sysctl -n vm.loadavg)"
cd $T
for d in src/composables src/games/futoshiki src/games/kenken src/games/killer src/games/sudoku src/games/thermo src/games/shared src/pencil src/games/cards.test.ts src/games/posters.test.ts; do
  n=$(echo $d | tr / _)
  npx vitest run $d > $R/logs/vt-$n.log 2>&1; ec=$?
  echo "VT $d exit $ec :: $(grep -E 'Test Files|Tests ' $R/logs/vt-$n.log | tr -s ' ' | tr '\n' ' ') LOAD $(sysctl -n vm.loadavg)"
done
cd $R/arch/web/frontend
npx vue-tsc -b > $R/logs/vuetsc-b.log 2>&1; echo "ARCH vue-tsc -b exit $?"
npm run -s typecheck:e2e > $R/logs/typecheck-e2e.log 2>&1; echo "ARCH typecheck:e2e exit $?"
npm run -s typecheck:node > $R/logs/typecheck-node.log 2>&1; echo "ARCH typecheck:node exit $?"
echo "SHA1 end $(sha) LOAD $(sysctl -n vm.loadavg)"
echo BATTERY-A-DONE
