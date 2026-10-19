#!/bin/bash
echo $$ > /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/MRK-LIVE/control.pid
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-control/web/frontend
exec npx vite preview --config .vite-control.config.ts --outDir dist --host 127.0.0.1 --port 4253 --strictPort
