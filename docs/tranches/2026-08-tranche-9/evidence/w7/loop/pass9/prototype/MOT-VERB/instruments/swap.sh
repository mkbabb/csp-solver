#!/bin/bash
# swap.sh <dist-tag> : stop MY :4246 listener (cwd-checked: the §13 tree) and serve dist-<tag> there
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/MOT-VERB
T=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-59/web/frontend
L=$(lsof -nP -iTCP:4246 -sTCP:LISTEN -t 2>/dev/null | head -1)
if [ -n "$L" ]; then
  C=$(lsof -a -p $L -d cwd 2>/dev/null | tail -1 | awk '{print $NF}')
  if [ "$C" != "$T" ]; then echo "4246 held by $L cwd $C — NOT MINE, stop"; exit 9; fi
  P=$(ps -o ppid= -p $L | tr -d ' '); kill $L; kill $P 2>/dev/null; echo "killed listener $L wrapper $P $(date +%T)" >> $S/pids.txt
  for i in 1 2 3 4 5 6 7 8 9 10; do lsof -nP -iTCP:4246 -sTCP:LISTEN -t >/dev/null 2>&1 || break; sleep 0.5; done
fi
cd $T && nohup npx vite preview --config .vite-verb9.config.mts --outDir $S/dist-$1 --host 127.0.0.1 --port 4246 --strictPort > $S/logs/serve-tree-$1.log 2>&1 &
W=$!
for i in $(seq 1 40); do curl -s http://127.0.0.1:4246/ | grep -q index- && break; sleep 0.5; done
N=$(lsof -nP -iTCP:4246 -sTCP:LISTEN -t | head -1)
echo "tree-$1 wrapper $W listener $N $(date +%T)" >> $S/pids.txt
echo "serving $(curl -s http://127.0.0.1:4246/ | grep -o 'index-[A-Za-z0-9_-]*\.js') wrapper $W listener $N"
