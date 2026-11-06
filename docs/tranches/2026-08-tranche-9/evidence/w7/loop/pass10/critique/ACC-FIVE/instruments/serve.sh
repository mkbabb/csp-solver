#!/bin/zsh
# usage: serve.sh <label> <dir web/frontend> <port> <config> [preview]
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/crit-ACC-FIVE
L=$1; D=$2; P=$3; CFG=$4; MODE=$5
cd $D
echo "QUEUE $L $(date +%T)" >> $S/logs/serve-$L.state
if [ "$MODE" = preview ]; then
  nohup ~/.claude/guard/guarded --timeout 90 -- npx vite preview --config $CFG --outDir dist --host 127.0.0.1 --port $P --strictPort > $S/logs/serve-$L.log 2>&1 &
else
  nohup ~/.claude/guard/guarded --timeout 90 -- npx vite --config $CFG --host 127.0.0.1 --port $P --strictPort > $S/logs/serve-$L.log 2>&1 &
fi
echo $! > $S/pids/$L.wrapper
for k in $(seq 1 1500); do [ "$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:$P/)" = 200 ] && break; sleep 1; done
LP=$(lsof -nP -iTCP:$P -sTCP:LISTEN -t 2>/dev/null | head -1); echo $LP > $S/pids/$L.listener
echo "SERVE $L port $P wrapper $(cat $S/pids/$L.wrapper) listener $LP cwd $(lsof -a -p $LP -d cwd -Fn 2>/dev/null | grep ^n | cut -c2-) http $(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:$P/) $(date +%T)" >> $S/logs/serve-$L.state
wait
