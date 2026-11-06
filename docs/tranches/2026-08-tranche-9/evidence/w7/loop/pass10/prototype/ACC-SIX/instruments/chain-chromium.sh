#!/bin/bash
# chromium column after cy1: each step its own guarded call, sequential. no rm, no set -e
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/ACC-SIX
G=~/.claude/guard/guarded
z() { tail -1 ~/.claude/guard/log/zone.log | grep -o 'inuse=[0-9]*' | cut -d= -f2; }
until grep -q MULTI-DONE $S/logs/cy1-chromium.outer.log; do sleep 5; done
run() { label=$1; shift; zn=$(z); echo "CR $label queue $(date +%T) zone $zn load $(uptime | sed 's/.*averages: //')"; [ "$zn" -ge 8000000 ] && { echo "CR $label UNREAD zone $zn"; return; }; $G --timeout 90 -- "$@" > $S/logs/$label-chromium.outer.log 2>&1; echo "CR $label guarded exit $? $(date +%T)"; grep -E 'RUN .* exit' $S/logs/$label-chromium.outer.log; }
run cy2 $S/multi.sh cy2 chromium count-yield.spec.ts "" -- wave-none tree-none
run pl $S/plants-chromium.sh chromium
run ws1 $S/multi.sh ws1 chromium wash-step.spec.ts "" -- wave-none tree-none control
echo CHAIN-CHROMIUM-DONE
