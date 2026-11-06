#!/bin/zsh
# The WebKit column, ONE guarded --exclusive webkit run. A server reaped at its own 90-min guard is
# restarted INSIDE this run (contained by this run's guard, cleaned up with it).
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/ACC-FIVE
T=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-41/web/frontend
C=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-control/web/frontend
O=$S/logs/battery-webkit.log
up() { [ "$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:$1/)" = 200 ]; }
if ! up 4236; then (cd $T && npx vite --config .acc5p10.vite.mts --host 127.0.0.1 --port 4236 --strictPort > $S/logs/serve-tree-wk.log 2>&1 &); for k in $(seq 1 60); do up 4236 && break; sleep 1; done; echo "RESTARTED dev :4236 inside the run $(date +%T)" >> $O; fi
if ! up 4258; then (cd $C && npx vite preview --config .vite-control.config.ts --outDir dist --host 127.0.0.1 --port 4258 --strictPort > $S/logs/serve-control-wk.log 2>&1 &); for k in $(seq 1 60); do up 4258 && break; sleep 1; done; echo "RESTARTED control :4258 inside the run $(date +%T)" >> $O; fi
LP=$(lsof -nP -iTCP:4236 -sTCP:LISTEN -t | head -1); echo $LP > $S/pids/tree.listener
$S/battery.sh webkit
$S/extras.sh webkit
$S/pi.sh
echo "WK-ALL DONE $(date +%T)" >> $O
