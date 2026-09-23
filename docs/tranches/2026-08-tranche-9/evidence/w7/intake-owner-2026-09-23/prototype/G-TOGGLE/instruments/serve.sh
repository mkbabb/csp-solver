#!/bin/zsh
# serve.sh <outDir> <port> <name> — vite preview on 127.0.0.1, strict port, pid recorded
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_b6676cd9-8c6-14/web/frontend
nohup ./node_modules/.bin/vite preview --config .intake/build.mts --outDir $1 --host 127.0.0.1 --port $2 --strictPort > ../../.gt/serve-$3.log 2>&1 &
echo $! > ../../.gt/pid-$3
echo "started $3 pid $(cat ../../.gt/pid-$3) port $2"
