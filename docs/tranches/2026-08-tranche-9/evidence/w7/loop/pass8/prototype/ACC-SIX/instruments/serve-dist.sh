#!/bin/bash
# serve-dist.sh <label> <distdir> : a preview of ANY scratch dist on 4237 (from the out-of-tree copy), PID recorded
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/six8
cd $S/bt/web/frontend
nohup npx vite preview --config $S/cfg/build.mts --outDir $2 --host 127.0.0.1 --port 4237 --strictPort > $S/logs/serve-$1.log 2>&1 &
echo "$! $1 4237" >> $S/pids.txt
for i in $(seq 1 40); do curl -s http://127.0.0.1:4237/ | grep -o 'index-[A-Za-z0-9_-]*\.js' | head -1 && break; sleep 1; done
