#!/bin/bash
# chain-wk.sh - the lane's WEBKIT rows, queued LAST (LAWS P9 §B), strictly serial, each its own guarded --exclusive webkit call.
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/NOTE-ERASE
O=$S/logs/chain-wk.txt
zone() { tail -1 ~/.claude/guard/log/zone.log | grep -oE 'inuse=[0-9]+' | cut -d= -f2; }
gate() { z=$(zone); echo "$(date +%T) $1 zone=$z load=$(uptime | sed 's/.*averages: //')" >> $O; [ "$z" -lt 8000000 ] || { echo "STOP zone $z >= 8M: $1 and every later row UNREAD" >> $O; exit 9; }; }
while ! grep -q '^FIN' $S/logs/chain-cr.txt 2>/dev/null; do sleep 20; done
gate t10-wk
$S/bin/run-spec-ws.sh /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-47/web/frontend 4240 $S/dist-t10 .erase10-build.mts t10-wk webkit -g "drop clock" --repeat-each 5; echo "t10-wk $(cat $S/logs/spec-t10-wk.exit)" >> $O
gate u10-wk
$S/bin/run-spec-ws.sh /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/NOTE-ERASE/copies/u10f/web/frontend 4240 $S/dist-u10 .erase10-build.mts u10-wk webkit -g "drop clock" --repeat-each 5; echo "u10-wk $(cat $S/logs/spec-u10-wk.exit)" >> $O
gate sab-webkit
(~/.claude/guard/guarded --exclusive webkit --timeout 40 -- bash $S/bin/sab-battery.sh webkit 4248 > $S/logs/sab-webkit.run.log 2>&1); echo "sab-webkit guarded exit=$?" >> $O
gate ctl-webkit
SERVE_CWD=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-control/web/frontend $S/bin/run-spec-ws.sh /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-47/web/frontend 4248 /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-control/web/frontend/dist .vite-control.config.ts ctl-wk webkit -g "drop clock"; echo "ctl-wk $(cat $S/logs/spec-ctl-wk.exit)" >> $O
gate r8-webkit
(cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/NOTE-ERASE/copies/u10f/web/frontend && R8_ARMS=u10:4240,ctl:4248 ~/.claude/guard/guarded --exclusive webkit --timeout 30 -- npx playwright test --config .erase10/pw.probe.ws.config.ts --project=webkit --workers=1 r8.probe.ts > $S/logs/probe-r8-wk.log 2>&1); echo "r8-webkit exit=$?" >> $O
echo "FIN $(date +%T)" >> $O
