#!/bin/bash
# PLR-PLACE pass 7 — the break battery on the FINAL sha1s: each plant alone (or stacked where named), the named rows, both engines, sha1 restore.
R=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrplace7c-work
WF=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-p4-PLR-PLACE/web/frontend
O=$R/breaks.txt
cd $WF
shas() { echo "sha1 $1: PlayerMark $(shasum src/pencil/chrome/PlayerMark/PlayerMark.vue | cut -c1-12) App $(shasum src/App.vue | cut -c1-12) place-spec $(shasum e2e/player-place.spec.ts | cut -c1-12) mark-spec $(shasum e2e/player-mark.spec.ts | cut -c1-12) HeadSheet $(shasum src/pencil/chrome/AttributionCard/HeadSheet.vue | cut -c1-12)" >> $O; }
summ() { grep -E '^\s+(✓|✘)' $1 | sed -E 's/^ *(✓|✘) +[0-9]+ \[([a-z]+)\] › [^ ]+ › (.{0,70}).*/\1 \2 \3/' | tr '\n' ';'; }
run() { # label plants(comma) spec grep
  local label=$1 plants=$2 spec=$3 g=$4
  for p in ${plants//,/ }; do python3 $R/plant.py $p apply >> $O; done; sleep 4
  echo "load $(uptime | sed 's/.*averages: //')" >> $O
  PLC_PORT=4243 npx playwright test -c .plr-place/pw.config.ts $spec -g "$g" --reporter=list > $R/break-$label.log 2>&1; ec=$?
  for p in $(echo ${plants//,/ } | awk '{for(i=NF;i>0;i--) printf "%s ", $i}'); do python3 $R/plant.py $p restore >> $O; done; sleep 3
  echo "BREAK $label [$plants] [$g] exit=$ec :: $(summ $R/break-$label.log) :: errors $(grep -E '^ +Error: ' $R/break-$label.log | sed -E 's/ +/ /g' | sort | uniq -c | tr '\n' ';')" >> $O
}
shas start
run GHOST GHOST e2e/player-place.spec.ts "13 ·"
run E4 E4 e2e/player-place.spec.ts "(7 · a tapped|12 ·|14 ·)"
run TOUCHEND TOUCHEND e2e/player-place.spec.ts "(7 · a tapped|12 ·|14 ·)"
mouse() { for p in ${2//,/ }; do python3 $R/plant.py $p apply >> $O; done; sleep 4; PLC_ARM=$1 PLC_WHAT=mouse PLC_OUT=$R/census PLC_PAYLOAD=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass5/prototype/PLR-PLACE/readings/kill-payload.json PLC_PORT=4243 npx playwright test -c .plr-place/pw.config.ts .plr-place/p7-census.spec.ts > $R/mouse-$1.log 2>&1; echo "MOUSE $1 exit=$? $(grep MOUSE $R/mouse-$1.log | tr '\n' ' ')" >> $O; for p in ${2//,/ }; do python3 $R/plant.py $p restore >> $O; done; sleep 3; }
mouse clean ""
mouse E4 E4
run SEAM_A SEAM_A e2e/player-place.spec.ts "(7|11) · (a tapped|your ring and the room agree: a tapped)"
run REACH REACH e2e/player-place.spec.ts "(7|12) ·"
run REFIT_chart REFIT e2e/player-place.spec.ts "15 ·"
run REFIT_yield YIELD,REFIT e2e/player-place.spec.ts "15 ·"
run ROW15_yield YIELD e2e/player-place.spec.ts "15 ·"
run LEADER_chart "" e2e/player-mark.spec.ts "(a portrait phone compresses|an open sheet reads the space again)"
run LEADER_yield YIELD e2e/player-mark.spec.ts "(a portrait phone compresses|an open sheet reads the space again)"
run LEADER_list NO_ARM e2e/player-mark.spec.ts "(a portrait phone compresses|an open sheet reads the space again)"
run LEADER_yieldP6 YIELD_P6 e2e/player-mark.spec.ts "a portrait phone compresses"
shas end
echo DONE >> $O
