#!/bin/bash
# inner.sh <what: rig-plant|control> <port> <label> -- <cmd...>: run INSIDE one guarded call: start the
# preview, assert the served identity, run the command (exit to a file), stop the preview. no rm, no set -e
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/ACC-SIX
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-45/web/frontend
C=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-control/web/frontend
what=$1; port=$2; label=$3; shift 4
if [ "$what" = control ]; then
  (cd $C && exec npx vite preview --config .vite-control.config.ts --outDir dist --host 127.0.0.1 --port $port --strictPort) > $S/logs/srv-$label.log 2>&1 &
  want=$(ls $C/dist/assets | grep '^index-.*\.js$'); css=$(ls $C/dist/assets | grep '^index-.*\.css$'); cssb=$(stat -f %z $C/dist/assets/$css)
else
  rig=${what%%-*}; if [ $rig = tree ]; then R=$W; else R=$S/arch/$rig/web/frontend; fi
  (cd $R && PLANT=${what#*-} exec npx vite preview --config $S/b-$rig.mts --outDir $S/dist/$what --host 127.0.0.1 --port $port --strictPort) > $S/logs/srv-$label.log 2>&1 &
  want=$(ls $S/dist/$what/assets | grep '^index-.*\.js$'); css=$(ls $S/dist/$what/assets | grep '^index-.*\.css$'); cssb=$(stat -f %z $S/dist/$what/assets/$css)
fi
spid=$!
for i in $(seq 1 90); do got=$(curl -s --max-time 3 http://127.0.0.1:$port/ | grep -o 'index-[A-Za-z0-9_-]*\.js' | head -1); [ -n "$got" ] && break; sleep 1; done
gcss=$(curl -s --max-time 5 http://127.0.0.1:$port/ | grep -o 'index-[A-Za-z0-9_-]*\.css' | head -1); gb=$(curl -s --max-time 10 http://127.0.0.1:$port/assets/$gcss | wc -c | tr -d ' ')
echo "IDENT $label $what :$port served $got want $want $([ "$got" = "$want" ] && echo IDENTITY-OK || echo IDENTITY-FAIL) css $gcss $gb B (disk $cssb)"
if [ "$got" = "$want" ]; then
  echo "RUN $label start $(date +%T) load $(uptime | sed 's/.*averages: //') zone $(tail -1 ~/.claude/guard/log/zone.log | grep -o 'inuse=[0-9]*')"
  BASE=http://127.0.0.1:$port "$@" > $S/logs/run-$label.log 2>&1
  echo $? > $S/logs/run-$label.exit
else
  echo 99 > $S/logs/run-$label.exit
fi
echo "RUN $label exit $(cat $S/logs/run-$label.exit) end $(date +%T) load $(uptime | sed 's/.*averages: //') zone $(tail -1 ~/.claude/guard/log/zone.log | grep -o 'inuse=[0-9]*')"
kill $spid 2>/dev/null; pkill -P $spid 2>/dev/null
