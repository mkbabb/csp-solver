#!/bin/bash
# usage: serve.sh <label> <dir web/frontend> <port> <config> [preview]
C=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit-acc5
L=$1; D=$2; P=$3; CFG=$4; MODE=$5
cd $D
if [ "$MODE" = preview ]; then
  nohup npx vite preview --config $CFG --outDir dist --host 127.0.0.1 --port $P --strictPort > $C/logs/serve-$L.log 2>&1 &
else
  nohup npx vite --config $CFG --host 127.0.0.1 --port $P --strictPort > $C/logs/serve-$L.log 2>&1 &
fi
echo $! > $C/pids/$L.wrapper
for k in $(seq 1 80); do [ "$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:$P/)" = 200 ] && break; sleep 1; done
LP=$(lsof -nP -iTCP:$P -sTCP:LISTEN -t 2>/dev/null | head -1); echo $LP > $C/pids/$L.listener
echo "SERVE $L port $P wrapper $(cat $C/pids/$L.wrapper) listener $LP cwd $(lsof -a -p $LP -d cwd -Fn 2>/dev/null | grep ^n | cut -c2-) $(date +%T)"
