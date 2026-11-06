#!/bin/zsh
# π (driver v2) both engines on the tree's faithful build, then WebKit's share 0.97 arm on the dev graph.
# ONE guarded --exclusive webkit run; every server it needs is started INSIDE it and stopped by PID.
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/ACC-FIVE
T=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-41/web/frontend
C=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-control/web/frontend
TB=http://127.0.0.1:4236; CB=http://127.0.0.1:4258; R=$S/run.sh
O=$S/logs/battery-pi2.log; echo "OPEN pi2 $(date +%T) load $(uptime | sed 's/.*averages: //') $(tail -1 ~/.claude/guard/log/zone.log | grep -o 'inuse=[0-9]*')" >> $O
up() { [ "$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:$1/)" = 200 ]; }
stop4236() { PL=$(lsof -nP -iTCP:4236 -sTCP:LISTEN -t | head -1); [ -n "$PL" ] || return; PC=$(lsof -a -p $PL -d cwd -Fn 2>/dev/null | grep ^n | cut -c2-); if [ "$PC" = "$T" ]; then kill $PL; echo "STOPPED :4236 pid $PL $(date +%T)" >> $O; else echo "NOT MINE :4236 pid $PL cwd $PC" >> $O; fi; sleep 3; }
if ! up 4258; then (cd $C && npx vite preview --config .vite-control.config.ts --outDir dist --host 127.0.0.1 --port 4258 --strictPort > $S/logs/serve-control-pi2.log 2>&1 &); for k in $(seq 1 60); do up 4258 && break; sleep 1; done; echo "STARTED control :4258 inside the run $(date +%T)" >> $O; fi
stop4236
(cd $T && npx vite preview --config .acc5p10.vite.mts --outDir $S/dist-tree --host 127.0.0.1 --port 4236 --strictPort > $S/logs/serve-pi2.log 2>&1 &); for k in $(seq 1 60); do up 4236 && break; sleep 1; done
echo "PI tree $(curl -s $TB/ | grep -o 'index-[A-Za-z0-9_-]*\.js' | head -1) $(curl -s $TB/ | grep -o 'index-[A-Za-z0-9_-]*\.css' | head -1) control $(curl -s $CB/ | grep -o 'index-[A-Za-z0-9_-]*\.js' | head -1) $(date +%T)" >> $O
cp $S/probe/acc5-pi.spec.ts $T/e2e/acc5-pi.spec.ts
for pe in webkit chromium; do $R pi2-$pe $TB 1 acc5-pi.spec.ts "PI" $pe TB=$TB CB=$CB; grep -h "^PI " $S/logs/pi2-$pe-$pe-1.raw | cut -c1-1600 >> $O; done
mv $T/e2e/acc5-pi.spec.ts $S/trash/acc5-pi.spec.ts.$(date +%H%M%S)
stop4236
(cd $T && npx vite --config .acc5p10.vite.mts --host 127.0.0.1 --port 4236 --strictPort > $S/logs/serve-tree-pi2.log 2>&1 &); for k in $(seq 1 60); do up 4236 && break; sleep 1; done
$R g10-share097-webkit $TB 1 front-rate.spec.ts "G10: every" webkit G10_FLOOR_SHARE=0.97
grep -E "^RUN|SHARE|CLAUSES" $S/logs/g10-share097-webkit.log >> $O
stop4236
CL=$(lsof -nP -iTCP:4258 -sTCP:LISTEN -t | head -1); CC=$(lsof -a -p $CL -d cwd -Fn 2>/dev/null | grep ^n | cut -c2-); [ "$CC" = "$C" ] && grep -q "STARTED control" $O && kill $CL && echo "STOPPED control :4258 pid $CL (started in this run) $(date +%T)" >> $O
echo "DONE pi2 $(date +%T) load $(uptime | sed 's/.*averages: //')" >> $O
