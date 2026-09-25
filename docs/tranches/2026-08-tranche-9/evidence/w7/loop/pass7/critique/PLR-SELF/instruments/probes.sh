#!/bin/bash
I=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass7/instruments
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend
T='http://127.0.0.1:4231/?size=3&difficulty=EASY&wire=local'
C='http://127.0.0.1:4237/?size=3&difficulty=EASY'
echo "load $(uptime | sed 's/.*averages: //')"
node $I/paint-probes.mjs --probe edge --engine chromium --scheme light --url "$T" --click '[data-player-mark]:visible' --subject '.corner-left [data-lobby]' --edge '.corner-left [data-lobby] .head-sheet-edge' --plants; echo "EXIT edge lobby tree chromium light $?"
node $I/paint-probes.mjs --probe edge --engine webkit --scheme dark --url "$T" --hover '.corner-left .attribution-trigger' --subject '.corner-left .hover-card' --edge '.corner-left .hover-card .head-sheet-edge' --plants; echo "EXIT edge card tree webkit dark $?"
node $I/paint-probes.mjs --probe glyph --engine chromium --scheme light --url "$T" --click '[data-player-mark]:visible' --subject '.corner-left [data-lobby] .pl-state' --plants --frac-bound auto; echo "EXIT glyph state tree chromium light $?"
node $I/paint-probes.mjs --probe glyph --engine chromium --scheme light --url "$C" --hover '.corner-left .attribution-trigger' --subject '.corner-left .hover-card p.italic' --frac-bound auto; echo "EXIT glyph caption control chromium light $?"
node $I/paint-probes.mjs --probe glyph --engine webkit --scheme dark --url "$T" --click '[data-player-mark]:visible' --subject '.corner-left [data-lobby] .pl-state' --plants --frac-bound auto; echo "EXIT glyph state tree webkit dark $?"
echo "load $(uptime | sed 's/.*averages: //')"
echo PROBES-DONE
