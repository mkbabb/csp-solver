#!/bin/bash
# PLR-SELF pass 8 · the pre-return browserless battery, each gate BARE, tree then control (exit codes only).
T=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-p4-PLR-SELF/web/frontend
C=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-control/web/frontend
L=$1
run() { # name, cmd
  local name="$1"; shift
  for side in tree control; do
    d=$T; [ $side = control ] && d=$C
    ( cd $d && eval "$@" ) > $L.$side.$name.log 2>&1
    echo "GATE $name $side exit $?"
  done
}
echo "LOAD $(sysctl -n vm.loadavg)"
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
run e2e-projects "npm run -s test:e2e:projects"
run pw-projects "node scripts/check-pw-projects.mjs"
run property-block "node /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass6/instruments/check-property-block.mjs --fe $d"
run font-coverage "npm run -s test:font-coverage"
run boundary "npm run -s lint:boundary"
run eslint "npx eslint . --max-warnings 0"
run prettier "npm run -s lint"
run knip "npm run -s lint:knip"
echo "LOAD $(sysctl -n vm.loadavg)"
echo GATES-DONE
