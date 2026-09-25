#!/bin/bash
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend
for spec in "http://127.0.0.1:4239 control-74a2b5d9-dist" "http://127.0.0.1:4236 lane-dist-B72YBnilT3zJ" "http://127.0.0.1:4236 lane-dist-B72YBnilT3zJ-run2"; do
  set -- $spec
  echo "=== $2 load $(sysctl -n vm.loadavg)"
  node /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass7/critique/MRK-LIVE/instruments/whole-ring.mjs $1 $2
  echo "EXIT $?"
done
echo ALLDONE
