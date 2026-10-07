#!/bin/bash
# critic's guarded server: up <name> <port> <fe> <dist> | down <name>. Never frees a held port.
C=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit-erase8
R=$C/servers; mkdir -p $R
ancestors() { local p=$1; while [ -n "$p" ] && [ "$p" != 1 ] && [ "$p" != 0 ]; do echo $p; p=$(ps -o ppid= -p $p | tr -d ' '); done; }
served() { curl -s --max-time 3 http://127.0.0.1:$1/ | grep -oE 'index-[A-Za-z0-9_-]+\.js' | head -1; }
case $1 in
up) name=$2 port=$3 fe=$4 dist=$5 cfg=${6:-.critE8.mts}
  holder=$(lsof -nP -iTCP:$port -sTCP:LISTEN -t 2>/dev/null)
  if [ -n "$holder" ]; then echo "PORT $port HELD by $holder — sibling, not freed"; exit 3; fi
  want=$(ls $dist/assets | grep -E '^index-.*\.js$')
  (cd $fe && nohup npx vite preview --config $cfg --outDir $dist --host 127.0.0.1 --port $port --strictPort > $C/logs/serve-$name.log 2>&1) > /dev/null 2>&1 < /dev/null &
  wrapper=$!
  for i in $(seq 1 100); do [ "$(served $port)" = "$want" ] && break; sleep 0.5; done
  listener=$(lsof -nP -iTCP:$port -sTCP:LISTEN -t 2>/dev/null | head -1); got=$(served $port)
  if [ "$got" != "$want" ] || ! ancestors "$listener" | grep -qx "$wrapper"; then echo "UP FAILED $name got=$got want=$want"; exit 4; fi
  echo "$port $wrapper $listener $fe $want" > $R/$name; echo "UP $name :$port wrapper=$wrapper listener=$listener served=$got";;
down) name=$2; read port wrapper listener fe want < $R/$name
  now=$(lsof -nP -iTCP:$port -sTCP:LISTEN -t 2>/dev/null | head -1); got=$(served $port)
  if [ "$now" != "$listener" ] || ! ancestors "$listener" | grep -qx "$wrapper" || [ "$got" != "$want" ]; then echo "DOWN $name REFUSED now=$now rec=$listener got=$got"; exit 6; fi
  kill $listener $wrapper 2>/dev/null; sleep 1; mv $R/$name $R/$name.done; echo "DOWN $name killed $listener/$wrapper";;
esac
