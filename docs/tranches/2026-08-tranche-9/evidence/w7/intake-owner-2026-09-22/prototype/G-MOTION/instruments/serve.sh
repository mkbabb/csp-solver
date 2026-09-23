#!/bin/zsh
# usage: serve.sh <outDir> <port> <name>  — vite preview on 127.0.0.1, pid recorded
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_3b66f064-970-16/web/frontend
D=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_3b66f064-970-16/web/frontend/.gmotion
nohup ./node_modules/.bin/vite preview --config .intake/build.mts --outDir "$1" --host 127.0.0.1 --port "$2" --strictPort > "$D/serve-$3.log" 2>&1 &
echo $! > "$D/serve-$3.pid"
sleep 3
lsof -nP -iTCP:"$2" -sTCP:LISTEN | tail -n +2 | awk '{print $2}' > "$D/serve-$3.listen.pid"
echo "pid $(cat $D/serve-$3.pid) listener $(cat $D/serve-$3.listen.pid)"
cat "$D/serve-$3.log"
