#!/bin/bash
# serve-dev.sh : the tree's DEV server (out-of-tree copy, private cacheDir) on 4237, PID recorded as 'dev'
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/six8
cd $S/bt/web/frontend
PLANT=none nohup npx vite --config $S/cfg/build.mts --host 127.0.0.1 --port 4237 --strictPort > $S/logs/serve-dev.log 2>&1 &
echo "$! dev 4237" >> $S/pids.txt
for i in $(seq 1 60); do curl -s http://127.0.0.1:4237/src/pencil/grid/gridPaths.ts | grep -q frontGate && { echo dev-up; break; }; sleep 1; done
