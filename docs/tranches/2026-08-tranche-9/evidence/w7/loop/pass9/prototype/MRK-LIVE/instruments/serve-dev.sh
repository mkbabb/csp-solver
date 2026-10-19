#!/bin/bash
echo $$ > /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/MRK-LIVE/dev.pid
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-35/web/frontend
exec npx vite --config /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/MRK-LIVE/inst/vite.dev.mts --host 127.0.0.1 --port 4238 --strictPort
