#!/bin/bash
echo $$ > /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/MRK-LIVE/lane.pid
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-35/web/frontend
exec npx vite preview --config /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/MRK-LIVE/inst/vite.build.mts --outDir /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/MRK-LIVE/${DIST:-dist} --host 127.0.0.1 --port 4238 --strictPort
