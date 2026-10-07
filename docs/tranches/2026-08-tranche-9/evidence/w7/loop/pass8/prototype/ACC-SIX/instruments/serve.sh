#!/bin/bash
# serve.sh <dist-name|control> : one preview on its port, PID recorded; no kill of anything not recorded here
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/six8
what=$1
if [ "$what" = control ]; then
  port=4250; cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-control/web/frontend
  nohup npx vite preview --config .vite-control.config.ts --outDir dist --host 127.0.0.1 --port $port --strictPort > $S/logs/serve-control.log 2>&1 &
else
  port=4237; cd $S/bt/web/frontend
  nohup npx vite preview --config $S/cfg/build.mts --outDir $S/dist-$what --host 127.0.0.1 --port $port --strictPort > $S/logs/serve-$what.log 2>&1 &
fi
echo "$! $what $port" >> $S/pids.txt
for i in $(seq 1 30); do curl -s http://127.0.0.1:$port/ | grep -o 'index-[A-Za-z0-9_-]*\.js' | head -1 && break; sleep 1; done
