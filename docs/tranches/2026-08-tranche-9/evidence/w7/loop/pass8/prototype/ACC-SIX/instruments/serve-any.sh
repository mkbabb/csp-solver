#!/bin/bash
# serve-any.sh <label> <distdir> : free 4237 (own listener only), preview <distdir>, and ASSERT the served identity is that dist's
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/six8
bash $S/cfg/stop-port.sh || exit 1
want=$(ls $2/assets | grep -E '^index-.*\.js$')
cd $S/bt/web/frontend
nohup npx vite preview --config $S/cfg/build.mts --outDir $2 --host 127.0.0.1 --port 4237 --strictPort > $S/logs/serve-$1.log 2>&1 &
echo "$! $1 4237" >> $S/pids.txt
for i in $(seq 1 40); do got=$(curl -s http://127.0.0.1:4237/ | grep -o 'index-[A-Za-z0-9_-]*\.js' | head -1); [ "$got" = "$want" ] && { echo "SERVING $1 $got"; exit 0; }; sleep 1; done
echo "SERVE-FAILED $1 want $want got $got"; exit 1
