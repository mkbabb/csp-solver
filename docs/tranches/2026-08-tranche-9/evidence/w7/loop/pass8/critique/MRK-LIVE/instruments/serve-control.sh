#!/bin/bash
echo $$ > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critlive8/control.pid
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-control/web/frontend
exec npx vite preview --config .vite-control.config.ts --outDir dist --host 127.0.0.1 --port 4251 --strictPort
