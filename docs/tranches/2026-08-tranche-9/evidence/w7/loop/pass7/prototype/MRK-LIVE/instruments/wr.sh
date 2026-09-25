#!/bin/bash
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend
for spec in "http://127.0.0.1:4239 control-74a2b5d9-dist" "http://127.0.0.1:4238 lane-head-dev" "http://127.0.0.1:4244 arm-graft-dev" "http://127.0.0.1:4242 arm-sized-dev"; do
  set -- $spec
  echo "=== $2 load $(sysctl -n vm.loadavg)"
  node /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass7/prototype/MRK-LIVE/instruments/whole-ring.mjs $1 $2
  echo "EXIT $?"
done
echo "=== PLANT clip on sized load $(sysctl -n vm.loadavg)"
node /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass7/prototype/MRK-LIVE/instruments/whole-ring.mjs http://127.0.0.1:4242 arm-sized-PLANT-clip0 chromium,webkit '.cell-ghost { clip-path: inset(50%) !important; }'
echo "EXIT $?"
echo ALLDONE
