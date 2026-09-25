#!/bin/bash
# INTAKE-22 row 44: the "i" glyph painted at 2x, both themes, both engines, rest + open, lane vs control dist.
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend
for arm in "4238 lane" "4239 control"; do set -- $arm; for e in chromium webkit; do for s in light dark; do for st in rest open; do
  extra=""; [ "$st" = open ] && extra="--click .info-btn"
  echo "=== $2 $e $s $st"
  node /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass7/instruments/paint-probes.mjs --url "http://127.0.0.1:$1/?size=3&board=ATMuMDAzMDA2MDgwMDUwNzAwMTAzMDA5MDIwMDUwMjAwNTA3MDAxMDYwMDkwMjAwODAxMDA0MDYwMDQwNjAwOTAyMDA4MDEwMDQwOTAwMzA1MDA4" --engine $e --probe glyph --subject ".info-btn .info-glyph" --scheme $s --dpr 2 --plants --frac-bound auto $extra
  echo "EXIT $?"
done; done; done; done
echo ALLDONE
