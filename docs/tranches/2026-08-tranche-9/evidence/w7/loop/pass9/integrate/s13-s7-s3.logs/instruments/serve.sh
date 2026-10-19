#!/bin/bash
# serve.sh tree|ctrl : start the lane's preview under the guard if its port does not answer; PID recorded
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/integrate-s13-s7-s3
G=~/.claude/guard/guarded
if [ "$1" = tree ]; then port=4255; dir=$S/tree/web/frontend; cfg=.vite-s13int.config.ts; else port=4256; dir=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-control/web/frontend; cfg=.vite-control.config.ts; fi
if curl -s -o /dev/null -m 5 http://127.0.0.1:$port/; then exit 0; fi
if lsof -nP -iTCP:$port -sTCP:LISTEN >/dev/null; then echo "PORT $port HELD BY A SIBLING"; exit 3; fi
cd $dir && nohup $G --timeout 90 -- npx vite preview --config $cfg --outDir dist --host 127.0.0.1 --port $port --strictPort > $S/logs/serve-$1.$(date +%H%M%S).log 2>&1 &
echo "$! $(date +%T) $1" >> $S/logs/serve-pids.txt
for i in $(seq 1 60); do curl -s -o /dev/null -m 3 http://127.0.0.1:$port/ && { echo "up $1 :$port after ${i}x2s"; exit 0; }; sleep 2; done
echo "SERVE FAIL $1"; exit 4
