#!/bin/bash
I=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass7/instruments
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend
echo "load $(uptime | sed 's/.*averages: //')"
for e in chromium webkit; do
  node $I/rest-probes.mjs --engine $e --preset self-resize --url http://127.0.0.1:4231; echo "EXIT rest $e self-resize $?"
  node $I/rest-probes.mjs --engine $e --preset self-touch --url http://127.0.0.1:4231; echo "EXIT rest $e self-touch $?"
  node $I/rest-probes.mjs --engine $e --preset self-touch --plant relabel --url http://127.0.0.1:4231; echo "EXIT rest $e self-touch+relabel $?"
done
echo "load $(uptime | sed 's/.*averages: //')"
echo REST-DONE
