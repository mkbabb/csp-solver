#!/bin/bash
# INTAKE-22 row 44: the "i" glyph painted at DPR 2, both themes, both engines, rest + open, lane vs control,
# through the ONE glyph-population probe at its product home (HEAD12 plant, 13-column floor).
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-35/web/frontend
cd $W
B="size=3&board=ATMuMDAzMDA2MDgwMDUwNzAwMTAzMDA5MDIwMDUwMjAwNTA3MDAxMDYwMDkwMjAwODAxMDA0MDYwMDQwNjAwOTAyMDA4MDEwMDQwOTAwMzA1MDA4"
for arm in "4238 lane" "4251 control"; do set -- $arm; for e in chromium webkit; do for s in light dark; do for st in rest open; do
  extra=""; [ "$st" = open ] && extra="--click .info-btn"
  echo "=== $2 $e $s $st load $(sysctl -n vm.loadavg)"
  node e2e/lib/glyph-pop.mjs --url "http://127.0.0.1:$1/?$B" --engine $e --subject ".info-btn .info-glyph" --payload "row44-$st" --scheme $s --dpr 2 $extra
  echo "EXIT $?"
done; done; done; done
echo ALLDONE
