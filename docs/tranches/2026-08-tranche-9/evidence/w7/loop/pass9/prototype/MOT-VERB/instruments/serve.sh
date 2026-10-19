#!/bin/bash
# serve.sh tree <dist-tag> | control : vite preview, PID recorded in $S/pids.txt
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/MOT-VERB
if [ "$1" = control ]; then
  cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-control/web/frontend
  nohup npx vite preview --config .vite-control.config.ts --outDir dist --host 127.0.0.1 --port 4247 --strictPort > $S/logs/serve-control.log 2>&1 &
  echo "control $! $(date +%T)" >> $S/pids.txt
else
  cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-59/web/frontend
  nohup npx vite preview --config .vite-verb9.config.mts --outDir $S/dist-$2 --host 127.0.0.1 --port 4246 --strictPort > $S/logs/serve-tree-$2.log 2>&1 &
  echo "tree-$2 $! $(date +%T)" >> $S/pids.txt
fi
