#!/bin/bash
# chain-final.sh - chromium re-reads on the FINAL spec bytes (the struck time clauses), after the WebKit chain; serial, each its own guarded call.
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/NOTE-ERASE
O=$S/logs/chain-final.txt
zone() { tail -1 ~/.claude/guard/log/zone.log | grep -oE 'inuse=[0-9]+' | cut -d= -f2; }
gate() { z=$(zone); echo "$(date +%T) $1 zone=$z load=$(uptime | sed 's/.*averages: //')" >> $O; [ "$z" -lt 8000000 ] || { echo "STOP zone $z >= 8M: $1 UNREAD" >> $O; exit 9; }; }
while ! grep -q '^FIN\|^STOP' $S/logs/chain-wk.txt 2>/dev/null; do sleep 20; done
gate t10-cr2
$S/bin/run-spec-ws.sh /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-47/web/frontend 4240 $S/dist-t10 .erase10-build.mts t10-cr2 chromium -g "drop clock" --repeat-each 5; echo "t10-cr2 $(cat $S/logs/spec-t10-cr2.exit)" >> $O
gate u10-cr2
$S/bin/run-spec-ws.sh /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/NOTE-ERASE/copies/u10f/web/frontend 4240 $S/dist-u10 .erase10-build.mts u10-cr2 chromium -g "drop clock" --repeat-each 5; echo "u10-cr2 $(cat $S/logs/spec-u10-cr2.exit)" >> $O
echo "FIN $(date +%T)" >> $O
