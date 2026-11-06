#!/bin/bash
# NOTE-ERASE pass 10 guarded server. up <name> <port> <fe> <dist> <cfg> | down <name>
# up never frees a port (a held port exits 3, naming its holder); down kills only the recorded listener+wrapper
# after checking listener, ancestry, cwd and served identity.
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/NOTE-ERASE
R=$S/servers
ancestors() { local p=$1; while [ -n "$p" ] && [ "$p" != 1 ] && [ "$p" != 0 ]; do echo $p; p=$(ps -o ppid= -p $p | tr -d ' '); done; }
served() { curl -s --max-time 3 http://127.0.0.1:$1/ | grep -oE 'index-[A-Za-z0-9_-]+\.js' | head -1; }
case $1 in
up)
  name=$2 port=$3 fe=$4 dist=$5 cfg=$6
  holder=$(lsof -nP -iTCP:$port -sTCP:LISTEN -t 2>/dev/null)
  if [ -n "$holder" ]; then echo "PORT $port HELD by pid $holder (cwd $(lsof -a -p $holder -d cwd -Fn 2>/dev/null | sed -n 's/^n//p')) - not mine, not freed"; exit 3; fi
  want=$(ls $dist/assets | grep -E '^index-.*\.js$')
  (cd $fe && nohup ~/.claude/guard/guarded --timeout 90 -- npx vite preview --config $cfg --outDir $dist --host 127.0.0.1 --port $port --strictPort > $S/logs/serve-$name.log 2>&1) < /dev/null > /dev/null 2>&1 &
  wrapper=$!
  for i in $(seq 1 120); do [ "$(served $port)" = "$want" ] && break; sleep 0.5; done
  listener=$(lsof -nP -iTCP:$port -sTCP:LISTEN -t 2>/dev/null | head -1)
  got=$(served $port)
  if [ "$got" != "$want" ]; then echo "UP FAILED $name :$port served=$got want=$want listener=$listener wrapper=$wrapper"; exit 4; fi
  printf "%s %s %s %s %s\n" "$port" "$wrapper" "$listener" "$fe" "$want" > $R/$name
  css=$(ls $dist/assets | grep -E '^index-.*\.css$' | head -1); cb=$(curl -s http://127.0.0.1:$port/assets/$css | wc -c | tr -d ' ')
  echo "UP $name :$port wrapper=$wrapper listener=$listener anc=$(ancestors $listener | tr '\n' ,) cwd=$fe served=$got css=$css ${cb}B $(date +%T)" | tee -a $S/logs/servers.txt;;
down)
  name=$2; [ -f $R/$name ] || { echo "DOWN $name: no record"; exit 5; }
  read port wrapper listener fe want < $R/$name
  now=$(lsof -nP -iTCP:$port -sTCP:LISTEN -t 2>/dev/null | head -1)
  cwd=$(lsof -a -p $listener -d cwd -Fn 2>/dev/null | sed -n 's/^n//p')
  got=$(served $port)
  if [ "$now" != "$listener" ] || [ "$got" != "$want" ] || { [ "$cwd" != "$(cd $fe && pwd -P)" ] && [ "$cwd" != "$fe" ]; }; then
    echo "DOWN $name REFUSED: port $port listener now=$now recorded=$listener cwd=$cwd served=$got want=$want" | tee -a $S/logs/servers.txt; exit 6; fi
  kill $listener 2>/dev/null; kill $wrapper 2>/dev/null; sleep 1
  echo "DOWN $name :$port killed listener=$listener wrapper=$wrapper; port now $(lsof -nP -iTCP:$port -sTCP:LISTEN -t >/dev/null && echo HELD || echo free) $(date +%T)" | tee -a $S/logs/servers.txt
  mv $R/$name $R/$name.done.$(date +%s);;
esac
