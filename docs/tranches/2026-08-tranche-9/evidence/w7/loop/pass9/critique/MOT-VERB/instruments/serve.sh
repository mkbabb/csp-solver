#!/bin/bash
# serve.sh <tag>|control : foreground vite preview (launched run_in_background); own PID recorded with cwd
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/crit-MOT-VERB
if [ "$1" = control ]; then
  cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-control/web/frontend
  echo "control $$ $(pwd) $(date +%T)" >> $S/logs/pids.txt
  exec npx vite preview --config .vite-control.config.ts --outDir dist --host 127.0.0.1 --port 4247 --strictPort
else
  cd $S/p-tree/web/frontend
  echo "tree-$1 $$ $(pwd) $(date +%T)" >> $S/logs/pids.txt
  exec npx vite preview --config .vite-critv9.config.mts --outDir $S/dist-$1 --host 127.0.0.1 --port 4246 --strictPort
fi
