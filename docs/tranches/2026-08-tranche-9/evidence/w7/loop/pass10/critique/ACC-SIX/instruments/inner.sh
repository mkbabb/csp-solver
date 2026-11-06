#!/bin/bash
# inner.sh <what> <label> -- <cmd...> : INSIDE one guarded call; preview up, identity asserted, cmd run (exit to a file), preview stopped. no rm, no set -e
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/crit-ACC-SIX
C=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-control/web/frontend
U=$S/a-wave/web/frontend; T=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-45/web/frontend
what=$1; label=$2; shift 3
if [ "$what" = control ]; then port=4250; D=$C/dist
  (cd $C && exec npx vite preview --config .vite-control.config.ts --outDir dist --host 127.0.0.1 --port $port --strictPort) > $S/logs/srv-$label.log 2>&1 &
else port=4237; rig=${what%%-*}; R=$U; [ $rig = tree ] && R=$T; D=$S/dist/$what
  (cd $R && exec npx vite preview --config $S/b-$rig.mts --outDir $D --host 127.0.0.1 --port $port --strictPort) > $S/logs/srv-$label.log 2>&1 &
fi
spid=$!
want=$(ls $D/assets | grep '^index-.*\.js$'); css=$(ls $D/assets | grep '^index-.*\.css$'); cssb=$(stat -f %z $D/assets/$css)
for i in $(seq 1 90); do got=$(curl -s --max-time 3 http://127.0.0.1:$port/ | grep -o 'index-[A-Za-z0-9_-]*\.js' | head -1); [ -n "$got" ] && break; sleep 1; done
gcss=$(curl -s --max-time 5 http://127.0.0.1:$port/ | grep -o 'index-[A-Za-z0-9_-]*\.css' | head -1); gb=$(curl -s --max-time 10 http://127.0.0.1:$port/assets/$gcss | wc -c | tr -d ' ')
echo "IDENT $label $what :$port served $got want $want $([ "$got" = "$want" ] && echo IDENTITY-OK || echo IDENTITY-FAIL) css $gcss $gb B (disk $cssb)"
if [ "$got" = "$want" ]; then
  echo "RUN $label start $(date +%T) load $(uptime | sed 's/.*averages: //') zone $(tail -1 ~/.claude/guard/log/zone.log | grep -o 'inuse=[0-9]*')"
  BASE=http://127.0.0.1:$port PWOUT=$S/pw/$label "$@" > $S/logs/run-$label.log 2>&1
  echo $? > $S/logs/run-$label.exit
else echo 99 > $S/logs/run-$label.exit; fi
echo "RUN $label exit $(cat $S/logs/run-$label.exit) end $(date +%T) load $(uptime | sed 's/.*averages: //') zone $(tail -1 ~/.claude/guard/log/zone.log | grep -o 'inuse=[0-9]*')"
pkill -P $spid 2>/dev/null; kill $spid 2>/dev/null; sleep 1
