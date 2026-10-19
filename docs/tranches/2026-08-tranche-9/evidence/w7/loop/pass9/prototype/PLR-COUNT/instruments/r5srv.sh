#!/bin/bash
# r5srv.sh ensure|stop : the lane (:4242, vite dev on the tree, private cacheDir) and the control (:4260, w7-control's
# pre-built dist). Each runs under `guarded --timeout 90`; PIDs recorded; a server older than 70 min is cycled before a
# battery so the guard's 90-min kill never lands mid-row. Only PIDs this script recorded are ever killed, after a cwd check.
S=$LANE
FE=$TREE/web/frontend
CF=$CONTROL/web/frontend
L=$S/logs/r5; mkdir -p $L
G=$GUARDED
up() { curl -s -o /dev/null -m 5 -w "%{http_code}" http://127.0.0.1:$1/; }
age() { [ -f $L/srv-$1.t ] && echo $(( $(date +%s) - $(cat $L/srv-$1.t) )) || echo 999999; }
kill_mine() { # $1 port $2 dir
  [ -f $L/srv-$1.pid ] || return 0
  p=$(cat $L/srv-$1.pid)
  if kill -0 $p 2>/dev/null; then
    cwd=$(lsof -a -p $p -d cwd -Fn 2>/dev/null | sed -n 's/^n//p')
    if [ "$cwd" = "$2" ]; then kill $p; echo "$(date +%T) stopped $1 pid $p (cwd ok)" >> $L/srv.log; sleep 3
    else echo "$(date +%T) NOT stopping $1 pid $p: cwd '$cwd' != $2" >> $L/srv.log; fi
  fi
  mv $L/srv-$1.pid $S/trash/srv-$1-$(date +%s).pid 2>/dev/null
}
start() { # $1 port $2 dir $3.. cmd
  port=$1; dir=$2; shift 2
  (cd $dir && nohup $G --timeout 90 -- "$@" > $L/srv-$port.$(date +%s).log 2>&1 & echo $! > $L/srv-$port.pid)
  date +%s > $L/srv-$port.t
  for i in $(seq 1 40); do [ "$(up $port)" = "200" ] && break; sleep 3; done
  echo "$(date +%T) started $port pid $(cat $L/srv-$port.pid) http=$(up $port) load $(sysctl -n vm.loadavg)" >> $L/srv.log
}
ensure() { # $1 port $2 dir $3.. cmd
  port=$1; dir=$2
  if [ "$(up $port)" = "200" ] && [ "$(age $port)" -lt 4200 ]; then return 0; fi
  if [ "$(up $port)" = "200" ] && [ ! -f $L/srv-$port.pid ]; then echo "$(date +%T) $port HELD by a listener this lane did not start" >> $L/srv.log; return 1; fi
  kill_mine $port $dir
  if [ "$(up $port)" = "200" ]; then echo "$(date +%T) $port still answers after stop: HELD" >> $L/srv.log; return 1; fi
  start "$@"
}
case "$1" in
  ensure)
    ensure 4242 $FE npx vite --config $S/rig/vite.dev.mts --host 127.0.0.1 --port 4242 --strictPort
    ensure 4260 $CF npx vite preview --config .vite-control.config.ts --outDir dist --host 127.0.0.1 --port 4260 --strictPort
    echo "lane $(up 4242) ctl $(up 4260)" ;;
  stop) kill_mine 4242 $FE; kill_mine 4260 $CF; echo "lane $(up 4242) ctl $(up 4260)" ;;
esac
