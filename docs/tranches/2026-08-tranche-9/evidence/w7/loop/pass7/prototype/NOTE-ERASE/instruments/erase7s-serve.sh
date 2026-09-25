#!/bin/bash
# usage: erase7s-serve.sh <name> <port> <distdir>  — preview a dist through the tree's config; prints the LISTENER pid
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad; F=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-47/web/frontend
lsof -nP -iTCP:$2 -sTCP:LISTEN -t >/dev/null && { echo "PORT $2 HELD"; exit 1; }
ID=$(ls $3/assets | grep -E '^index-.*\.js$')
cd $F; nohup npx vite preview --config .erase7/preview.mts --outDir $3 --host 127.0.0.1 --port $2 --strictPort > $S/erase7s-logs/serve-$1.log 2>&1 &
for i in $(seq 1 60); do curl -s http://127.0.0.1:$2/ | grep -q "$ID" && break; sleep 0.5; done
echo "$1 :$2 served=$(curl -s http://127.0.0.1:$2/ | grep -oE 'index-[A-Za-z0-9_-]+\.js' | head -1) want=$ID listener=$(lsof -nP -iTCP:$2 -sTCP:LISTEN -t)"
