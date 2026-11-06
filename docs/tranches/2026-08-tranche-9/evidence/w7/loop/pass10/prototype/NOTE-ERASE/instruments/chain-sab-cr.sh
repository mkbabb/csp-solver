#!/bin/bash
# chain-sab-cr.sh - the chromium teeth battery re-run (the first died on its webServer cwd), after chain-final; its own guarded call.
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/NOTE-ERASE
O=$S/logs/chain-sab-cr.txt
while ! grep -q '^FIN\|^STOP' $S/logs/chain-final.txt 2>/dev/null; do sleep 20; done
z=$(tail -1 ~/.claude/guard/log/zone.log | grep -oE 'inuse=[0-9]+' | cut -d= -f2); echo "$(date +%T) sab-chromium zone=$z load=$(uptime | sed 's/.*averages: //')" >> $O
[ "$z" -lt 8000000 ] || { echo "STOP zone $z: sab-chromium UNREAD" >> $O; exit 9; }
(~/.claude/guard/guarded --timeout 40 -- bash $S/bin/sab-battery.sh chromium 4248 > $S/logs/sab-chromium.run.log 2>&1); echo "sab-chromium guarded exit=$?" >> $O
echo "FIN $(date +%T)" >> $O
