#!/bin/bash
# THE GUARDED SERVER (NOTE-ERASE pass 8; the pass-7 incident, LAWS P7 §B).
#   erase9-serve.sh up   <name> <port> <frontend dir> <dist dir> [<config>]
#   erase9-serve.sh down <name>
# `up` NEVER frees a port: a held port is a sibling's, and it exits 3 naming the holder. It records
# the WRAPPER pid it started, the LISTENER pid, and the dist identity it serves. `down` kills only when
# all three still hold: the port's listener is the recorded listener, the recorded wrapper is among the
# listener's ANCESTORS, the listener's cwd is the recorded frontend dir, and the page serves the recorded
# identity. Any mismatch: it refuses and kills nothing.
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/crit-NOTE-ERASE
R=$S/servers; mkdir -p $R $S/logs
ancestors() { local p=$1; while [ -n "$p" ] && [ "$p" != 1 ] && [ "$p" != 0 ]; do echo $p; p=$(ps -o ppid= -p $p | tr -d ' '); done; }
served() { curl -s --max-time 3 http://127.0.0.1:$1/ | grep -oE 'index-[A-Za-z0-9_-]+\.js' | head -1; }
case $1 in
up)
  name=$2 port=$3 fe=$4 dist=$5 cfg=${6:-.crit9e-build.mts}
  holder=$(lsof -nP -iTCP:$port -sTCP:LISTEN -t 2>/dev/null)
  if [ -n "$holder" ]; then echo "PORT $port HELD by pid $holder (cwd $(lsof -a -p $holder -d cwd -Fn 2>/dev/null | sed -n 's/^n//p')) — not mine, not freed"; exit 3; fi
  want=$(ls $dist/assets | grep -E '^index-.*\.js$')
  (cd $fe && nohup npx vite preview --config $cfg --outDir $dist --host 127.0.0.1 --port $port --strictPort > $S/logs/serve-$name.log 2>&1) < /dev/null > /dev/null 2>&1 &
  wrapper=$!
  for i in $(seq 1 80); do [ "$(served $port)" = "$want" ] && break; sleep 0.5; done
  listener=$(lsof -nP -iTCP:$port -sTCP:LISTEN -t 2>/dev/null | head -1)
  got=$(served $port)
  if [ "$got" != "$want" ] || ! ancestors "$listener" | grep -qx "$wrapper"; then echo "UP FAILED $name :$port served=$got want=$want listener=$listener wrapper=$wrapper"; exit 4; fi
  printf "%s %s %s %s %s\n" "$port" "$wrapper" "$listener" "$fe" "$want" > $R/$name
  echo "UP $name :$port wrapper=$wrapper listener=$listener cwd=$fe served=$got";;
down)
  name=$2; [ -f $R/$name ] || { echo "DOWN $name: no record"; exit 5; }
  read port wrapper listener fe want < $R/$name
  now=$(lsof -nP -iTCP:$port -sTCP:LISTEN -t 2>/dev/null | head -1)
  cwd=$(lsof -a -p $listener -d cwd -Fn 2>/dev/null | sed -n 's/^n//p')
  got=$(served $port)
  if [ "$now" != "$listener" ] || ! ancestors "$listener" | grep -qx "$wrapper" || [ "$cwd" != "$(cd $fe && pwd -P)" -a "$cwd" != "$fe" ] || [ "$got" != "$want" ]; then
    echo "DOWN $name REFUSED: port $port listener now=$now recorded=$listener cwd=$cwd served=$got want=$want"; exit 6; fi
  kill $listener $wrapper 2>/dev/null; sleep 1
  echo "DOWN $name :$port killed listener=$listener wrapper=$wrapper; port now $(lsof -nP -iTCP:$port -sTCP:LISTEN -t >/dev/null && echo HELD || echo free)"
  mv $R/$name $R/$name.done;;
esac
