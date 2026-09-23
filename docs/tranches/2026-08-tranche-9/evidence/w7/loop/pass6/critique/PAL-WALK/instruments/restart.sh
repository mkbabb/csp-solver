#!/bin/bash
cd /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw6/rep/web/frontend || exit 1
old=$(lsof -nP -iTCP:4236 -sTCP:LISTEN -t 2>/dev/null | head -1)
[ -n "$old" ] && kill $old
for i in $(seq 1 30); do lsof -nP -iTCP:4236 -sTCP:LISTEN -t >/dev/null 2>&1 || break; sleep 0.5; done
nohup npx vite --config /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw6/vite.dev.mts --host 127.0.0.1 --port 4236 --strictPort >> /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw6/logs/dev4236.log 2>&1 &
for i in $(seq 1 60); do curl -s -m 2 http://127.0.0.1:4236/ >/dev/null && break; sleep 0.5; done
new=$(lsof -nP -iTCP:4236 -sTCP:LISTEN -t | head -1); echo "4236 $new (was $old) $(date +%T)" >> /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critpw6/pids.txt
curl -s -m 90 http://127.0.0.1:4236/src/games/shared/GameBoard.vue > /dev/null
