#!/bin/bash
# srv.sh ensure <tree|uni> | stop : lane :4242 (vite dev, private cacheDir) + control :4260 (w7-control pre-built dist).
# Only PIDs this script recorded are killed, after a cwd check. A held port is a sibling: logged, never killed.
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/PLR-COUNT
G=$HOME/.claude/guard/guarded
CF=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-control/web/frontend
L=$S/logs/srv; mkdir -p $L
feof() { case $1 in tree) echo /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-52/web/frontend;; uni) echo $S/ac/uni/web/frontend;; tri) echo $S/ac/tri/web/frontend;; esac; }
up() { curl -s -o /dev/null -m 5 -w "%{http_code}" http://127.0.0.1:$1/; }
kill_mine() { # port
  [ -f $L/srv-$1.pid ] || return 0
  p=$(cat $L/srv-$1.pid); d=$(cat $L/srv-$1.dir)
  if kill -0 $p 2>/dev/null; then
    cwd=$(lsof -a -p $p -d cwd -Fn 2>/dev/null | sed -n 's/^n//p')
    if [ "$cwd" = "$d" ]; then pkill -TERM -P $p; kill $p; echo "$(date +%T) stopped $1 pid $p (cwd ok $d)" >> $L/srv.log; sleep 4
    else echo "$(date +%T) NOT stopping $1 pid $p: cwd '$cwd' != $d" >> $L/srv.log; fi
  fi
  mv $L/srv-$1.pid $S/trash/srv-$1-$(date +%s).pid 2>/dev/null; mv $L/srv-$1.dir $S/trash/srv-$1-$(date +%s).dir 2>/dev/null
}
start() { # port dir mode cmd..
  port=$1; dir=$2; mode=$3; shift 3
  (cd $dir && nohup $G --timeout 90 -- "$@" > $L/srv-$port.$(date +%s).log 2>&1 & echo $! > $L/srv-$port.pid)
  echo $dir > $L/srv-$port.dir; echo $mode > $L/srv-$port.mode; date +%s > $L/srv-$port.t
  for i in $(seq 1 60); do [ "$(up $port)" = "200" ] && break; sleep 3; done
  echo "$(date +%T) started $port ($mode) pid $(cat $L/srv-$port.pid) http=$(up $port) load $(sysctl -n vm.loadavg)" >> $L/srv.log
}
ensure() { # port mode dir cmd..
  port=$1; mode=$2; dir=$3; shift 3
  age=999999; [ -f $L/srv-$port.t ] && age=$(( $(date +%s) - $(cat $L/srv-$port.t) ))
  cur=$(cat $L/srv-$port.mode 2>/dev/null)
  if [ "$(up $port)" = "200" ] && [ ! -f $L/srv-$port.pid ]; then echo "$(date +%T) $port HELD by a listener this lane did not start" >> $L/srv.log; return 1; fi
  if [ "$(up $port)" = "200" ] && [ "$age" -lt ${RECYCLE:-5000} ] && [ "$cur" = "$mode" ]; then return 0; fi
  # a server of this mode still waiting for its guard slot (or warming) keeps its place in the queue
  if [ -f $L/srv-$port.pid ] && kill -0 $(cat $L/srv-$port.pid) 2>/dev/null && [ "$cur" = "$mode" ] && [ "$age" -lt ${RECYCLE:-5000} ]; then return 0; fi
  kill_mine $port
  if [ "$(up $port)" = "200" ]; then echo "$(date +%T) $port still answers after stop: HELD" >> $L/srv.log; return 1; fi
  start $port $dir $mode "$@"
}
case "$1" in
  ensure)
    m=${2:-tree}; FE=$(feof $m)
    ensure 4242 $m $FE npx vite --config $S/rig/vite.$m.mts --host 127.0.0.1 --port 4242 --strictPort
    ensure 4260 ctl $CF npx vite preview --config .vite-control.config.ts --outDir dist --host 127.0.0.1 --port 4260 --strictPort
    echo "lane($m) $(up 4242) ctl $(up 4260) bundle=$(curl -s -m 5 http://127.0.0.1:4260/ | grep -o 'index-[A-Za-z0-9_-]*\.js' | head -1)" ;;
  switch) # switch tri : the SAME guarded lane process re-serves the one-route tree (vite restarts in-process on its config's
    # edit; no slot is released, so no re-queue). Only from the tree mode, only on this lane's recorded server.
    [ "$2" = "tri" ] && [ "$(cat $L/srv-4242.mode)" = "tree" ] && kill -0 $(cat $L/srv-4242.pid) 2>/dev/null && [ "$(up 4242)" = "200" ] || { echo "$(date +%T) switch refused" >> $L/srv.log; exit 1; }
    TF=$(feof tri)
    printf 'import base from "%s/vite.config.ts";\nexport default { ...base, root: "%s", cacheDir: "%s/vcache-tri" };\n' $TF $TF $S > $S/rig/vite.tree.mts
    ok=0; for i in $(seq 1 40); do sleep 3; curl -s -m 20 "http://127.0.0.1:4242/src/pencil/chrome/PlayerMark/PlayerLobby.vue?raw" | grep -q 'v-if=\\"!chart\\"' && { ok=1; break; }; done
    [ $ok = 1 ] || { echo "$(date +%T) switch UNVERIFIED: the served PlayerLobby.vue has no chart arm" >> $L/srv.log; exit 1; }
    echo tri > $L/srv-4242.mode
    echo "$(date +%T) switched 4242 to tri in-process (pid $(cat $L/srv-4242.pid)) http=$(up 4242)" >> $L/srv.log ;;
  restore) # back to the tree, in the same process when it is alive (the config's edit restarts vite again)
    cp $S/rig/vite.tree.mts.orig $S/rig/vite.tree.mts; echo "$(date +%T) rig/vite.tree.mts restored" >> $L/srv.log
    if [ -f $L/srv-4242.pid ] && kill -0 $(cat $L/srv-4242.pid) 2>/dev/null && [ "$(cat $L/srv-4242.mode)" = "tri" ]; then
      ok=0; for i in $(seq 1 40); do sleep 3; r=$(curl -s -m 20 "http://127.0.0.1:4242/src/pencil/chrome/PlayerMark/PlayerLobby.vue?raw"); [ -n "$r" ] && ! echo "$r" | grep -q 'v-if=\\"!chart\\"' && { ok=1; break; }; done
      [ $ok = 1 ] && echo tree > $L/srv-4242.mode
      echo "$(date +%T) restore 4242 in-process ok=$ok mode=$(cat $L/srv-4242.mode)" >> $L/srv.log
    fi ;;
  stop) kill_mine 4242; kill_mine 4260; echo "lane $(up 4242) ctl $(up 4260)" ;;
esac
