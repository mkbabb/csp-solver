#!/bin/bash
# chain.sh <eng>: each step its own guarded call, sequential (never two of the lane's browsers at once). no rm, no set -e
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/crit-ACC-SIX
G=~/.claude/guard/guarded; eng=$1
EX=""; [ $eng = webkit ] && EX="--exclusive webkit"
z() { tail -1 ~/.claude/guard/log/zone.log | grep -o 'inuse=[0-9]*' | cut -d= -f2; }
for step in "cy|count-yield.spec.ts|-|union-none tree-none control" "pl|count-yield.spec.ts|LIFE|FIT-LONG|union-noseat union-len32" "nr|count-yield.spec.ts|-|union-norec" "ws|wash-step.spec.ts|-|union-none control"; do
  IFS='|' read -r label spec g1 g2 whats <<< "$step"
  if [ -z "$whats" ]; then whats=$g2; g=$g1; else g="$g1|$g2"; fi
  zn=$(z); echo "STEP $label-$eng queue $(date +%T) zone $zn load $(uptime | sed 's/.*averages: //')"
  if [ "$zn" -ge 8000000 ]; then echo "STEP $label-$eng UNREAD: zone $zn >= 8M, the owner must reboot"; continue; fi
  $G $EX --timeout 60 -- $S/multi.sh $label $eng $spec "$g" -- $whats > $S/logs/$label-$eng.outer.log 2>&1
  echo "STEP $label-$eng guarded exit $? $(date +%T)"; grep -E '^IDENT|^RUN' $S/logs/$label-$eng.outer.log
done
echo CHAIN-DONE $eng
