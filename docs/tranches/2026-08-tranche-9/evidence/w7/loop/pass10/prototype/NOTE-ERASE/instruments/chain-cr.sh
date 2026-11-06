#!/bin/bash
# chain-cr.sh - the lane's remaining CHROMIUM rows, strictly serial, each its own guarded call; zone read before each.
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/NOTE-ERASE
O=$S/logs/chain-cr.txt
zone() { tail -1 ~/.claude/guard/log/zone.log | grep -oE 'inuse=[0-9]+' | cut -d= -f2; }
gate() { z=$(zone); echo "$(date +%T) $1 zone=$z load=$(uptime | sed 's/.*averages: //')" >> $O; [ "$z" -lt 8000000 ] || { echo "STOP zone $z >= 8M: $1 UNREAD" >> $O; exit 9; }; }
# wait for the union run to finish (never two of mine at once)
while [ ! -f $S/logs/spec-u10-cr.exit ]; do sleep 20; done
gate sab-chromium
(~/.claude/guard/guarded --timeout 40 -- bash $S/bin/sab-battery.sh chromium 4248 > $S/logs/sab-chromium.run.log 2>&1); echo "sab-chromium guarded exit=$?" >> $O
gate ctl-chromium
SERVE_CWD=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-control/web/frontend $S/bin/run-spec-ws.sh /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-47/web/frontend 4248 /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-control/web/frontend/dist .vite-control.config.ts ctl-cr chromium -g "drop clock"; echo "ctl-cr done $(cat $S/logs/spec-ctl-cr.exit)" >> $O
gate ext-chromium
(~/.claude/guard/guarded --timeout 10 -- bash $S/bin/ext-battery.sh > $S/logs/ext-chromium.log 2>&1); echo "ext guarded exit=$?" >> $O
gate r8-chromium
mkdir -p /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/NOTE-ERASE/copies/u10f/web/frontend/.erase10; cp $S/probes/pw.probe.ws.config.ts $S/probes/r8.probe.ts /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/NOTE-ERASE/copies/u10f/web/frontend/.erase10/
(cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/NOTE-ERASE/copies/u10f/web/frontend && R8_ARMS=u10:4240,ctl:4248 ~/.claude/guard/guarded --timeout 30 -- npx playwright test --config .erase10/pw.probe.ws.config.ts --project=chromium --workers=1 r8.probe.ts > $S/logs/probe-r8-cr.log 2>&1); echo "r8-chromium exit=$?" >> $O
echo "FIN $(date +%T)" >> $O
