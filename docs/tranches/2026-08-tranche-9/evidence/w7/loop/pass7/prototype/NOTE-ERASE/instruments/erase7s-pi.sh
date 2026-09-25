#!/bin/bash
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad; F=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-47/web/frontend
PORT=""; for p in 4237 4236 4235 4234 4243 4245 4246; do lsof -nP -iTCP:$p -sTCP:LISTEN -t >/dev/null || { PORT=$p; break; }; done
cd $F; nohup npx vite preview --config .erase7/preview.mts --outDir $S/erasecrit6-dist --host 127.0.0.1 --port $PORT --strictPort > $S/erase7s-logs/serve-p6.log 2>&1 & WR=$!
for i in $(seq 1 60); do curl -s http://127.0.0.1:$PORT/ | grep -q index-B5bclKNTuHnj.js && break; sleep 0.5; done
LP=$(lsof -nP -iTCP:$PORT -sTCP:LISTEN -t | head -1); PP=$(ps -o ppid= -p $LP | tr -d ' '); PPP=$(ps -o ppid= -p $PP | tr -d ' ')
echo "p6 :$PORT served=$(curl -s http://127.0.0.1:$PORT/ | grep -oE 'index-[A-Za-z0-9_-]+\.js' | head -1) listener=$LP wrapper=$WR parents=$PP,$PPP load=$(uptime | sed 's/.*averages: //')"
P6_PORT=$PORT npx playwright test --config .erase7/pw.probe.config.ts pi.probe.ts > $S/erase7s-logs/pi.log 2>&1; echo "PI exit=$?"
{ [ "$PP" = "$WR" ] || [ "$PPP" = "$WR" ] || [ "$LP" = "$WR" ]; } && kill $LP && echo "killed own $LP" || echo "NOT killing $LP (not mine)"
echo PIDONE
