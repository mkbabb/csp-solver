#!/bin/zsh
# D10 born-RED + sabotage battery (pass 9, re-measured): each plant = ONE edit to gridPaths.ts (or the exact
# pass-8 file), swapped in, the unit rows + the critic's probe run with a private cacheDir, restored byte-equal.
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/ACC-FIVE
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-41
FE=$W/web/frontend; F=$FE/src/pencil/grid/gridPaths.ts; P=$S/plants
CRIT=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass8/critique/ACC-FIVE/instruments/crit.stallrun.test.CRITIC.ts
cp $F $P/gridPaths.clean.ts; cp $CRIT $FE/src/pencil/grid/crit.stallrun.test.ts
OUT=$P/d10-battery.txt; : > $OUT; echo "OPEN $(date +%T) $(uptime | sed 's/.*averages: //')" >> $OUT
(cd $W && git show c3a863f7:web/frontend/src/pencil/grid/gridPaths.ts > $P/gp.p8file.ts)
mk() { python3 - "$P/gridPaths.clean.ts" "$P/gp.$1.ts" "$2" <<'PY'
import sys
s=open(sys.argv[1]).read(); o=s; exec(sys.argv[3]); assert s!=o, 'VACUOUS'; open(sys.argv[2],'w').write(s)
PY
}
mk median9 "s=s.replace('export const PANEL_WINDOW = 32;','export const PANEL_WINDOW = 9;').replace('return Math.min(...ticks);','const q = [...ticks].sort((a, b) => a - b);\n  return q[q.length >> 1];')"
mk min9 "s=s.replace('export const PANEL_WINDOW = 32;','export const PANEL_WINDOW = 9;')"
mk median32 "s=s.replace('return Math.min(...ticks);','const q = [...ticks].sort((a, b) => a - b);\n  return q[q.length >> 1];')"
mk win31 "s=s.replace('export const PANEL_WINDOW = 32;','export const PANEL_WINDOW = 31;')"
mk win33 "s=s.replace('export const PANEL_WINDOW = 32;','export const PANEL_WINDOW = 33;')"
mk nocap "s=s.replace('clock += Math.min(dt, Math.max(MOTION.hand.stepMs, panelFrameMs(dt, origin + t)));','clock += dt; panelFrameMs(dt, origin + t);')"
for p in clean p8file median9 min9 median32 win31 win33 nocap; do
  if [ $p = clean ]; then src=$P/gridPaths.clean.ts; else src=$P/gp.$p.ts; fi
  [ -s $src ] || { echo "PLANT $p MISSING" >> $OUT; continue; }
  cp $src $F
  (cd $FE && npx vitest run --config .acc5p9.vitest.mts src/pencil/grid/gridPaths.poseFronts.test.ts src/pencil/grid/crit.stallrun.test.ts -t "RUN of stalls|consecutive 150 ms stalls: the last" > $P/d10.$p.log 2>&1; echo $? > $P/d10.$p.exit)
  cp $P/gridPaths.clean.ts $F
  echo "PLANT $p exit $(cat $P/d10.$p.exit) :: $(grep -E '^ *Tests ' $P/d10.$p.log | tr -s ' ')" >> $OUT
  grep -E '^ *×' $P/d10.$p.log | sed 's/ [0-9]*ms$//' >> $OUT
  grep -E 'CRIT-STALLRUN' $P/d10.$p.log | sort -u >> $OUT
done
cmp $F $P/gridPaths.clean.ts && echo "RESTORED byte-equal" >> $OUT
mv $FE/src/pencil/grid/crit.stallrun.test.ts $S/trash/crit.stallrun.test.ts.$(date +%H%M%S)
echo "DONE $(date +%T) $(uptime | sed 's/.*averages: //')" >> $OUT
