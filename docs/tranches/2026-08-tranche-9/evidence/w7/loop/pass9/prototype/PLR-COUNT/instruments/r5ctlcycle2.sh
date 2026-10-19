#!/bin/bash
# r5ctlcycle.sh: cycle ONLY the control (:4260) so the WebKit π (still queued on the webkit lock) never meets its 90-min guard kill.
# Run only while nothing reads :4260 (π WebKit not started; the unit battery does not serve).
S=$LANE
CF=$CONTROL/web/frontend
L=$S/logs/r5; G=$GUARDED
# (r5ctlcycle2: no π guard check; called inside the WebKit lock before the π reads)
p=$(cat $L/srv-4260.pid); cwd=$(lsof -a -p $p -d cwd -Fn 2>/dev/null | sed -n 's/^n//p')
[ "$cwd" = "$CF" ] || { echo "$(date +%T) NOT cycling 4260 pid $p: cwd '$cwd'" >> $L/srv.log; exit 4; }
kill $p; echo "$(date +%T) stopped 4260 pid $p (cwd ok) to cycle before the WebKit π" >> $L/srv.log; sleep 4
mv $L/srv-4260.pid $S/trash/srv-4260-cycle-$(date +%s).pid
[ "$(curl -s -o /dev/null -m 5 -w '%{http_code}' http://127.0.0.1:4260/)" = "200" ] && { echo "$(date +%T) 4260 HELD after stop" >> $L/srv.log; exit 5; }
(cd $CF && nohup $G --timeout 90 -- npx vite preview --config .vite-control.config.ts --outDir dist --host 127.0.0.1 --port 4260 --strictPort > $L/srv-4260.$(date +%s).log 2>&1 < /dev/null & echo $! > $L/srv-4260.pid)
date +%s > $L/srv-4260.t
for i in $(seq 1 40); do [ "$(curl -s -o /dev/null -m 5 -w '%{http_code}' http://127.0.0.1:4260/)" = "200" ] && break; sleep 3; done
echo "$(date +%T) started 4260 pid $(cat $L/srv-4260.pid) http=$(curl -s -o /dev/null -m 5 -w '%{http_code}' http://127.0.0.1:4260/) id $(curl -s http://127.0.0.1:4260/ | grep -o 'index-[A-Za-z0-9_-]*\.js') load $(sysctl -n vm.loadavg)" >> $L/srv.log
