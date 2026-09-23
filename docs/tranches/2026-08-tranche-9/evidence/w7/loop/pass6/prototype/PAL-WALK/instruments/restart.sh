#!/bin/bash
# restart.sh — kill the lane's dev listener on 4244 by its recorded PID, relaunch frozen, record the new PID.
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_308fa864-c94-1/web/frontend || exit 1
old=$(lsof -nP -iTCP:4244 -sTCP:LISTEN -t 2>/dev/null | head -1)
[ -n "$old" ] && kill $old
for i in $(seq 1 30); do lsof -nP -iTCP:4244 -sTCP:LISTEN -t >/dev/null 2>&1 || break; sleep 0.5; done
nohup npx vite --config .palwalk6/vite.frozen.mts --host 127.0.0.1 --port 4244 --strictPort >> /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/palwalk6/logs/dev4244.log 2>&1 &
for i in $(seq 1 60); do curl -s -m 2 http://127.0.0.1:4244/ >/dev/null && break; sleep 0.5; done
new=$(lsof -nP -iTCP:4244 -sTCP:LISTEN -t | head -1); echo "4244 $new (was $old) $(date +%T)" >> /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/palwalk6/pids.txt
curl -s -m 60 http://127.0.0.1:4244/src/games/shared/GameBoard.vue > /dev/null
