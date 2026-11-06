#!/bin/bash
# chain-ext2.sh - row 4 attempt 2 (default --disable-extensions dropped), after chain-sab-cr; its own guarded call.
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/NOTE-ERASE
O=$S/logs/chain-ext2.txt
while ! grep -q '^FIN\|^STOP' $S/logs/chain-sab-cr.txt 2>/dev/null; do sleep 20; done
z=$(tail -1 ~/.claude/guard/log/zone.log | grep -oE 'inuse=[0-9]+' | cut -d= -f2); echo "$(date +%T) ext2 zone=$z load=$(uptime | sed 's/.*averages: //')" >> $O
[ "$z" -lt 8000000 ] || { echo "STOP zone $z: ext2 UNREAD" >> $O; exit 9; }
(~/.claude/guard/guarded --timeout 10 -- bash $S/bin/ext-battery2.sh > $S/logs/ext2-chromium.log 2>&1); echo "ext2 guarded exit=$?" >> $O
echo "FIN $(date +%T)" >> $O
