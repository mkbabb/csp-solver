#!/bin/bash
# the WebKit column, each spec its own guarded --exclusive webkit call, run sequentially (never two queued at once). no rm, no set -e
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/ACC-SIX
G=~/.claude/guard/guarded
z() { tail -1 ~/.claude/guard/log/zone.log | grep -o 'inuse=[0-9]*' | cut -d= -f2; }
for step in "cy2 count-yield.spec.ts|wave-none tree-none control" "pl-life count-yield.spec.ts|wave-noseat tree-lift4|LIFE" "pl-fit count-yield.spec.ts|wave-len32 tree-len32|FIT-LONG|stays where it fits" "ws1 wash-step.spec.ts|wave-none tree-none control"; do
  head=${step%%|*}; rest=${step#*|}; whats=${rest%%|*}; g=""; [ "$rest" != "$whats" ] && g=${rest#*|}
  label=${head% *}; spec=${head#* }
  zn=$(z); echo "WK $label queue $(date +%T) zone $zn load $(uptime | sed 's/.*averages: //')"
  if [ "$zn" -ge 8000000 ]; then echo "WK $label UNREAD: zone $zn >= 8M, the owner must reboot"; continue; fi
  $G --exclusive webkit --timeout 90 -- $S/multi.sh $label webkit $spec "$g" -- $whats > $S/logs/$label-webkit.outer.log 2>&1
  echo "WK $label guarded exit $? $(date +%T)"; grep -E 'IDENT|RUN' $S/logs/$label-webkit.outer.log
done
echo CHAIN-WEBKIT-DONE
