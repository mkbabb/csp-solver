#!/bin/bash
# litdel.sh : each new clause LITERALLY deleted (and the 0.5 bound moved ±0.02) in a scratch copy; --self-test bare
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/NOTE-LEDGER
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-46/web/frontend
LD=$S/ld/web/frontend; mkdir -p $LD; cp -R $W/src $W/scripts $W/package.json $LD/; F=$LD/scripts/check-ink-pressure.mjs; O=$S/ink-orig.mjs; cp $F $O
LOG=$S/logs/litdel.txt; : > $LOG; cd $LD
v() { local n=$1 e=$2; cp $O $F; perl -0pi -e "$e" $F; if cmp -s $O $F; then echo "[$n] VACUOUS (no edit)" >> $LOG; return; fi
  node --check $F || { echo "[$n] syntax" >> $LOG; return; }
  node scripts/check-ink-pressure.mjs --self-test > $S/logs/ld.out 2>&1; local x=$?
  echo "[$n] exit $x · $(grep -m1 -E 'GREEN|RED on|vacuous|misread|reserve' $S/logs/ld.out | cut -c1-200) · load $(uptime | sed 's/.*averages: //')" >> $LOG; }
v R1-reach 's/!on\("R1-reach"\) \|\|/true ||/'
v R3-sure 's/\(on\("R3-sure"\) \? s\.sure : undefined\) \?\?/undefined ??/'
v R4-element 's/who === "voice" && on\("R4-element"\)/false/g; s/cls !== "margin-note" \|\| !on\("R4-element"\)/true/'
v R4-unresolved 's/const masked = \(v\) => \(on\("R4-unresolved"\) \? null : v\);/const masked = (v) => v;/'
v bound+0.02 's/reserve < line - 0\.5\)/reserve < line - 0.52)/'
v bound-0.02 's/reserve < line - 0\.5\)/reserve < line - 0.48)/'
cp $O $F; cmp -s $O $F && echo "restored equal" >> $LOG; echo DONE >> $LOG
